import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--enable-precise-memory-info', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const cdp = await page.context().newCDPSession(page);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(BASE + '/s1');
await page.waitForFunction(() => window.__phaserGame?.scene.getScene('hall')?.player, null, { timeout: 15000 });
const heap = async () => { for (let i = 0; i < 3; i++) { await cdp.send('HeapProfiler.collectGarbage'); await sleep(200); } return +((await page.evaluate(() => performance.memory.usedJSHeapSize)) / 1048576).toFixed(1); };
const btn = page.locator('header button').first();
const out = [await heap()];
for (let r = 0; r < 5; r++) {
  for (let i = 0; i < 20; i++) { await btn.click(); await sleep(150); await btn.click(); await sleep(700); }
  out.push(await heap());
}
console.log('heap MB after GC, every 20 cycles (100 total):', out.join(' → '));
await browser.close();
