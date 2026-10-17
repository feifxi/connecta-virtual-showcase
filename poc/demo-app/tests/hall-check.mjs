// Hall art POC check: loads /hall, walks into a booth by click, checks NPCs, fps, collision, errors. Screenshots -> out/
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const scene = () => page.evaluate(() => {
  const s = window.__phaserGame?.scene.getScene('showcase');
  return s?.player ? { x: Math.round(s.player.x), y: Math.round(s.player.y), npcs: s.npcs.length, fps: Math.round(window.__phaserGame.loop.actualFps) } : null;
});
let pass = true;
const check = (ok, msg) => { console.log(ok ? 'PASS' : 'FAIL', msg); pass &&= ok; };

await page.goto(BASE + '/hall');
await page.waitForFunction(() => window.__phaserGame?.scene.getScene('showcase')?.player, null, { timeout: 20000 });
await sleep(1500);
const s0 = await scene();
console.log('spawn', s0);
check(s0.npcs >= 40, `NPCs ${s0.npcs}`);
await page.screenshot({ path: OUT + 'hall-spawn.png' });

// click-to-walk into booth 14 (path finding around props)
const target = await page.evaluate(() => {
  const s = window.__phaserGame.scene.getScene('showcase');
  const b = s.booths.find((x) => x.no === '14');
  return { x: b.rect.centerX, y: b.rect.bottom - 20 };
});
await page.evaluate(({ x, y }) => {
  const s = window.__phaserGame.scene.getScene('showcase');
  s.path = s.findPath(s.player.x, s.player.y - 4, x, y) ?? [];
}, target);
await sleep(9000);
const s1 = await scene();
console.log('after walk', s1, 'target', target);
const card = await page.getByText('Booth 14').count();
check(card > 0, 'booth card shows when inside a booth');
check(Math.hypot(s1.x - target.x, s1.y - target.y) < 24, 'arrived at booth');
await page.screenshot({ path: OUT + 'hall-booth.png' });

// keyboard: walk up into the booth table / backdrop -> must be blocked (not pass through)
await page.locator('canvas').click({ position: { x: 700, y: 450 } });
await page.evaluate(() => { const s = window.__phaserGame.scene.getScene('showcase'); s.path = []; });
await page.keyboard.down('w'); await sleep(1500); await page.keyboard.up('w');
const s2 = await scene();
const tableBottom = await page.evaluate(() => {
  const s = window.__phaserGame.scene.getScene('showcase');
  const b = s.booths.find((x) => x.no === '14');
  return b.rect.y + 3.3 * 32;
});
check(s2.y > tableBottom - 20, `blocked by booth table (y ${s2.y} vs table ${Math.round(tableBottom)})`);

// overview at zoom 1
await page.evaluate(() => window.__phaserGame.scene.getScene('showcase').cameras.main.setZoom(1));
await sleep(800);
await page.screenshot({ path: OUT + 'hall-overview.png' });
const s3 = await scene();
console.log('fps', s3.fps, '(headless swiftshader, lower than a real GPU)');

check(errors.length === 0, `no page errors${errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''}`);
await browser.close();
console.log(pass ? 'ALL PASS' : 'SOME FAILED');
process.exit(pass ? 0 : 1);
