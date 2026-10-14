// S3 loadtest: N bots join the hall and random-walk like real players (15 moves/s while walking).
// Usage: npx tsx loadtest/bots.ts --clients 50 --duration 60 [--offset 0] [--event demo] [--endpoint http://localhost:2567]
// Run several processes in parallel for 150+ bots so the bots' own CPU does not skew the numbers.
import { Client, Callbacks, type Room } from '@colyseus/sdk';
import { parseArgs } from 'node:util';
import { loadHallMap } from '../src/hallMap.js';

const { values: args } = parseArgs({
  options: {
    clients: { type: 'string', default: '50' },
    offset: { type: 'string', default: '0' },
    duration: { type: 'string', default: '60' },
    endpoint: { type: 'string', default: 'http://localhost:2567' },
    event: { type: 'string', default: 'demo' },
  },
});
const N = Number(args.clients);
const OFFSET = Number(args.offset);
const DURATION_S = Number(args.duration);
const SEND_HZ = 15;
const SPEED = 200;
const hall = loadHallMap();

type Bot = { room: Room; x: number; y: number; tx: number; ty: number; idleUntil: number; bytes: number; corrections: number };
const bots: Bot[] = [];
const rtts: number[] = [];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function randomTarget() {
  for (;;) {
    const x = 40 + Math.random() * (hall.widthPx - 80);
    const y = 40 + Math.random() * (hall.heightPx - 80);
    if (hall.isWalkable(x, y)) return { x, y };
  }
}

async function join(i: number) {
  const room = await new Client(args.endpoint).joinOrCreate('hall', { name: `bot-${OFFSET + i}`, eventId: args.event });
  const t = randomTarget();
  const bot: Bot = { room, x: 0, y: 0, tx: t.x, ty: t.y, idleUntil: 0, bytes: 0, corrections: 0 };
  const ws = (room.connection.transport as unknown as { ws: WebSocket }).ws;
  ws.addEventListener('message', (e) => (bot.bytes += (e.data as ArrayBuffer).byteLength));
  // Own position comes from the server (spawn point)
  Callbacks.get(room as never).onAdd('players' as never, ((p: { x: number; y: number }, id: string) => {
    if (id === room.sessionId) { bot.x = p.x; bot.y = p.y; }
  }) as never);
  room.onMessage('correct', (pos: { x: number; y: number }) => { bot.corrections++; bot.x = pos.x; bot.y = pos.y; });
  bots.push(bot);
}

const joinStart = Date.now();
for (let i = 0; i < N; i++) {
  await join(i);
  await sleep(20); // ~50 joins/s per process, like people arriving at the start of an event
}
console.log(`[bots ${OFFSET}] ${N} joined in ${Date.now() - joinStart} ms · rooms ${[...new Set(bots.map((b) => b.room.roomId))].join(",")}`);

// Movement: walk to a random target, pause 0–3 s (people stop at booths), repeat
const step = SPEED / SEND_HZ;
const moveTimer = setInterval(() => {
  const now = Date.now();
  for (const b of bots) {
    if (now < b.idleUntil || b.x === 0) continue;
    const dx = b.tx - b.x, dy = b.ty - b.y;
    const d = Math.hypot(dx, dy);
    if (d < step) {
      const t = randomTarget();
      b.tx = t.x; b.ty = t.y; b.idleUntil = now + Math.random() * 3000;
      continue;
    }
    const nx = Math.round(b.x + (dx / d) * step), ny = Math.round(b.y + (dy / d) * step);
    if (!hall.isWalkable(nx, ny)) { const t = randomTarget(); b.tx = t.x; b.ty = t.y; continue; }
    b.x = nx; b.y = ny;
    b.room.send('move', { x: nx, y: ny });
  }
}, 1000 / SEND_HZ);

// Round-trip from 10 bots every second
const pingTimer = setInterval(() => {
  for (const b of bots.slice(0, 10)) {
    const t0 = performance.now();
    b.room.request('ping').then(() => rtts.push(performance.now() - t0)).catch(() => {});
  }
}, 1000);

const pct = (a: number[], p: number) => (a.length ? [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * p))] : NaN);
let cpu = process.cpuUsage();
const reportTimer = setInterval(() => {
  const used = process.cpuUsage(cpu); cpu = process.cpuUsage();
  const kbps = bots.reduce((s, b) => s + b.bytes, 0) / bots.length / 5 / 1024;
  for (const b of bots) b.bytes = 0;
  console.log(
    `[bots ${OFFSET}] down ${kbps.toFixed(1)} KB/s per client · rtt p50 ${pct(rtts, 0.5).toFixed(0)} p99 ${pct(rtts, 0.99).toFixed(0)} ms` +
      ` · corrections ${bots.reduce((s, b) => s + b.corrections, 0)} · bot cpu ${(((used.user + used.system) / 1000 / 5000) * 100).toFixed(0)}%`,
  );
  rtts.length = 0;
}, 5000);

await sleep(DURATION_S * 1000);
clearInterval(moveTimer); clearInterval(pingTimer); clearInterval(reportTimer);
await Promise.all(bots.map((b) => b.room.leave()));
process.exit(0);
