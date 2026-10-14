import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: CHROME, headless: true,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
});
const pages = [];
for (const name of ['P1', 'P2', 'P3', 'P4']) {
  const ctx = await browser.newContext({ permissions: ['camera', 'microphone'] });
  const page = await ctx.newPage();
  page.on('response', (r) => { if (r.status() >= 400) console.log(name, r.status(), r.url()); });
  page.on('console', (m) => { if (/warn|error/.test(m.type()) ) console.log(name, m.type(), m.text().slice(0, 160)); });
  await page.goto(BASE + '/s2');
  await page.getByPlaceholder('ชื่อ').fill(name);
  const t0 = Date.now();
  await page.getByRole('button', { name: 'join' }).click();
  await page.waitForFunction(() => window.__room?.state === 'connected', null, { timeout: 30000 });
  const t1 = Date.now() - t0;
  await page.waitForFunction(() => window.__room?.localParticipant.isMicrophoneEnabled, null, { timeout: 30000 });
  const pair = await page.evaluate(async () => {
    const pc = window.__room.engine.pcManager?.publisher?.pc ?? window.__room.engine.pcManager?.publisher?._pc;
    if (!pc) return 'no pc';
    const st = await pc.getStats(); let sel;
    st.forEach((s) => { if (s.type === 'candidate-pair' && s.nominated && s.state === 'succeeded') sel = s; });
    const loc = sel && st.get(sel.localCandidateId);
    return loc ? `${loc.protocol} ${loc.candidateType}` : 'none';
  });
  console.log(`${name} connected ${t1} ms · mic on ${Date.now() - t0} ms · publisher ${pair}`);
  pages.push(page);
}
// leave: tracks must be stopped
const p = pages[0];
await p.evaluate(() => { window.__r = window.__room; window.__mt = [...window.__room.localParticipant.trackPublications.values()].map((t) => t.track.mediaStreamTrack); });
await p.getByRole('button', { name: 'ออก' }).click();
await new Promise((r) => setTimeout(r, 1000));
console.log('after leave:', await p.evaluate(() => ({
  state: window.__r.state, roomCleared: !window.__room,
  tracks: window.__mt.map((t) => t.kind + ':' + t.readyState),
  ui: document.querySelector('button')?.textContent,
})));
await browser.close();
