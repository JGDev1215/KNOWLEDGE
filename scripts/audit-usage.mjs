import { spawn } from "node:child_process";
import { statSync } from "node:fs";
import net from "node:net";
import { join } from "node:path";
import { chromium } from "playwright";

const root = new URL("..", import.meta.url).pathname;
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close(() => {
        if (port) resolve(port);
        else reject(new Error("Unable to allocate a local preview port"));
      });
    });
  });
}

async function waitForPreview(url, processRef) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 15000) {
    if (processRef.exitCode !== null) {
      throw new Error(`vite preview exited early with code ${processRef.exitCode}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for preview server at ${url}`);
}

async function expectText(page, text, label = text) {
  await page.getByText(text, { exact: false }).first().waitFor({ state: "visible", timeout: 5000 });
  assert(true, label);
}

async function count(locator) {
  return locator.count();
}

async function assertSanitizedReaderContent(page) {
  const unsafeCounts = await page.locator(".source-content").evaluate((root) => {
    const disallowedSelector = [
      "script",
      "style",
      "button",
      "input",
      "select",
      "textarea",
      "form",
      "iframe",
      "object",
      "embed",
      "link",
      "meta",
      "base",
      "[srcdoc]",
      "[style]",
    ].join(",");
    const eventAttrs = Array.from(root.querySelectorAll("*")).filter((node) =>
      Array.from(node.attributes).some((attribute) => attribute.name.toLowerCase().startsWith("on")),
    );
    const unsafeUrls = Array.from(root.querySelectorAll("[href], [src], [xlink\\:href], [action]")).filter((node) =>
      Array.from(node.attributes).some((attribute) => /^(javascript|vbscript|file):/i.test(attribute.value.trim())),
    );

    return {
      disallowedElements: root.querySelectorAll(disallowedSelector).length,
      eventAttrs: eventAttrs.length,
      unsafeUrls: unsafeUrls.length,
    };
  });

  assert(unsafeCounts.disallowedElements === 0, "Reader content should not contain active embedded elements or inline styles");
  assert(unsafeCounts.eventAttrs === 0, "Reader content should not contain inline event handlers");
  assert(unsafeCounts.unsafeUrls === 0, "Reader content should not contain unsafe URL protocols");
}

async function runUsageAudit(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await expectText(page, "Knowledge Study");
    await expectText(page, "Not public-release ready.");
    await expectText(page, "Transcript rights and unresolved claims must be cleared before certification.");
    assert((await count(page.locator(".work-card"))) === 13, "Library should render 13 work cards");
    assert((await count(page.locator(".provenance-notice"))) >= 13, "Library should render provenance notices on work cards");

    await page.goto(`${baseUrl}/search?q=Dante`, { waitUntil: "networkidle" });
    const resultCountText = await page.locator(".result-count").textContent();
    const resultCount = Number(resultCountText?.match(/\d+/)?.[0] || 0);
    assert(resultCount > 0, "Search should return results for Dante");
    assert((await count(page.locator(".result-card"))) > 0, "Search should render result cards");
    await expectText(page, "Lecture-derived interpretation");

    await page.goto(`${baseUrl}/work/gay-taleses-sparks-of-light`, { waitUntil: "networkidle" });
    await expectText(page, "Gay Talese's Sparks of Light");
    await expectText(page, "Lecture-derived modern-author material");
    await expectText(page, "Penguin Random House author page");
    await assertSanitizedReaderContent(page);
    await page.getByRole("button", { name: /Mark Complete/i }).click();
    await expectText(page, "Completed");
    await page.getByRole("button", { name: /^Bookmark$/i }).click();
    await expectText(page, "Bookmarked");

    await page.goto(`${baseUrl}/review`, { waitUntil: "networkidle" });
    await expectText(page, "Review dashboard");
    await expectText(page, "Gay Talese's Sparks of Light");
    await expectText(page, "1");

    await page.goto(`${baseUrl}/study/gay-taleses-sparks-of-light`, { waitUntil: "networkidle" });
    await expectText(page, "Recall practice");
    await expectText(page, "Lecture-derived modern-author material");
    await page.getByRole("button", { name: /Reveal Answer/i }).click();
    await expectText(page, "Hide Answer");
    await page.getByRole("button", { name: /^Next$/i }).click();

    await page.goto(`${baseUrl}/study?work=dantes-revolution`, { waitUntil: "networkidle" });
    await expectText(page, "Dante's Revolution");
    await expectText(page, "Lecture-derived interpretation");

    await page.goto(`${baseUrl}/work/dantes-la-commedia?section=dantes-la-commedia-section-4`, { waitUntil: "networkidle" });
    await expectText(page, "Study Cards");
    await assertSanitizedReaderContent(page);

    await page.goto(`${baseUrl}/work/great-books-secrets`, { waitUntil: "networkidle" });
    await expectText(page, "Source not fully documented");
    await expectText(page, "No matching raw script is tracked");
    await assertSanitizedReaderContent(page);
  } finally {
    await context.close();
    await browser.close();
  }
}

const distPath = join(root, "dist");
assert(statSync(distPath, { throwIfNoEntry: false })?.isDirectory(), "dist/ is missing; run npm run build first");

const port = await getFreePort();
const baseUrl = `http://127.0.0.1:${port}`;
const viteBin = join(root, "node_modules", ".bin", "vite");
const preview = spawn(viteBin, ["preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"],
  shell: false,
});

let previewOutput = "";
preview.stdout.on("data", (chunk) => {
  previewOutput += chunk.toString();
});
preview.stderr.on("data", (chunk) => {
  previewOutput += chunk.toString();
});

try {
  await waitForPreview(baseUrl, preview);
  await runUsageAudit(baseUrl);
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  preview.kill("SIGTERM");
}

if (failures.length > 0) {
  console.error("Usage audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  if (previewOutput.trim()) {
    console.error("\nPreview output:");
    console.error(previewOutput.trim());
  }
  process.exit(1);
}

console.log("Usage audit passed for library, search, reader, review, study, and reader sanitization workflows.");
