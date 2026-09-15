import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const compile = (source) => ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const deliveryModule = moduleUrl(compile(await readFile(new URL("../app/contact-delivery.ts", import.meta.url), "utf8")));
const { validateContactMessage, sendContactMessage, CONTACT_EMAIL, CONTACT_SENDER } = await import(deliveryModule);
const envModule = moduleUrl("export const env = {};");
const { env } = await import(envModule);
const routeSource = await readFile(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
const route = compile(routeSource)
  .replace('"../../contact-delivery"', JSON.stringify(deliveryModule))
  .replace('"cloudflare:workers"', JSON.stringify(envModule));
const { POST } = await import(moduleUrl(route));
const message = { name: "Visitor", email: "visitor@example.com", message: "I would like to discuss a project.", website: "" };
const origin = "https://khushpreet.dev/";
const makeRequest = (body = JSON.stringify(message), headers = {}) => new Request(`${origin}api/contact`, {
  method: "POST", headers: { "Content-Type": "application/json", ...headers }, body,
});

test("requires useful contact details and rejects header injection", () => {
  assert.equal(validateContactMessage(message), null);
  assert.match(validateContactMessage({ ...message, name: "   " }), /name/);
  assert.match(validateContactMessage({ ...message, email: "not-an-email" }), /email/);
  assert.match(validateContactMessage({ ...message, message: "   " }), /message/);
  assert.match(validateContactMessage({ ...message, message: "x".repeat(4001) }), /message/);
  assert.match(validateContactMessage({ ...message, name: "Visitor\r\nBcc: victim@example.com" }), /name/);
  assert.match(validateContactMessage({ ...message, email: "visitor@example.com\r\n" }), /email/);
  assert.match(validateContactMessage({ ...message, email: "a,b@example.com" }), /email/);
});

test("uses a fixed sender and recipient with visitor Reply-To and plain Unicode text", async () => {
  let submitted;
  const binding = { async send(value) { submitted = value; return { messageId: "test-id" }; } };
  await sendContactMessage({ ...message, name: " Visitor ", message: "Hello — ਸਤ ਸ੍ਰੀ ਅਕਾਲ <script>alert(1)</script>" }, origin, binding);
  assert.equal(submitted.to, CONTACT_EMAIL);
  assert.equal(submitted.from.email, CONTACT_SENDER);
  assert.deepEqual(submitted.replyTo, { name: "Visitor", email: message.email });
  assert.equal(submitted.subject, "New portfolio enquiry");
  assert.match(submitted.text, /ਸੱਤ|ਸਤ ਸ੍ਰੀ ਅਕਾਲ/);
  assert.match(submitted.text, /https:\/\/khushpreet.dev\//);
  assert.equal(submitted.html, undefined);
});

test("does not send invalid messages or honeypot submissions", async () => {
  let calls = 0;
  const binding = { async send() { calls++; throw new Error("Must not send"); } };
  await assert.rejects(sendContactMessage({ ...message, email: "bad" }, origin, binding), /valid email/);
  await assert.rejects(sendContactMessage({ ...message, website: "bot.example" }, origin, binding), /Unable to submit/);
  assert.equal(calls, 0);
});

test("propagates send failures and rejects unconfirmed sends", async () => {
  await assert.rejects(sendContactMessage(message, origin, { async send() { throw new Error("Sender not verified"); } }), /Sender not verified/);
  for (const result of [undefined, {}, { messageId: "" }]) {
    await assert.rejects(sendContactMessage(message, origin, { async send() { return result; } }), /couldn’t be submitted/);
  }
});

test("the contact API rejects invalid and cross-site requests before delivery", async () => {
  let calls = 0;
  env.CONTACT_EMAIL = { async send() { calls++; throw new Error("Must not send"); } };
  assert.equal((await POST(makeRequest(JSON.stringify(message), { Origin: "https://unrelated.example" }))).status, 403);
  assert.equal((await POST(makeRequest(JSON.stringify(message), { "Sec-Fetch-Site": "cross-site" }))).status, 403);
  assert.equal((await POST(makeRequest("not json"))).status, 400);
  assert.equal((await POST(makeRequest(JSON.stringify({ ...message, name: 42 })))).status, 400);
  assert.equal((await POST(makeRequest(JSON.stringify({ ...message, message: "" })))).status, 422);
  assert.equal((await POST(makeRequest(JSON.stringify({ ...message, website: "bot" })))).status, 422);
  assert.equal((await POST(makeRequest("x".repeat(25000)))).status, 413);
  assert.equal(calls, 0);
});

test("the API reports unavailable email bindings without claiming success", async () => {
  delete env.CONTACT_EMAIL;
  assert.equal((await POST(makeRequest())).status, 503);
});

test("the API only confirms accepted native email sends", async () => {
  env.CONTACT_EMAIL = { async send(value) {
    assert.equal(value.to, CONTACT_EMAIL);
    assert.match(value.text, /https:\/\/khushpreet.dev\//);
    return { messageId: "test-id" };
  } };
  const accepted = await POST(makeRequest());
  assert.equal(accepted.status, 200);
  assert.deepEqual(await accepted.json(), { success: true });
  env.CONTACT_EMAIL = { async send() { throw new Error("Delivery unavailable"); } };
  assert.equal((await POST(makeRequest())).status, 502);
});

test("the form no longer submits to an external form provider", async () => {
  const form = await readFile(new URL("../app/contact-form.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(form, /formsubmit\.co|_subject|_template|_honey/);
  assert.match(form, /action="\/api\/contact"/);
 const config = JSON.parse(
  await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8")
);

assert.ok(
  config.send_email.some(
    (binding) =>
      binding.name === "CONTACT_EMAIL" &&
      binding.destination_address === CONTACT_EMAIL
  )
);
});
