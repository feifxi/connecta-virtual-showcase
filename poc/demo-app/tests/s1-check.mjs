import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--enable-precise-memory-info', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const cdp = await page.context().newCDPSession(page);

const pos = () => page.evaluate(() => {
  const s = window.__phaserGame?.scene.getScene('hall');
  return s?.player ? { x: Math.round(s.player.x), y: Math.round(s.player.y) } : null;
});
const boothText = () => page.locator('header span').nth(1).textContent();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await page.goto(BASE + '/s1');
await page.waitForFunction(() => window.__phaserGame?.scene.getScene('hall')?.player, null, { timeout: 15000 });
const renderer = await page.evaluate(() => window.__phaserGame.renderer.type === 2 ? 'WEBGL' : 'CANVAS');
console.log('renderer', renderer, '· spawn', await pos());
await page.screenshot({ path: OUT + 's1-spawn.png' });

// 1) keyboard: hold W 4s -> should stop at the top wall (wall tile ends at y=32, radius ~10)
await page.locator('canvas').click({ position: { x: 5, y: 5 } }); // focus (sets a click target, cleared by keys)
await page.keyboard.down('w'); await sleep(4000); await page.keyboard.up('w');
const top = await pos();
console.log('after W 4s', top, top.y >= 40 && top.y <= 50 ? 'PASS stopped at wall' : 'CHECK');

// 2) diagonal speed normalized: hold D+S 1s from current point
const a = await pos();
await page.keyboard.down('d'); await page.keyboard.down('s'); await sleep(1000);
await page.keyboard.up('d'); await page.keyboard.up('s');
const b = await pos();
const dist = Math.hypot(b.x - a.x, b.y - a.y);
console.log('diagonal 1s distance', Math.round(dist), '(expect ~200)');

// 3) click-to-walk into booth-2 (tiles x 12..17, y 4..7) -> world center (480, 208)
const cam = await page.evaluate(() => {
  const c = window.__phaserGame.scene.getScene('hall').cameras.main;
  return { sx: c.scrollX, sy: c.scrollY };
});
const canvasBox = await page.locator('canvas').boundingBox();
await page.mouse.click(canvasBox.x + 480 - cam.sx, canvasBox.y + 230 - cam.sy);
await sleep(3500);
console.log('after click booth-2', await pos(), '· header:', await boothText());
await page.screenshot({ path: OUT + 's1-booth.png' });

// 4) table row is solid: walk up inside the booth for 1.5s, y must stay below table bottom (4*32+32=160)
await page.keyboard.down('w'); await sleep(1500); await page.keyboard.up('w');
const t = await pos();
console.log('push into table', t, t.y >= 160 ? 'PASS blocked by table' : 'FAIL');

// 5) leak test: 20 mount/unmount cycles
const heap = async () => {
  await cdp.send('HeapProfiler.collectGarbage');
  return Math.round((await page.evaluate(() => performance.memory.usedJSHeapSize)) / 1048576);
};
const h0 = await heap();
await page.getByRole('button', { name: 'leak test 20x' }).click();
await page.waitForFunction(() => [...document.querySelectorAll('header span')].some((s) => s.textContent?.startsWith('done')), null, { timeout: 60000 });
const h1 = await heap();
const result = await page.locator('header span').last().textContent();
console.log('leak test:', result, `· heap after GC ${h0}→${h1} MB`);

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
