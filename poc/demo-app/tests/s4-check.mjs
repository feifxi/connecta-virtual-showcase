import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, INSECURE_AS_SECURE, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });
// S4: presenter P shares screen in booth-2 · visitors A and B start at the spawn point.
// Checks proximity voice (hysteresis 8/12 tiles), booth-only screen share, and how fast subscriptions switch.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({
  executablePath: CHROME, headless: true,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--auto-select-desktop-capture-source=Entire screen',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', INSECURE_AS_SECURE],
});
const errors = [];
const results = [];
const check = (label, ok, extra = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${label}${extra ? ' · ' + extra : ''}`); };

async function open(name, presenter = '') {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 760 }, permissions: ['camera', 'microphone'] });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${name}: ${e}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name}: ${m.text().slice(0, 160)}`); });
  await page.goto(`${BASE}/s4?name=${name}${presenter ? `&presenter=${presenter}` : ''}`);
  await page.getByRole('button', { name: 'join' }).click();
  await page.waitForFunction(() => window.__proximity && window.__phaserGame?.scene.getScene('hall')?.net, null, { timeout: 30000 });
  return page;
}
// Click-to-walk via the scene's target; resolves when the server-side position arrives
async function walkTo(page, x, y) {
  await page.evaluate(([x, y]) => { window.__phaserGame.scene.getScene('hall').target = new window.__Phaser.Math.Vector2(x, y); }, [x, y]);
  await page.waitForFunction(([x, y]) => {
    const r = window.__colyseusRoom; const me = r.state.players.get(r.sessionId);
    return Math.hypot(me.x - x, me.y - y) < 8;
  }, [x, y], { timeout: 20000 });
}
const ids = (page) => page.evaluate(() => window.__colyseusRoom.sessionId);
const subs = (page) => page.evaluate(() => {
  const out = {};
  for (const p of window.__lkRoom.remoteParticipants.values()) {
    const name = window.__colyseusRoom.state.players.get(p.identity)?.name ?? p.identity;
    out[name] = [...p.trackPublications.values()].filter((t) => t.isSubscribed).map((t) => t.source).sort().join(',') || '-';
  }
  return out;
});
const switches = (page, identity, source) => page.evaluate(([i, s]) => window.__proximity.switches.filter((e) => e.identity === i && e.source === s), [identity, source]);
const audioBytes = (page, identity) => page.evaluate(async (i) => {
  const pub = [...window.__lkRoom.remoteParticipants.get(i)?.trackPublications.values() ?? []].find((t) => t.source === 'microphone');
  return (await pub?.track?.getReceiverStats())?.bytesReceived ?? 0;
}, identity);

// 1) presenter walks into booth-2 and shares the screen
const P = await open('P', 'booth-2');
await walkTo(P, 624, 208);
await walkTo(P, 480, 200);
await P.getByRole('button', { name: 'แชร์จอ' }).click();
await P.waitForFunction(() => window.__lkRoom.localParticipant.isScreenShareEnabled, null, { timeout: 10000 });
const pId = await ids(P);

// 2) visitors at the spawn point: hear each other, not the far presenter
const A = await open('A');
const B = await open('B');
const bId = await ids(B);
await sleep(2000);
let sA = await subs(A);
check('A hears B at spawn (near)', sA.B === 'microphone', JSON.stringify(sA));
check('A does not hear/see P (far, outside booth)', sA.P === '-');
const b0 = await audioBytes(A, bId); await sleep(1000); const b1 = await audioBytes(A, bId);
check('audio from B actually flows to A', b1 - b0 > 1000, `${b1 - b0} bytes/s`);
const visitorCanShare = await A.evaluate(async () => { try { await window.__lkRoom.localParticipant.setScreenShareEnabled(true); return true; } catch { return false; } });
check('visitor cannot publish screen share (token grant)', !visitorCanShare);

