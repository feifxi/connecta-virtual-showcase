import { Room, validate, type Client } from 'colyseus';
import { z } from 'zod';
import { HallState, Player } from './schema.js';
import { loadHallMap } from './hallMap.js';

const TICK_HZ = Number(process.env.TICK_HZ ?? 15);
const SPEED = 200; // px/s, same as the client
const SPEED_TOLERANCE = 1.2;
// Distance budget: refills at SPEED × tolerance per second, capped at half a second of walking.
// Moves that arrive bunched together (wifi jitter, a stalled tab) spend saved-up budget instead of being
// rejected one by one; a teleport still needs more budget than can ever be saved.
const MAX_BUDGET_PX = SPEED * 0.5;

const hall = loadHallMap();

// Rejected moves since start, by reason — printed by STATS=1 (a non-zero "speed" in normal play means the limit is too tight)
export const rejected = { speed: 0, wall: 0 };
export const live = { rooms: 0, clients: 0 };

export class HallRoom extends Room<{ state: HallState }> {
  state = new HallState();
  maxClients = Number(process.env.MAX_CLIENTS ?? 300);
  patchRate = 1000 / TICK_HZ;
  maxMessagesPerSecond = 60; // client sends ~15/s; anything far above is abuse

  private budget = new Map<string, { px: number; at: number }>();

  messages = {
    // Client-predicted movement: the client moves itself, the server only accepts plausible positions
    move: validate(z.object({ x: z.number().finite(), y: z.number().finite() }), (client, { x, y }) => {
      const p = this.state.players.get(client.sessionId);
      if (!p) return;
      const now = Date.now();
      const b = this.budget.get(client.sessionId)!;
      b.px = Math.min(b.px + ((now - b.at) / 1000) * SPEED * SPEED_TOLERANCE, MAX_BUDGET_PX);
      b.at = now;
      const nx = Math.round(x);
      const ny = Math.round(y);
      const dist = Math.hypot(nx - p.x, ny - p.y);
      const tooFar = dist > b.px;
      if (tooFar || !hall.isWalkable(nx, ny)) {
        rejected[tooFar ? 'speed' : 'wall']++;
        client.send('correct', { x: p.x, y: p.y }); // snap the cheater/desynced client back
        return;
      }
      p.x = nx;
      p.y = ny;
      b.px -= dist;
    }),
    ping: () => Date.now(), // request/response: measures round-trip under load
  };

  onCreate() {
    live.rooms++;
    console.log(`hall room created · tick ${TICK_HZ} Hz (patchRate ${Math.round(this.patchRate!)} ms)`);
  }

  onJoin(client: Client, options?: { name?: unknown }) {
    const name = typeof options?.name === 'string' ? options.name.trim().slice(0, 24) : '';
    const p = new Player();
    p.name = name || 'guest';
    // Small random offset so players joining together don't stack on one point
    p.x = hall.spawn.x + Math.round((Math.random() - 0.5) * 64);
    p.y = hall.spawn.y + Math.round((Math.random() - 0.5) * 32);
    this.state.players.set(client.sessionId, p);
    this.budget.set(client.sessionId, { px: MAX_BUDGET_PX, at: Date.now() });
    live.clients++;
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    this.budget.delete(client.sessionId);
    live.clients--;
  }

  onDispose() {
    live.rooms--;
  }
}
