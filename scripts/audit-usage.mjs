import { spawn } from "node:child_process";
import { statSync } from "node:fs";
import net from "node:net";
import { join } from "node:path";
import { chromium } from "playwright";

const root = new URL("..", import.meta.url).pathname;
const auditMode = process.argv.includes("--public") ? "public" : "full";
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

async function assertOpenSourcePopup(page, expectedText) {
  const popupPromise = page.waitForEvent("popup", { timeout: 5000 });
  await page.getByRole("button", { name: /Open Source/i }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded", { timeout: 5000 });

  assert(popup.url().startsWith("blob:"), "Open Source should open a blob-backed source document");
  await popup.getByText(expectedText, { exact: false }).first().waitFor({ state: "visible", timeout: 5000 });
  await popup.close();
}

async function runUsageAudit(baseUrl) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();

  try {
    if (auditMode === "public") {
      await runPublicUsageAudit(baseUrl, page);
      return;
    }

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await expectText(page, "Knowledge Study");
    await expectText(page, "Release-cleared content set.");
    await expectText(page, "Release-cleared works");
    assert((await count(page.getByText("Local-only caution works", { exact: false }))) === 0, "Cleared library should not render local-only group");
    assert((await count(page.locator(".work-card"))) === 3, "Library should render 3 cleared work cards");
    assert((await count(page.locator(".library-section").filter({ hasText: "Release-cleared works" }).locator(".work-card"))) === 3, "Full library should group 3 release-cleared works");
    assert((await count(page.locator(".provenance-notice"))) >= 3, "Library should render provenance notices on work cards");
    assert((await count(page.getByText("Local-only / not release-cleared", { exact: false }))) === 0, "Cleared library should not render local-only labels");

    await page.goto(`${baseUrl}/search?q=Dante`, { waitUntil: "networkidle" });
    const resultCountText = await page.locator(".result-count").textContent();
    const resultCount = Number(resultCountText?.match(/\d+/)?.[0] || 0);
    assert(resultCount > 0, "Search should return results for Dante");
    assert((await count(page.locator(".result-card"))) > 0, "Search should render result cards");
    await expectText(page, "Public-domain primary text");

    await page.goto(`${baseUrl}/work/divine-comedy`, { waitUntil: "networkidle" });
    await expectText(page, "La Divina Commedia");
    await expectText(page, "Public-domain primary text");
    await assertSanitizedReaderContent(page);
    await assertOpenSourcePopup(page, "La Divina Commedia");
    await page.getByRole("button", { name: /Mark Complete/i }).click();
    await expectText(page, "Completed");
    await page.getByRole("button", { name: /^Bookmark$/i }).click();
    await expectText(page, "Bookmarked");

    await page.goto(`${baseUrl}/review`, { waitUntil: "networkidle" });
    await expectText(page, "Review dashboard");
    await expectText(page, "La Divina Commedia");
    await expectText(page, "1");

    await page.goto(`${baseUrl}/study/divine-comedy`, { waitUntil: "networkidle" });
    await expectText(page, "Recall practice");
    await expectText(page, "Public-domain primary text");
    await page.getByRole("button", { name: /Reveal Answer/i }).click();
    await expectText(page, "Hide Answer");
    await page.getByRole("button", { name: /^Next$/i }).click();

    await page.goto(`${baseUrl}/study?work=dantes-revolution`, { waitUntil: "networkidle" });
    await expectText(page, "That work could not be found.");

    await page.goto(`${baseUrl}/work/gay-taleses-sparks-of-light`, { waitUntil: "networkidle" });
    await expectText(page, "That work could not be found.");
  } finally {
    await context.close();
    await browser.close();
  }
}

async function runPublicUsageAudit(baseUrl, page) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await expectText(page, "Knowledge Study");
  await expectText(page, "Public-domain release mode.");
  await expectText(page, "Cleared subset");
  await expectText(page, "Release-cleared works");
  assert((await count(page.getByText("Local-only caution works", { exact: false }))) === 0, "Public build should not render local-only library group");
  assert((await count(page.locator(".work-card"))) === 3, "Public build should render exactly 3 public-domain work cards");
  assert((await count(page.locator(".library-section").filter({ hasText: "Release-cleared works" }).locator(".work-card"))) === 3, "Public library should group all 3 works as release-cleared");
  assert((await count(page.locator(".provenance-badge.public-domain-primary"))) >= 3, "Public build should render public-domain provenance badges");
  assert((await count(page.getByText("Local-only / not release-cleared", { exact: false }))) === 0, "Public build should not render local-only clearance labels");
  assert(
    (await count(page.locator(".work-card").filter({ hasText: "Lecture-derived" }))) === 0,
    "Public build work cards should not render lecture-derived labels",
  );
  assert((await count(page.locator(".work-card").filter({ hasText: "Gay Talese" }))) === 0, "Public build work cards should not render modern-author material");

  await page.goto(`${baseUrl}/search?q=Dante`, { waitUntil: "networkidle" });
  await expectText(page, "La Divina Commedia");
  await expectText(page, "Public-domain primary text");
  assert(
    (await count(page.locator(".result-card").filter({ hasText: "Lecture-derived" }))) === 0,
    "Public search should not render lecture-derived labels",
  );

  await page.goto(`${baseUrl}/work/divine-comedy`, { waitUntil: "networkidle" });
  await expectText(page, "La Divina Commedia");
  await expectText(page, "Public-domain primary text");
  await assertSanitizedReaderContent(page);
  await assertOpenSourcePopup(page, "La Divina Commedia");

  await page.goto(`${baseUrl}/study/divine-comedy`, { waitUntil: "networkidle" });
  await expectText(page, "Recall practice");
  await expectText(page, "Public-domain primary text");
  assert((await count(page.getByText("Uncertified source check:", { exact: false }))) === 0, "Public-domain study cards should not render uncertified source-check prompts");
  assert(
    (await count(page.getByText("Provenance caution: not certified fact unless separately sourced.", { exact: false }))) === 0,
    "Public-domain study cards should not render unresolved provenance cautions",
  );

  await page.goto(`${baseUrl}/work/gay-taleses-sparks-of-light`, { waitUntil: "networkidle" });
  await expectText(page, "That work could not be found.");
}

const distPath = join(root, "dist");
assert(statSync(distPath, { throwIfNoEntry: false })?.isDirectory(), "dist/ is missing; run the matching build command before this audit");

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

if (auditMode === "public") {
  console.log("Public usage audit passed for cleared-mode library, search, reader, Open Source popup, study, and exclusion workflows.");
} else {
  console.log("Usage audit passed for library, search, reader, Open Source popup, review, study, and reader sanitization workflows.");
}
