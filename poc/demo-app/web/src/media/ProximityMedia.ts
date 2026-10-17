import { RoomEvent, Track, type RemoteParticipant, type RemoteTrack, type RemoteTrackPublication, type Room as LkRoom } from 'livekit-client';
import type { Room as ColyseusRoom } from '@colyseus/sdk';
import type { HallState, PlayerState } from '@/game/hallSchema';

const TILE = 32;
// Same range as Gather: start hearing someone inside 5 tiles, full volume within 2 tiles
// Hysteresis: stop only beyond 7 tiles — one threshold would flicker at the edge
export const HEAR_ENTER_TILES = 5;
export const HEAR_LEAVE_TILES = 7;
const FULL_VOLUME_TILES = 2;
const MIN_VOLUME = 0.15;
const TICK_MS = 200;

export type Booth = { name: string; x: number; y: number; width: number; height: number };

export type NearbyPeer = { identity: string; name: string; tiles: number; hearing: boolean; volume: number; presenter: boolean };
export type BoothVideo = { identity: string; name: string; source: Track.Source; track: RemoteTrack };
export type ProximitySnapshot = { myBooth: string | null; peers: NearbyPeer[]; boothVideos: BoothVideo[] };

// One measurement per subscription change: when we decided, and when the track actually arrived
export type SwitchEvent = { identity: string; source: string; on: boolean; tiles: number; decidedAt: number; doneAt?: number };

type Options = { subscribeAll?: boolean; onChange: (s: ProximitySnapshot) => void };

const inBooth = (b: Booth, x: number, y: number) => x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height;

// Decides which LiveKit tracks this client subscribes to, from Colyseus positions:
// - microphones: by distance with hysteresis, volume falls off with distance; a booth's presenter is always heard inside that booth
// - presenter camera / screen share: only while this client stands inside the presenter's booth
// Identities match because each LiveKit identity is the participant's Colyseus sessionId.
export class ProximityMedia {
  private hearing = new Set<string>();
  private wanted = new Map<string, boolean>(); // publication sid → last decision
  private audioEls = new Map<string, HTMLMediaElement>();
  private timer: ReturnType<typeof setInterval>;
  private offs: (() => void)[] = [];
  readonly switches: SwitchEvent[] = [];

  constructor(
    private colyseus: ColyseusRoom,
    private lk: LkRoom,
    private booths: Booth[],
    private opts: Options,
  ) {
    const kick = () => this.tick();
    const onSubscribed = (track: RemoteTrack, pub: RemoteTrackPublication, p: RemoteParticipant) => {
      this.markDone(p.identity, pub.source, true);
      if (track.kind === Track.Kind.Audio) {
        const el = track.attach();
        el.dataset.identity = p.identity;
        document.body.appendChild(el);
        this.audioEls.set(pub.trackSid, el);
      }
      this.tick();
    };
    const onUnsubscribed = (track: RemoteTrack, pub: RemoteTrackPublication, p: RemoteParticipant) => {
      this.markDone(p.identity, pub.source, false);
      const el = this.audioEls.get(pub.trackSid);
      if (el) {
        track.detach(el);
        el.remove();
        this.audioEls.delete(pub.trackSid);
      }
      this.tick();
    };
    lk.on(RoomEvent.TrackPublished, kick).on(RoomEvent.ParticipantConnected, kick);
    lk.on(RoomEvent.TrackSubscribed, onSubscribed).on(RoomEvent.TrackUnsubscribed, onUnsubscribed);
    this.offs.push(() => {
      lk.off(RoomEvent.TrackPublished, kick).off(RoomEvent.ParticipantConnected, kick);
      lk.off(RoomEvent.TrackSubscribed, onSubscribed).off(RoomEvent.TrackUnsubscribed, onUnsubscribed);
    });
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  private players() {
    return (this.colyseus.state as HallState).players;
  }

  tick() {
    const players = this.players();
    const me = players?.get(this.colyseus.sessionId);
    if (!me) return;
    const myBooth = this.booths.find((b) => inBooth(b, me.x, me.y)) ?? null;
    const peers: NearbyPeer[] = [];
    const boothVideos: BoothVideo[] = [];

    for (const p of this.lk.remoteParticipants.values()) {
      const ps: PlayerState | undefined = players.get(p.identity);
      const tiles = ps ? Math.hypot(ps.x - me.x, ps.y - me.y) / TILE : Infinity;
      const presenterHere = !!ps?.presenterOf && ps.presenterOf === myBooth?.name;

      let hear = this.hearing.has(p.identity) ? tiles <= HEAR_LEAVE_TILES : tiles < HEAR_ENTER_TILES;
      if (presenterHere || this.opts.subscribeAll) hear = true;
      if (hear) this.hearing.add(p.identity);
      else this.hearing.delete(p.identity);
      const see = presenterHere || !!this.opts.subscribeAll;

      const volume = presenterHere ? 1 : Math.max(MIN_VOLUME, Math.min(1, 1 - (tiles - FULL_VOLUME_TILES) / (HEAR_ENTER_TILES - FULL_VOLUME_TILES)));

      for (const pub of p.trackPublications.values()) {
        const want = pub.source === Track.Source.Microphone ? hear : see;
        this.apply(p.identity, pub, want, tiles);
        if (pub.source === Track.Source.Microphone && pub.track && pub.kind === Track.Kind.Audio) {
          (pub.track as RemoteTrack & { setVolume(v: number): void }).setVolume(volume);
        }
        if (want && pub.track && (pub.source === Track.Source.Camera || pub.source === Track.Source.ScreenShare)) {
          boothVideos.push({ identity: p.identity, name: ps?.name ?? p.identity, source: pub.source, track: pub.track });
        }
      }
      if (ps && tiles <= HEAR_LEAVE_TILES + 4) {
        peers.push({ identity: p.identity, name: ps.name, tiles: Math.round(tiles * 10) / 10, hearing: hear, volume: Math.round(volume * 100) / 100, presenter: !!ps.presenterOf });
      }
    }
    peers.sort((a, b) => a.tiles - b.tiles);
    this.opts.onChange({ myBooth: myBooth?.name ?? null, peers, boothVideos });
  }

  private apply(identity: string, pub: RemoteTrackPublication, want: boolean, tiles: number) {
    if (this.wanted.get(pub.trackSid) === want) return;
    this.wanted.set(pub.trackSid, want);
    if (pub.isSubscribed === want) return;
    this.switches.push({ identity, source: pub.source, on: want, tiles: Math.round(tiles * 10) / 10, decidedAt: performance.now() });
    pub.setSubscribed(want);
  }

  private markDone(identity: string, source: Track.Source, on: boolean) {
    for (let i = this.switches.length - 1; i >= 0; i--) {
      const s = this.switches[i];
      if (s.identity === identity && s.source === source && s.on === on && s.doneAt === undefined) {
        s.doneAt = performance.now();
        return;
      }
    }
  }

  destroy() {
    clearInterval(this.timer);
    for (const off of this.offs) off();
    for (const el of this.audioEls.values()) el.remove();
    this.audioEls.clear();
  }
}

// Booth rectangles from the same Tiled map the game renders
export async function loadBooths(url = '/assets/maps/hall.json'): Promise<Booth[]> {
  const map = await (await fetch(url)).json();
  const layer = map.layers.find((l: { name: string }) => l.name === 'booths');
  return (layer?.objects ?? []).map((o: Booth) => ({ name: o.name, x: o.x, y: o.y, width: o.width, height: o.height }));
}
