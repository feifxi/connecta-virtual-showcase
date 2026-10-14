import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [];
async function open(name) {
  const page = await (await browser.newContext({ viewport: { width: 1000, height: 700 } })).newPage();
  page.on('pageerror', (e) => errors.push(`${name}: ${e}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|404/.test(m.text())) errors.push(`${name}: ${m.text()}`); });
  await page.goto(`${BASE}/s3?name=${name}`);
  await page.waitForFunction(() => window.__phaserGame?.scene.getScene('hall')?.net, null, { timeout: 20000 });
  return page;
}
const me = (p) => p.evaluate(() => { const s = window.__phaserGame.scene.getScene('hall'); return { x: Math.round(s.player.x), y: Math.round(s.player.y) }; });
const remotes = (p) => p.evaluate(() => [...window.__phaserGame.scene.getScene('hall').net.remotes.entries()].map(([id, r]) => ({ name: r.label.text, x: Math.round(r.sprite.x), y: Math.round(r.sprite.y) })));

const a = await open('Alice');
const b = await open('Bob');
await sleep(500);
console.log('A sees', await remotes(a), '· B sees', await remotes(b));

// A walks right 1s; B should see A at A's position (after interp delay)
await a.locator('canvas').click({ position: { x: 500, y: 350 } }); await sleep(300);
await a.keyboard.down('d'); await sleep(1000); await a.keyboard.up('d');
await sleep(400);
const aPos = await me(a); const seen = (await remotes(b)).find((r) => r.name === 'Alice');
console.log('A real', aPos, '· B sees A at', seen, '· diff', Math.hypot(aPos.x - seen.x, aPos.y - seen.y).toFixed(1), 'px');

// end-to-end latency: A moves, poll B until A's remote starts moving
const before = (await remotes(b)).find((r) => r.name === 'Alice');
await b.evaluate(() => { window.__t0 = null; });
const t0 = Date.now();
await a.keyboard.down('a');
await b.waitForFunction((bx) => [...window.__phaserGame.scene.getScene('hall').net.remotes.values()].some((r) => r.label.text === 'Alice' && Math.abs(r.sprite.x - bx) > 2), before.x, { polling: 5, timeout: 5000 });
console.log('A key → B sees movement', Date.now() - t0, 'ms (incl. 120 ms interp delay + send 15 Hz + patch)');
await a.keyboard.up('a');

// cheat: teleport across the map → server must reject and correct
await sleep(500);
const pre = await me(a);
await a.evaluate(() => window.__colyseusRoom.send('move', { x: 1200, y: 100 }));
await sleep(400);
const seenAfterCheat = (await remotes(b)).find((r) => r.name === 'Alice');
console.log('teleport cheat → A', await me(a), '(was', pre, ') · B sees', seenAfterCheat);
// cheat: walk up until blocked (wall or booth table), then claim a spot 16 px inside it —
// inside the distance budget, so only the wall check can stop it
await a.keyboard.down('w'); await sleep(5000); await a.keyboard.up('w');
await sleep(300);
const atWall = await me(a);
const c0 = await a.evaluate(() => window.__phaserGame.scene.getScene('hall').net.corrections);
await a.evaluate(({ x, y }) => window.__colyseusRoom.send('move', { x, y: y - 16 }), atWall);
await sleep(400);
const c1 = await a.evaluate(() => window.__phaserGame.scene.getScene('hall').net.corrections);
console.log('wall cheat from', atWall, '→ corrected', c1 - c0, 'time(s) · B sees', (await remotes(b)).find((r) => r.name === 'Alice'), c1 - c0 === 1 ? 'PASS' : 'FAIL');
// bad payload → validation disconnects
const c = await open('Mallory');
await c.evaluate(() => window.__colyseusRoom.send('move', { x: 'abc' }));
await sleep(600);
console.log('bad payload → Mallory still in room?', (await remotes(a)).some((r) => r.name === 'Mallory'));

// B leaves (navigate away) → A should drop B
await b.goto(BASE + '/');
await sleep(800);
console.log('after Bob left, A sees', (await remotes(a)).map((r) => r.name));
console.log('header A:', await a.locator('header span').nth(2).textContent());
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
