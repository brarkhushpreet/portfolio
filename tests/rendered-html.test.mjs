import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { register } from "node:module";
import test from "node:test";

// The built worker imports its bindings from `cloudflare:workers`, which only
// exists inside workerd. Resolve it to an empty environment so the same bundle
// can be rendered under Node.
register(`data:text/javascript,${encodeURIComponent(`
export async function resolve(specifier, context, next) {
  if (specifier === "cloudflare:workers") {
    return { url: "data:text/javascript,export const env = {};", shortCircuit: true };
  }
  return next(specifier, context);
}`)}`);

async function render(path = "/", options = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
      ...options,
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Khushpreet's portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Khushpreet Singh — Full-Stack Software Engineer<\/title>/i,
  );
  assert.match(html, /Full-stack software engineer/i);
  assert.match(html, /AI products, realtime systems, and cloud infrastructure/i);
  assert.match(html, /EchoPass/);
  assert.match(html, /Nexus Realtime Chat/);
  assert.match(html, /Vanta Movie Explorer/);
  assert.match(html, /Developer Blog/);
  assert.doesNotMatch(html, /Zyastra Agent Platform|AstraSAR Voice Runtime/);
  assert.match(html, /Software Development Engineer I/);
  assert.match(html, /khushbrar605@gmail\.com/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("the built contact route validates submissions before email delivery", async () => {
  const response = await render("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "http://localhost" },
    body: JSON.stringify({ name: "", email: "invalid", message: "", website: "" }),
  });
  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), { success: false });
});

test("server HTML carries the content without client-side rendering", async () => {
  const html = await (await render()).text();
  // The theme is decided before first paint; dark is the default.
  assert.match(html, /<html[^>]*data-theme="dark"/);
  assert.match(html, /portfolio-theme/);
  // Every section and project is addressable.
  for (const id of ["about", "work", "experience", "contact", "project-echopass", "project-chat", "project-movies", "project-blog"]) {
    assert.match(html, new RegExp(`id="${id}"`), `missing #${id}`);
  }
  assert.match(html, /Selected work/);
  assert.match(html, /Get in touch\./);
  assert.match(html, /Responsive dashboard/);
  assert.match(html, /Responsive workspace/);
  assert.match(html, /Responsive discovery/);
  assert.match(html, /Responsive reading/);
});

test("screenshots captured in both themes ship both variants", async () => {
  const html = await (await render()).text();
  const { projects } = await readContent();
  const paired = projects.flatMap((project) => project.shots).filter((shot) => shot.light);
  assert.ok(paired.length >= 4, "expected light and dark pairs for EchoPass and Nexus");
  for (const shot of paired) {
    assert.ok(html.includes(`class="only-dark" src="${shot.src}"`), `dark variant missing for ${shot.src}`);
    assert.ok(html.includes(`class="only-light" src="${shot.light}"`), `light variant missing for ${shot.light}`);
  }
});

test("every referenced asset exists", async () => {
  const { projects, links } = await readContent();
  const files = new Set([links.resume, "/og.png", "/favicon.svg", "/fonts/geist-latin.woff2", "/fonts/geist-mono-latin.woff2"]);
  for (const project of projects) {
    assert.ok(project.shots[project.lead], `${project.id}: lead shot`);
    for (const shot of project.shots) {
      files.add(shot.src);
      if (shot.light) files.add(shot.light);
      if (shot.video) files.add(shot.video);
    }
  }
  await Promise.all([...files].map((file) => access(new URL(`../public${file}`, import.meta.url))));
});

test("motion respects user preferences", async () => {
  const [motion, clip, css, packageJson] = await Promise.all([
    readFile(new URL("../app/components/motion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/clip.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(motion, /prefers-reduced-motion: no-preference/);
  assert.match(clip, /useReducedMotion/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\[data-theme="light"\]/);
  assert.match(packageJson, /"gsap"/);
  assert.match(packageJson, /"lenis"/);
});

/** Loads the typed content module by stripping its type-only syntax. */
async function readContent() {
  const source = await readFile(new URL("../app/content.ts", import.meta.url), "utf8");
  const { stripTypeScriptTypes } = await import("node:module");
  const url = `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString("base64")}`;
  return import(url);
}