// 3) A walks into booth-2: P screen + P mic subscribed, B mic dropped beyond 12 tiles (not at 8)
await A.evaluate(() => {
  window.__firstScreenFrame = null;
  const loop = () => { const v = document.querySelector('video[data-kind=screen]'); if (v && v.videoWidth > 0 && !window.__firstScreenFrame) window.__firstScreenFrame = performance.now(); requestAnimationFrame(loop); };
  loop();
});
await walkTo(A, 624, 208);
await walkTo(A, 470, 210);
await A.waitForFunction(() => window.__firstScreenFrame, null, { timeout: 15000 });
sA = await subs(A);
check('A in booth-2 sees P screen + hears P', sA.P?.includes('screen_share') && sA.P?.includes('microphone'), JSON.stringify(sA));
const scr = (await switches(A, pId, 'screen_share')).find((e) => e.on);
const firstFrame = await A.evaluate(() => window.__firstScreenFrame);
console.log(`     screen: decide→subscribed ${Math.round(scr.doneAt - scr.decidedAt)} ms · decide→first frame ${Math.round(firstFrame - scr.decidedAt)} ms`);
const offB = (await switches(A, bId, 'microphone')).find((e) => !e.on);
check('B mic dropped only beyond 12 tiles (hysteresis)', offB && offB.tiles > 12 && offB.tiles < 13.5, `at ${offB?.tiles} tiles · unsubscribed in ${Math.round(offB?.doneAt - offB?.decidedAt)} ms`);
check('A did not flicker on B (1 on + 1 off)', (await switches(A, bId, 'microphone')).length <= 2);
const volP = await A.evaluate((i) => window.__proximity && [...document.querySelectorAll(`audio[data-identity="${i}"]`)].map((a) => a.volume)[0], pId);
check('presenter heard at full volume inside the booth', volP === 1, `volume ${volP}`);
await A.screenshot({ path: OUT + 's4-in-booth.png' });

// 4) B (far away) never got P's screen
check('B (outside booth) never subscribed to P screen', (await switches(B, pId, 'screen_share')).length === 0);

// 5) A walks back out to the corridor: screen goes away, P still heard by distance
await walkTo(A, 624, 208);
await A.waitForFunction(() => !document.querySelector('video[data-kind=screen]'), null, { timeout: 5000 });
// isSubscribed flips at once; TrackUnsubscribed arrives when the server has actually removed the track
await A.waitForFunction((i) => window.__proximity.switches.some((e) => e.identity === i && e.source === 'screen_share' && !e.on && e.doneAt), pId, { timeout: 5000 }).catch(() => {});
const scrOff = (await switches(A, pId, 'screen_share')).find((e) => !e.on);
sA = await subs(A);
check('leaving the booth removes P screen (server removed the track)', !sA.P?.includes('screen_share') && scrOff?.doneAt > 0, `at ${scrOff?.tiles} tiles · removed in ${Math.round(scrOff?.doneAt - scrOff?.decidedAt)} ms`);
check('P still heard by distance from the corridor', sA.P?.includes('microphone'));
const volP2 = await A.evaluate((i) => [...document.querySelectorAll(`audio[data-identity="${i}"]`)].map((a) => a.volume)[0], pId);
console.log(`     P volume from corridor: ${volP2}`);

// 6) B walks up to A: hears A again when closer than 8 tiles
const aId = await ids(A);
const before = (await switches(B, aId, 'microphone')).length;
await walkTo(B, 624, 420);
await B.waitForFunction(([i, n]) => {
  const ev = window.__proximity.switches.filter((e) => e.identity === i && e.source === 'microphone');
  return ev.length > n && ev[ev.length - 1].on && ev[ev.length - 1].doneAt;
}, [aId, before], { timeout: 5000 }).catch(() => {});
const onA = (await switches(B, aId, 'microphone')).slice(before).filter((e) => e.on).pop();
check('B hears A again inside 8 tiles', onA && onA.tiles < 8, `at ${onA?.tiles} tiles · subscribed in ${Math.round(onA?.doneAt - onA?.decidedAt)} ms`);

console.log('errors:', errors.length ? errors : 'none');
console.log(`${results.filter(Boolean).length}/${results.length} passed`);
await browser.close();
