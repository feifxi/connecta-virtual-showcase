import * as Phaser from 'phaser';
import { Callbacks, type Room } from '@colyseus/sdk';
import type { HallState, PlayerState } from './hallSchema';

const SEND_HZ = 15;
// Remote players are drawn this far in the past, so there are always two server snapshots to interpolate between
const INTERP_DELAY_MS = 120;
const MAX_SNAPSHOTS = 10;
const PATCH_GAP_MS = 200;

type Snapshot = { t: number; x: number; y: number };
type Remote = { sprite: Phaser.GameObjects.Image; label: Phaser.GameObjects.Text; snaps: Snapshot[] };

// Syncs the local player to Colyseus and draws everyone else.
// Local movement is predicted (moves instantly); the server only validates and may send "correct".
export class NetSync {
  private remotes = new Map<string, Remote>();
  private unbind: (() => void)[] = [];
  private lastSent = 0;
  private sentX = -1;
  private sentY = -1;
  corrections = 0; // how often the server rejected our position (should stay 0 in normal play)

  constructor(
    private scene: Phaser.Scene,
    private room: Room,
    private local: Phaser.Physics.Arcade.Sprite,
  ) {
    const callbacks = Callbacks.get(room as unknown as { state: HallState; serializer: object });

    this.unbind.push(
      callbacks.onAdd('players', (p: PlayerState, sessionId: string) => {
        if (sessionId === room.sessionId) {
          this.local.setPosition(p.x, p.y); // server picks the spawn point
          return;
        }
        const remote: Remote = {
          sprite: scene.add.image(p.x, p.y, 'player').setTint(0x5aa0ff),
          label: scene.add.text(p.x, p.y - 14, p.name, { fontFamily: 'sans-serif', fontSize: '12px', color: '#1f2a44' }).setOrigin(0.5, 1),
          snaps: [{ t: performance.now(), x: p.x, y: p.y }],
        };
        this.remotes.set(sessionId, remote);
        this.unbind.push(
          callbacks.onChange(p, () => {
            const now = performance.now();
            const prev = remote.snaps[remote.snaps.length - 1];
            // After standing still, start from rest one tick ago — otherwise the idle gap gets interpolated and the first step jumps
            if (now - prev.t > PATCH_GAP_MS) remote.snaps.push({ t: now - 1000 / SEND_HZ, x: prev.x, y: prev.y });
            remote.snaps.push({ t: now, x: p.x, y: p.y });
            if (remote.snaps.length > MAX_SNAPSHOTS) remote.snaps.shift();
          }),
        );
      }),
      callbacks.onRemove('players', (_p: PlayerState, sessionId: string) => {
        const r = this.remotes.get(sessionId);
        r?.sprite.destroy();
        r?.label.destroy();
        this.remotes.delete(sessionId);
      }),
      room.onMessage('correct', ({ x, y }: { x: number; y: number }) => {
        this.corrections++;
        this.local.setPosition(x, y);
        (this.local.body as Phaser.Physics.Arcade.Body).reset(x, y);
      }),
    );
  }

  update(time: number) {
    // Send own position at most SEND_HZ times per second, and only when it moved
    const x = Math.round(this.local.x);
    const y = Math.round(this.local.y);
    if (time - this.lastSent >= 1000 / SEND_HZ && (x !== this.sentX || y !== this.sentY)) {
      this.room.send('move', { x, y });
      this.lastSent = time;
      this.sentX = x;
      this.sentY = y;
    }

    const renderAt = performance.now() - INTERP_DELAY_MS;
    for (const r of this.remotes.values()) {
      const { x: rx, y: ry } = interpolate(r.snaps, renderAt);
      r.sprite.setPosition(rx, ry);
      r.label.setPosition(rx, ry - 14);
    }
  }

  get remoteCount() {
    return this.remotes.size;
  }

  destroy() {
    for (const off of this.unbind) off();
    for (const r of this.remotes.values()) {
      r.sprite.destroy();
      r.label.destroy();
    }
    this.remotes.clear();
  }
}

function interpolate(snaps: Snapshot[], t: number) {
  const last = snaps[snaps.length - 1];
  if (t >= last.t) return last;
  for (let i = snaps.length - 1; i > 0; i--) {
    const a = snaps[i - 1];
    const b = snaps[i];
    if (t >= a.t) {
      const k = (t - a.t) / (b.t - a.t);
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    }
  }
  return snaps[0];
}
