import { mkdirSync } from 'node:fs';
import { spawn, execSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { BASE, CHROME, OUT } from './env.mjs';
mkdirSync(OUT, { recursive: true });
// How many remote tracks one browser can take: `lk perf load-test` publishes N audio (+ V video) tracks into the S4 hall,
// one Chrome tab joins with ?subscribeAll and we measure what it receives and the Chrome CPU.
// Usage: LK=/path/to/lk node s4-tracks.mjs   (LiveKit, realtime and web must be running)
const LK = process.env.LK ?? 'lk';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const scenarios = [[10, 0], [20, 0], [40, 0], [20, 2], [40, 4]];

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// Chrome processes of this headless browser (playwright's temp profile dir is unique to it)
const chromeCpu = () => {
  const out = execSync(`ps -Ao pcpu,command | grep -i "playwright_chromiumdev_profile" | grep -v grep || true`).toString();
  return out.split('\n').filter(Boolean).reduce((s, l) => s + parseFloat(l.trim().split(/\s+/)[0]), 0);
};
const page = await (await browser.newContext({ permissions: ['microphone', 'camera'] })).newPage();
await page.goto(`${BASE}/s4?name=listener&subscribeAll=1`);
await page.getByRole('button', { name: 'join' }).click();
await page.waitForFunction(() => window.__proximity, null, { timeout: 30000 });
// Headless Chrome draws WebGL on the CPU (SwiftShader) — pause the game loop so the numbers show media cost only
await page.waitForFunction(() => window.__phaserGame?.loop, null, { timeout: 20000 });
await page.evaluate(() => window.__phaserGame.loop.sleep());
await sleep(3000);
const idle = [];
for (let i = 0; i < 4; i++) { idle.push(chromeCpu()); await sleep(1500); }
console.log(`baseline (in hall, game paused, nothing received): chrome cpu avg ${(idle.reduce((a, b) => a + b) / idle.length).toFixed(0)}%`);

const received = () => page.evaluate(async () => {
  let audio = 0, video = 0, bytes = 0, frames = 0;
  for (const p of window.__lkRoom.remoteParticipants.values()) {
    for (const pub of p.trackPublications.values()) {
      if (!pub.track) continue;
      const s = await pub.track.getReceiverStats();
      bytes += s?.bytesReceived ?? 0;
      if (pub.kind === 'audio') audio++; else { video++; frames += s?.framesDecoded ?? 0; }
    }
  }
  return { audio, video, bytes, frames };
});

for (const [na, nv] of scenarios) {
  const lk = spawn(LK, ['perf', 'load-test', '--dev', '--room', 'hall-s4-demo', '--audio-publishers', String(na), '--video-publishers', String(nv), '--duration', '30s', '--num-per-second', '20'], { stdio: 'ignore' });
  await sleep(12000); // publishers up + subscriptions settled
  const r0 = await received(); const t0 = Date.now();
  const cpus = [];
  for (let i = 0; i < 4; i++) { cpus.push(chromeCpu()); await sleep(1500); }
  const r1 = await received(); const dt = (Date.now() - t0) / 1000;
  console.log(`audio ${na} + video ${nv} → subscribed audio ${r1.audio}/${na} · video ${r1.video}/${nv} · in ${((r1.bytes - r0.bytes) * 8 / dt / 1e6).toFixed(2)} Mbps · video fps ${nv ? ((r1.frames - r0.frames) / dt / nv).toFixed(0) : '-'} · chrome cpu avg ${(cpus.reduce((a, b) => a + b) / cpus.length).toFixed(0)}% (100% = 1 core)`);
  lk.kill('SIGINT');
  await sleep(6000);
}
await browser.close();
