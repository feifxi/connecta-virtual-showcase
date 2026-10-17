// Hall preset POC check: /presets · booths follow the project count · add during event moves no one · walk into a booth · no errors.
// Screenshots -> out/
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = true;
const check = (ok, msg) => { console.log(ok ? 'PASS' : 'FAIL', msg); pass &&= ok; };

const scene = () => 'window.__phaserGame.scene.getScene("presets")';
const state = () => page.evaluate((s) => {
  const sc = eval(s);
  return {
    preset: sc.preset, capacity: sc.slots.length, booths: sc.slots.filter((x) => x.booth).length,
    slots: Object.fromEntries(sc.slots.filter((x) => x.booth).map((x) => [x.booth.no, x.id])),
    order: sc.slots.filter((x) => x.booth).map((x) => [x.booth.no, x.booth.category]),
    blocks: [...sc.blockRects.keys()].map((id) => [...new Set(sc.slots.filter((x) => x.block === id && x.booth).map((x) => x.booth.category))].join('+')),
    fps: Math.round(window.__phaserGame.loop.actualFps),
  };
}, scene());
const ready = () => page.waitForFunction((s) => { try { return eval(s)?.player?.active && eval(s).slots.length > 0; } catch { return false; } }, scene(), { timeout: 20000 });
const shot = async (name) => {
  // zoom out to the whole map for the screenshot
  await page.evaluate((s) => { const sc = eval(s); const cam = sc.cameras.main; cam.stopFollow(); cam.setZoom(Math.min(cam.width / sc.map.widthInPixels, cam.height / sc.map.heightInPixels)); cam.centerOn(sc.map.widthInPixels / 2, sc.map.heightInPixels / 2); }, scene());
  await sleep(400);
  await page.screenshot({ path: `${OUT}${name}.png` });
  await page.evaluate((s) => { const sc = eval(s); sc.cameras.main.setZoom(2).startFollow(sc.player, true, 0.12, 0.12); }, scene());
};

await page.goto(BASE + '/presets');
await ready();
await sleep(1200);
let s = await state();
check(s.preset === 'hall' && s.capacity === 30 && s.booths === 18, `hall default: ${s.booths}/${s.capacity} booths`);
const runs = (o) => o.map((x) => x[1]).filter((c, i, a) => c !== a[i - 1]).length;
check(runs(s.order) === 4, `each category in one run (fill order): ${s.blocks.join(' | ')}`);
await shot('presets-hall-18-categories');
check(await page.getByText('Block A1: lounge').isVisible() && await page.getByText('Block C1: lounge').isVisible(), 'empty blocks A1 + C1 become lounges');

// hearing range: stand in the main lounge, compare 5 vs 8 tiles
await page.evaluate((s) => { const sc = eval(s); sc.player.setPosition(42.5 * 32, 24 * 32); }, scene());
await sleep(600);
const heard = async () => Number((await page.getByText(/You hear \d+ people/).innerText()).match(/\d+/)[0]);
const h5 = await heard();
await page.getByRole('button', { name: '8 tiles (compare)' }).click();
await sleep(500);
const h8 = await heard();
check(h8 >= h5, `hearing in lounge: 5 tiles = ${h5} people · 8 tiles = ${h8} people`);
await page.screenshot({ path: `${OUT}presets-range-8.png` });
await page.getByRole('button', { name: '5 tiles (Gather)' }).click();
await sleep(400);
await page.screenshot({ path: `${OUT}presets-range-5.png` });

// no categories: same slots, list order
await page.getByRole('button', { name: 'No categories' }).click();
await sleep(500);
s = await state();
check(s.booths === 18 && s.order.every((x, i) => Number(x[0]) === i + 1), 'no categories: 18 booths in list order');
await shot('presets-hall-18-nocat');

// back to categories, then add during the event: nobody moves
await page.getByRole('button', { name: 'By category' }).click();
await sleep(400);
const before = (await state()).slots;
await page.getByRole('button', { name: '+ Add booth during the event' }).click();
await sleep(400);
s = await state();
const moved = Object.entries(before).filter(([no, slot]) => s.slots[no] !== slot);
check(s.booths === 19 && moved.length === 0, `add booth: ${s.booths} booths · moved ${moved.length}`);

// fill to capacity then one more -> full message
await page.locator('input[type=range]').fill('30');
await sleep(400);
await page.getByRole('button', { name: '+ Add booth during the event' }).click();
await sleep(300);
check(await page.getByText('All slots are taken').isVisible(), 'full hall shows message');
check((await state()).booths === 30, 'still 30 booths');
await shot('presets-hall-30');

// walk into the first booth by click path
await page.locator('input[type=range]').fill('12');
await sleep(400);
const target = await page.evaluate((s) => { const sc = eval(s); const b = sc.slots.find((x) => x.booth); return { x: b.rect.centerX, y: b.rect.bottom - 20, title: b.booth.title }; }, scene());
await page.evaluate(({ s, x, y }) => { const sc = eval(s); sc.path = sc.nav.find(sc.player.x, sc.player.y - 4, x, y) ?? []; }, { s: scene(), x: target.x, y: target.y });
await page.waitForFunction((t) => document.body.innerText.includes(t), target.title, { timeout: 30000 }).catch(() => {});
check(await page.getByText(target.title).first().isVisible(), `walked into booth "${target.title}"`);

// Room preset
await page.getByRole('button', { name: 'Room · 12' }).click();
await page.waitForFunction((s) => { try { return eval(s).preset === 'room' && eval(s).player?.active; } catch { return false; } }, scene(), { timeout: 20000 });
await sleep(800);
s = await state();
check(s.capacity === 12 && s.booths === 12, `room: ${s.booths}/${s.capacity}`);
await page.locator('input[type=range]').fill('7');
await sleep(400);
s = await state();
check(s.booths === 7, `room with 7 projects: ${s.blocks.join(' | ')}`);
await shot('presets-room-7');
await page.getByRole('button', { name: 'No categories' }).click();
await sleep(400);
await shot('presets-room-7-nocat');

await sleep(1500);
s = await state();
console.log('fps', s.fps);
check(errors.length === 0, `no errors ${errors.length ? JSON.stringify(errors.slice(0, 3)) : ''}`);
await browser.close();
console.log(pass ? 'ALL PASS' : 'SOME FAILED');
process.exit(pass ? 0 : 1);
