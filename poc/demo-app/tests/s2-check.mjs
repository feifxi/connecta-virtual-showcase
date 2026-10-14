import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream',
    '--auto-select-desktop-capture-source=Entire screen', '--auto-accept-this-tab-capture',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
  ],
});
const errors = [];
async function client(name) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 800 }, permissions: ['camera', 'microphone'] });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${name}: ${e}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name}: ${m.text()}`); });
  await page.goto(BASE + '/s2');
  await page.getByPlaceholder('ชื่อ').fill(name);
  const t0 = Date.now();
  await page.getByRole('button', { name: 'join' }).click();
  await page.waitForFunction(() => window.__room?.state === 'connected', null, { timeout: 15000 });
  console.log(`${name} connected in ${Date.now() - t0} ms`);
  return page;
}

// What this page receives from remote participants: per track, bytes + video size
const received = (page) => page.evaluate(async () => {
  const out = [];
  for (const p of window.__room.remoteParticipants.values()) {
    for (const pub of p.trackPublications.values()) {
      const s = pub.track ? await pub.track.getReceiverStats() : undefined;
      out.push({ from: p.name, source: pub.source, subscribed: pub.isSubscribed, bytes: s?.bytesReceived ?? 0, size: s?.frameWidth ? `${s.frameWidth}x${s.frameHeight}` : undefined, energy: s?.totalAudioEnergy });
    }
  }
  return out;
});
const videoSizes = (page) => page.$$eval('video', (vs) => vs.map((v) => `${v.dataset.kind}:${v.videoWidth}x${v.videoHeight}`));

const a = await client('Alice');
const b = await client('Bob');

// A turns on camera + screen
const t1 = Date.now();
await a.getByRole('button', { name: 'เปิดกล้อง' }).click();
await b.waitForFunction(() => [...document.querySelectorAll('video[data-kind=camera]')].some((v) => v.videoWidth > 0), null, { timeout: 15000 });
console.log(`camera A→B first frame ${Date.now() - t1} ms`);
const t2 = Date.now();
await a.getByRole('button', { name: 'แชร์จอ' }).click();
try {
  await b.waitForFunction(() => [...document.querySelectorAll('video[data-kind=screen]')].some((v) => v.videoWidth > 0), null, { timeout: 15000 });
  console.log(`screen A→B first frame ${Date.now() - t2} ms`);
} catch { console.log('screen share: no frame on B', await a.locator('header span').allTextContents()); }

// Simulcast layers on A's camera sender
console.log('A camera simulcast layers:', await a.evaluate(() => {
  const t = window.__room.localParticipant.getTrackPublication('camera').track;
  return t.sender.getParameters().encodings.map((e) => `${e.rid ?? '-'}:${e.active ? 'on' : 'off'}`).join(' ');
}));

await sleep(3000);
const r1 = await received(b); await sleep(2000); const r2 = await received(b);
console.log('B receives from A (bytes in 2s):');
for (const x of r2) console.log('  ', x.source, x.subscribed, x.bytes - (r1.find((y) => y.source === x.source)?.bytes ?? 0), x.size ?? '', x.energy !== undefined ? `energy ${x.energy.toFixed(3)}` : '');
console.log('B <video> sizes', await videoSizes(b));
const ra = await received(a); await sleep(2000); const ra2 = await received(a);
console.log('A receives from B mic (bytes in 2s):', ra2.map((x) => `${x.source} ${x.bytes - (ra.find((y) => y.source === x.source)?.bytes ?? 0)}`));
console.log('B audio elements', await b.$$eval('audio', (as) => as.map((x) => `paused=${x.paused} hasStream=${!!x.srcObject}`)));
await b.screenshot({ path: OUT + 's2-bob.png' });

// A stops screen → B screen gone; A leaves → B sees 1 participant
await a.getByRole('button', { name: 'หยุดแชร์จอ' }).click();
await b.waitForFunction(() => !document.querySelector('video[data-kind=screen]'), null, { timeout: 10000 });
console.log('screen stop → removed on B: PASS');
const t3 = Date.now();
await a.getByRole('button', { name: 'ออก' }).click();
await b.waitForFunction(() => window.__room.remoteParticipants.size === 0, null, { timeout: 15000 });
console.log(`A left → B updated in ${Date.now() - t3} ms`);
await a.waitForFunction(() => !window.__room, null, { timeout: 5000 });
console.log('A left → page back to join form:', await a.getByRole('button', { name: 'join' }).isVisible());

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
