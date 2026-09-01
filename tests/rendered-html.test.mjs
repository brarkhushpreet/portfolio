import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
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
  assert.match(html, /making AI systems survive the real world/i);
  assert.match(html, /EchoPass/);
  assert.match(html, /Nexus Realtime Chat/);
  assert.match(html, /Vanta Movie Explorer/);
  assert.match(html, /Developer Blog/);
  assert.doesNotMatch(html, /Zyastra Agent Platform|AstraSAR Voice Runtime/);
  assert.match(html, /Software Development Engineer I/);
  assert.match(html, /khushbrar@gmail\.com/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("ships the portfolio assets and animation system", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    access(new URL("../public/Khushpreet_Singh_Resume.pdf", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/projects/echopass-dashboard.png", import.meta.url)),
    access(new URL("../public/projects/echopass-mobile.png", import.meta.url)),
    access(new URL("../public/projects/chat-workspace.png", import.meta.url)),
    access(new URL("../public/projects/chat-mobile.png", import.meta.url)),
    access(new URL("../public/projects/movie-browse.png", import.meta.url)),
    access(new URL("../public/projects/movie-mobile.png", import.meta.url)),
    access(new URL("../public/projects/blog-home.png", import.meta.url)),
    access(new URL("../public/projects/blog-mobile.png", import.meta.url)),
  ]);

  assert.match(page, /from "gsap"/);
  assert.match(page, /ScrollTrigger/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /portfolio-theme/);
  assert.match(page, /ProjectEntry/);
  assert.match(page, /ProjectSlider/);
  assert.match(page, /@\/components\/ui\/carousel/);
  assert.match(page, /Responsive dashboard/);
  assert.match(page, /Responsive workspace/);
  assert.match(page, /Responsive discovery/);
  assert.match(page, /Responsive reading/);
  assert.match(page, /SignalName/);
  assert.match(page, /theme-switch/);
  assert.match(layout, /og\.png/);
  assert.match(packageJson, /"gsap"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
