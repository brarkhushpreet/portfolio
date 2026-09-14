import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../app/contact-delivery.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const deliveryModule = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const { validateContactMessage, sendContactMessage, CONTACT_ENDPOINT } = await import(deliveryModule);
const routeSource = await readFile(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
const route = ts.transpileModule(routeSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace('"../../contact-delivery"', JSON.stringify(deliveryModule));
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(route).toString("base64")}`);
const message = { name: "Visitor", email: "visitor@example.com", message: "I would like to discuss a project.", website: "" };
const origin = "https://portfolio.example/";

test("requires useful contact details before submitting", () => {
  assert.equal(validateContactMessage(message), null);
  assert.match(validateContactMessage({ ...message, name: "   " }), /name/);
  assert.match(validateContactMessage({ ...message, email: "not-an-email" }), /email/);
  assert.match(validateContactMessage({ ...message, message: "   " }), /message/);
  assert.match(validateContactMessage({ ...message, message: "x".repeat(4001) }), /message/);
});

test("submits the visitor's details to the contact mailbox", async (t) => {
  let submitted;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, CONTACT_ENDPOINT);
    assert.equal(options.method, "POST");
    submitted = JSON.parse(options.body);
    return Response.json({ success: "true" });
  });
  await sendContactMessage({ ...message, name: " Visitor " }, origin, new AbortController().signal);
  assert.equal(submitted.name, "Visitor");
  assert.equal(submitted.email, message.email);
  assert.equal(submitted.message, message.message);
  assert.equal(submitted._url, origin);
});

test("rejects failed delivery responses instead of reporting success", async (t) => {
  for (const [status, body] of [[200, { success: false }], [200, { success: "false" }], [429, { success: true }], [200, {}]]) {
    const mock = t.mock.method(globalThis, "fetch", async () => Response.json(body, { status }));
    await assert.rejects(sendContactMessage(message, origin, new AbortController().signal), /couldn’t be submitted/);
    mock.mock.restore();
  }
});

test("does not send invalid messages or honeypot submissions", async (t) => {
  const transport = t.mock.method(globalThis, "fetch", async () => { throw new Error("Must not reach delivery"); });
  await assert.rejects(sendContactMessage({ ...message, email: "bad" }, origin, new AbortController().signal), /valid email/);
  await assert.rejects(sendContactMessage({ ...message, website: "bot.example" }, origin, new AbortController().signal), /Unable to submit/);
  assert.equal(transport.mock.callCount(), 0);
});

test("passes cancellation to delivery and propagates network failures", async (t) => {
  const controller = new AbortController();
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.signal, controller.signal);
    throw new TypeError("Failed to fetch");
  });
  await assert.rejects(sendContactMessage(message, origin, controller.signal), /Failed to fetch/);
});

test("the contact API rejects invalid and cross-site requests before delivery", async (t) => {
  const transport = t.mock.method(globalThis, "fetch", async () => { throw new Error("Must not reach delivery"); });
  const makeRequest = (body, headers = {}) => new Request("https://portfolio.example/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json", ...headers }, body,
  });
  assert.equal((await POST(makeRequest(JSON.stringify(message), { Origin: "https://unrelated.example" }))).status, 403);
  assert.equal((await POST(makeRequest("not json"))).status, 400);
  assert.equal((await POST(makeRequest(JSON.stringify({ ...message, name: 42 })))).status, 400);
  assert.equal((await POST(makeRequest(JSON.stringify({ ...message, message: "" })))).status, 422);
  assert.equal((await POST(makeRequest(JSON.stringify({ ...message, website: "bot" })))).status, 422);
  assert.equal((await POST(makeRequest("x".repeat(25000)))).status, 413);
  assert.equal(transport.mock.callCount(), 0);
});

test("the contact API uses its current site address and only confirms accepted messages", async (t) => {
  let providerAccepts = true;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.headers.Origin, "http://localhost:3000");
    return Response.json({ success: providerAccepts });
  });
  const makeRequest = () => new Request("http://localhost:3000/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" }, body: JSON.stringify(message),
  });
  const accepted = await POST(makeRequest());
  assert.equal(accepted.status, 200);
  assert.deepEqual(await accepted.json(), { success: true });
  providerAccepts = false;
  assert.equal((await POST(makeRequest())).status, 502);
});
