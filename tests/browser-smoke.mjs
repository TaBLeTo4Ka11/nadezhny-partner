import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseURL = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    const response = await page.goto(baseURL, { waitUntil: "domcontentloaded", timeout: 30_000 });
    assert.ok(response && response.ok(), `Homepage returned HTTP ${response?.status()}`);
    await page.locator("#root").waitFor({ state: "attached" });
    await page.waitForFunction(() => {
      const root = document.querySelector("#root");
      return Boolean(root && root.childElementCount > 0);
    }, { timeout: 20_000 });
    assert.match(await page.title(), /Надёжный партнёр/i);
    await page.screenshot({ path: `playwright-${viewport.name}.png`, fullPage: true });
    await page.waitForTimeout(1_000);
    assert.deepEqual(pageErrors, [], `Uncaught browser errors at ${viewport.name}: ${pageErrors.join("; ")}`);
    results.push({ viewport: viewport.name, title: await page.title(), rootMounted: true });
    await page.close();
  }
  process.stdout.write(JSON.stringify({ ok: true, results }, null, 2) + "\n");
} finally {
  await browser.close();
}
