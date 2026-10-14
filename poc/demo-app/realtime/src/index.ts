import { defineServer, defineRoom } from 'colyseus';
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { HallRoom, live, rejected } from './HallRoom.js';

const PORT = Number(process.env.PORT ?? 2567);

const server = defineServer({
  rooms: {
    // One hall per event: joinOrCreate('hall', { eventId }) only matches rooms of the same event
    hall: defineRoom(HallRoom).filterBy(['eventId']),
  },
});

await server.listen(PORT);
console.log(`realtime listening on :${PORT}`);

// STATS=1: print CPU / memory / event-loop lag every 5s (used by the S3 loadtest)
if (process.env.STATS) {
  const loop = monitorEventLoopDelay({ resolution: 10 });
  loop.enable();
  let cpu = process.cpuUsage();
  let at = performance.now();
  setInterval(() => {
    const used = process.cpuUsage(cpu);
    const elapsedMs = performance.now() - at;
    const cpuPct = ((used.user + used.system) / 1000 / elapsedMs) * 100;
    console.log(
      `[stats] rooms ${live.rooms} · clients ${live.clients} · cpu ${cpuPct.toFixed(1)}% · rss ${Math.round(process.memoryUsage().rss / 1048576)} MB` +
        ` · loop p99 ${(loop.percentile(99) / 1e6).toFixed(1)} ms · rejected speed ${rejected.speed} wall ${rejected.wall}`,
    );
    loop.reset();
    cpu = process.cpuUsage();
    at = performance.now();
  }, 5000);
}
