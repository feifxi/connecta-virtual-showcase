import * as Phaser from 'phaser';
import { NavGrid, facing, tiledProps, type Dir } from './nav';

// Hall preset POC: the map holds only booth *slots*; booths are placed at runtime from the project list.
// - setup(): before the event · sort by category (or keep list order) and fill slots from the entrance side
// - addBooth(): during the event · new booth takes a free slot, nobody else moves
// Empty slots become decoration so a small event never shows empty tables. Offline (no server, no media).

export type PresetId = 'room' | 'hall';
export type Project = { no: string; title: string; category: string };
export type PlacedBooth = Project & { slot: string; block: string };
export type LayoutInfo = { preset: PresetId; capacity: number; booths: number; empty: number; blocks: { id: string; label: string }[]; added?: string; full?: boolean };
export type Hearing = { range: number; people: number; where: 'booth' | 'open' };

export const PresetEvents = {
  LAYOUT: 'preset-layout',
  BOOTH_ENTER: 'preset-booth-enter',
  BOOTH_LEAVE: 'preset-booth-leave',
  HEARING: 'preset-hearing',
} as const;

export const CATEGORIES = ['AI & Data', 'Web & Mobile', 'IoT & Robotics', 'Games & XR'] as const;
const CAT_ZONE: Record<string, string> = { 'AI & Data': 'mint', 'Web & Mobile': 'lilac', 'IoT & Robotics': 'peach', 'Games & XR': 'sky' };
const ZONE_COLOR: Record<string, { bg: number; ink: string }> = {
  mint: { bg: 0x3fae7f, ink: '#ffffff' }, lilac: { bg: 0x8a6ee0, ink: '#ffffff' }, peach: { bg: 0xf08a5d, ink: '#ffffff' },
  sky: { bg: 0x4b95e0, ink: '#ffffff' }, neutral: { bg: 0x7d84a6, ink: '#ffffff' }, stage: { bg: 0x7b5a8f, ink: '#ffffff' },
  lounge: { bg: 0xf08a9e, ink: '#ffffff' }, welcome: { bg: 0x2b2d42, ink: '#ffffff' },
};
const TILE = { MINT: 3, LILAC: 4, PEACH: 5, SKY: 6, RUG: 15, NEUTRAL: 16 } as const; // ids from scripts/lib/hall-art.mjs
const ZONE_TILE: Record<string, number> = { mint: TILE.MINT, lilac: TILE.LILAC, peach: TILE.PEACH, sky: TILE.SKY, neutral: TILE.NEUTRAL };

// sample list in sign-up order (categories mixed), 34 projects so "add booth" can overflow the Hall's 30 slots
const TITLES: [string, string][] = [
  ['Elective Recommender', 'AI & Data'], ['Dorm Repair Tracker', 'Web & Mobile'], ['Smart Parking Sensor', 'IoT & Robotics'],
  ['VR Chemistry Lab', 'Games & XR'], ['Thai Receipt OCR', 'AI & Data'], ['Club Event Hub', 'Web & Mobile'],
  ['Air Quality Station', 'IoT & Robotics'], ['Thai History RPG', 'Games & XR'], ['Campus Crowd Forecast', 'AI & Data'],
  ['Lost & Found Map', 'Web & Mobile'], ['Delivery Robot', 'IoT & Robotics'], ['AR Campus Tour', 'Games & XR'],
  ['Plant Disease Scanner', 'AI & Data'], ['Carpool for Students', 'Web & Mobile'], ['Smart Farm Kit', 'IoT & Robotics'],
  ['Rehab Exercise Game', 'Games & XR'], ['Lecture Summariser', 'AI & Data'], ['Canteen Pre-order', 'Web & Mobile'],
  ['Elderly Fall Alert', 'IoT & Robotics'], ['Sign Language Trainer', 'Games & XR'], ['Fake News Checker', 'AI & Data'],
  ['Study Room Booking', 'Web & Mobile'], ['Energy Meter Dashboard', 'IoT & Robotics'], ['Rhythm Typing Game', 'Games & XR'],
  ['Exam Cheating Detector', 'AI & Data'], ['Alumni Mentor Match', 'Web & Mobile'], ['Thai Speech Tutor', 'AI & Data'],
  ['Bus Arrival Tracker', 'Web & Mobile'], ['Flood Level Alert', 'IoT & Robotics'], ['Medical Chatbot', 'AI & Data'],
  ['Escape Room Puzzle', 'Games & XR'], ['Library Seat Finder', 'Web & Mobile'], ['Drone Mapping', 'IoT & Robotics'],
  ['Resume Screener', 'AI & Data'],
];
export const PROJECTS: Project[] = TITLES.map(([title, category], i) => ({ no: String(i + 1).padStart(2, '0'), title, category }));

const T = 32;
const SPEED = 150;
const NPC_SPEED = 70;
const FULL_VOLUME = 2 * T; // Gather: fully connected within 2 tiles

type Slot = { id: string; block: string; order: number; rect: Phaser.Geom.Rectangle; booth: PlacedBooth | null };
type Npc = { sprite: Phaser.GameObjects.Sprite; shadow: Phaser.GameObjects.Image; row: number; dir: Dir; path: Phaser.Math.Vector2[]; wait: number; roam: boolean; target: Spot | null };
type Spot = { x: number; y: number; taken: boolean };

export class PresetScene extends Phaser.Scene {
  private preset: PresetId = 'hall';
  private map!: Phaser.Tilemaps.Tilemap;
  private floor!: Phaser.Tilemaps.TilemapLayer;
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerShadow!: Phaser.GameObjects.Image;
  private playerLabel!: Phaser.GameObjects.Text;
  private playerDir: Dir = 'down';
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private path: Phaser.Math.Vector2[] = [];
  private nav!: NavGrid;
  private baseBlocked!: Uint8Array;
  private slots: Slot[] = [];
  private blockRects = new Map<string, Phaser.Geom.Rectangle>();
  private boothSolids!: Phaser.Physics.Arcade.StaticGroup;
  private boothObjs: Phaser.GameObjects.GameObject[] = [];
  private boothNpcs: Npc[] = [];
  private crowd: Npc[] = [];
  private spots: Spot[] = [];
  private audience: Spot[] = [];
  private rowsByKind: Record<string, number[]> = {};
  private minimap!: Phaser.Cameras.Scene2D.Camera;
  private current: Slot | null = null;
  private categories = true;
  private range = 5; // hearing range in tiles (subscribe) · see setRange
  private ring!: Phaser.GameObjects.Graphics;
  private hearingKey = '';
  private blockFloor = new Map<string, number[]>(); // original floor tiles of each block (restored before every layout)

  constructor() {
    super('presets');
  }

  init(data: { preset?: PresetId }) {
    this.preset = data.preset ?? 'hall';
    this.slots = [];
    this.blockRects.clear();
    this.boothObjs = [];
    this.boothNpcs = [];
    this.crowd = [];
    this.spots = [];
    this.audience = [];
    this.current = null;
    this.path = [];
  }

  preload() {
    this.load.tilemapTiledJSON('preset-room', '/assets/presets/room.json');
    this.load.tilemapTiledJSON('preset-hall', '/assets/presets/hall.json');
    this.load.image('preset-tiles', '/assets/presets/tiles.png');
    this.load.atlas('preset-props', '/assets/presets/props.png', '/assets/presets/props.json');
    this.load.json('preset-boxes', '/assets/presets/boxes.json'); // collision box per prop: x, y, w, h inside the frame
    this.load.spritesheet('students', '/assets/hall/students.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    const map = (this.map = this.add.tilemap(`preset-${this.preset}`));
    const tileset = map.addTilesetImage('hall-tiles', 'preset-tiles');
    if (!tileset) throw new Error('tileset missing');
    const floor = map.createLayer('floor', tileset, 0, 0);
    const walls = map.createLayer('walls', tileset, 0, 0);
    if (!floor || !walls) throw new Error('layers missing');
    this.floor = floor.setDepth(-2) as Phaser.Tilemaps.TilemapLayer; // CPU layer (default): putTileAt works
    walls.setDepth(-1).setCollisionByProperty({ collides: true });

    const kinds = String((map.properties as { name: string; value: string }[]).find((p) => p.name === 'characters')?.value ?? '').split(',');
    this.rowsByKind = {};
    kinds.forEach((k, row) => (this.rowsByKind[k] ??= []).push(row));
    this.createAnims(kinds.length);

    // walk grid: walls + static props (booths are added per layout)
    this.nav = new NavGrid(map.widthInPixels, map.heightInPixels);
    for (let gy = 0; gy < this.nav.h; gy++)
      for (let gx = 0; gx < this.nav.w; gx++)
        if (walls.getTileAtWorldXY(gx * 16 + 8, gy * 16 + 8)?.collides) this.nav.blocked[gy * this.nav.w + gx] = 1;
    const solids = this.physics.add.staticGroup();
    for (const o of map.getObjectLayer('props')?.objects ?? []) this.addProp(tiledProps(o).key, o.x!, o.y!, solids, null);
    this.baseBlocked = this.nav.blocked.slice();
    this.boothSolids = this.physics.add.staticGroup();

    for (const o of map.getObjectLayer('blocks')?.objects ?? []) {
      const r = new Phaser.Geom.Rectangle(o.x!, o.y!, o.width!, o.height!);
      this.blockRects.set(o.name, r);
      const tiles: number[] = [];
      this.eachTile(r, (x, y) => tiles.push(this.floor.getTileAt(x, y)?.index ?? 1));
      this.blockFloor.set(o.name, tiles);
    }
    this.slots = (map.getObjectLayer('slots')?.objects ?? [])
      .map((o) => { const p = tiledProps(o); return { id: o.name, block: p.block, order: Number(p.order), rect: new Phaser.Geom.Rectangle(o.x!, o.y!, o.width!, o.height!), booth: null }; })
      .sort((a, b) => a.order - b.order);

    for (const o of map.getObjectLayer('signs')?.objects ?? []) this.plate(o.x!, o.y!, o.name.toUpperCase(), ZONE_COLOR[tiledProps(o).zone] ?? ZONE_COLOR.welcome, tiledProps(o).zone === 'welcome' ? 12 : 11);
    this.spots = (map.getObjectLayer('spots')?.objects ?? []).map((o) => ({ x: o.x!, y: o.y!, taken: false, kind: o.name } as Spot & { kind: string }));

    // player
    const spawn = map.findObject('spawns', (o) => o.name === 'spawn');
    this.player = this.physics.add.sprite(spawn?.x ?? 100, spawn?.y ?? 100, 'students', 0).setOrigin(0.5, 1);
    (this.player.body as Phaser.Physics.Arcade.Body).setSize(16, 10).setOffset(8, 37);
    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.player, solids);
    this.physics.add.collider(this.player, this.boothSolids);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);
    this.playerShadow = this.add.image(0, 0, 'preset-props', 'shadow');
    this.playerLabel = this.text('You', 7, '#ffffff', '#4655e8').setOrigin(0.5, 1);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels).setZoom(2).startFollow(this.player, true, 0.12, 0.12);
    cam.setBackgroundColor('#efeaf6');
    this.input.on('wheel', (_p: unknown, _o: unknown, _dx: number, dy: number) => cam.setZoom(Phaser.Math.Clamp(cam.zoom + (dy > 0 ? -0.5 : 0.5), 1, 3)));

    const mw = 240;
    this.minimap = this.cameras.add(0, 0, mw, Math.round((mw * map.heightInPixels) / map.widthInPixels)).setZoom(mw / map.widthInPixels).setName('minimap');
    this.minimap.setBounds(0, 0, map.widthInPixels, map.heightInPixels).centerOn(map.widthInPixels / 2, map.heightInPixels / 2).setBackgroundColor('#efeaf6');
    this.minimap.ignore(this.playerLabel);
    this.placeMinimap();
    this.scale.on('resize', this.placeMinimap, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.placeMinimap, this));

    const keyboard = this.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = keyboard.addKeys('W,A,S,D') as typeof this.wasd;
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const m = this.minimap;
      const onMini = pointer.x >= m.x && pointer.y >= m.y && pointer.x <= m.x + m.width && pointer.y <= m.y + m.height;
      const world = onMini ? m.getWorldPoint(pointer.x, pointer.y) : (pointer.positionToCamera(cam) as Phaser.Math.Vector2);
      this.path = this.nav.find(this.player.x, this.player.y - 4, world.x, world.y) ?? [];
    });

    this.ring = this.add.graphics().setDepth(-0.5);
    this.minimap.ignore(this.ring);
    this.range = (this.registry.get('hearingRange') as number | undefined) ?? 5;
    this.drawRing();

    this.spawnCrowd();
    const cfg = (this.registry.get('presetConfig') as { count: number; categories: boolean } | undefined) ?? { count: this.slots.length, categories: true };
    this.setup(cfg.count, cfg.categories);
  }

  // ---------- layout ----------
  get capacity() {
    return this.slots.length;
  }

  // before the event: re-sort everything
  setup(count: number, categories: boolean) {
    this.categories = categories;
    const list = PROJECTS.slice(0, Math.min(count, this.slots.length));
    const ordered = categories
      ? [...list].sort((a, b) => CATEGORIES.indexOf(a.category as never) - CATEGORIES.indexOf(b.category as never) || a.no.localeCompare(b.no))
      : list;
    for (const s of this.slots) s.booth = null;
    ordered.forEach((p, i) => (this.slots[i].booth = { ...p, slot: this.slots[i].id, block: this.slots[i].block }));
    this.render();
    this.emitLayout();
  }

  // during the event: next project takes a free slot (after its own category when possible), nobody moves
  addBooth() {
    const placed = new Set(this.slots.filter((s) => s.booth).map((s) => s.booth!.no));
    const next = PROJECTS.find((p) => !placed.has(p.no));
    const free = this.slots.filter((s) => !s.booth);
    if (!next || !free.length) return this.emitLayout({ full: true });
    let slot = free[0];
    if (this.categories) {
      const last = Math.max(-1, ...this.slots.filter((s) => s.booth?.category === next.category).map((s) => s.order));
      slot = free.find((s) => s.order > last) ?? free[0];
    }
    slot.booth = { ...next, slot: slot.id, block: slot.block };
    this.render();
    this.flash(slot);
    this.emitLayout({ added: next.title });
  }

  private zoneOf(b: PlacedBooth) {
    return this.categories ? CAT_ZONE[b.category] ?? 'neutral' : 'neutral';
  }

  private render() {
    for (const o of this.boothObjs) o.destroy();
    this.boothObjs = [];
    for (const n of this.boothNpcs) { n.sprite.destroy(); n.shadow.destroy(); }
    this.boothNpcs = [];
    this.boothSolids.clear(true, true);
    this.nav.blocked = this.baseBlocked.slice();
    this.audience = [];

    for (const [id, r] of this.blockRects) {
      const tiles = this.blockFloor.get(id)!;
      let i = 0;
      this.eachTile(r, (x, y) => this.floor.putTileAt(tiles[i++], x, y));
    }
    // a block with no booth at all becomes a lounge (rug + seating groups) instead of rows of plants
    const emptyBlocks = new Set([...this.blockRects.keys()].filter((id) => !this.slots.some((s) => s.block === id && s.booth)));
    for (const id of emptyBlocks) this.lounge(id);

    const rnd = new Phaser.Math.RandomDataGenerator(['booths']);
    for (const s of this.slots) {
      if (emptyBlocks.has(s.block)) continue;
      const tx = s.rect.x / T, ty = s.rect.y / T;
      const b = s.booth;
      // booth carpet only under real booths, plain wood under decoration
      for (let y = 0; y < s.rect.height / T; y++)
        for (let x = 0; x < s.rect.width / T; x++) {
          const id = b ? ZONE_TILE[this.zoneOf(b)] : (x + y + tx) % 2;
          this.floor.putTileAt(id + 1, tx + x, ty + y);
        }
      const cx = s.rect.centerX;
      if (!b) {
        this.addProp('plant', s.rect.x + 0.7 * T, s.rect.y + 1.9 * T, this.boothSolids, this.boothObjs);
        this.addProp('plant_s', s.rect.right - 0.7 * T, s.rect.y + 1.7 * T, this.boothSolids, this.boothObjs);
        this.addProp(rnd.pick(['beanbag_sky', 'beanbag_butter', 'armchair_mint', 'armchair_lilac']), cx, s.rect.y + 3.4 * T, this.boothSolids, this.boothObjs);
        continue;
      }
      const zone = this.zoneOf(b);
      const v = Number(b.no) % 2;
      this.addProp(`backdrop_${zone}_${v}`, cx, s.rect.y + 2 * T, this.boothSolids, this.boothObjs);
      this.addProp(`table_${zone}_${Number(b.no) % 3}`, cx, s.rect.y + 3.3 * T, this.boothSolids, this.boothObjs);
      this.boothObjs.push(...this.plate(cx, s.rect.y - 0.6 * T + 6, `${b.no}  ${b.title}`, ZONE_COLOR[zone], 9));
      this.boothNpcs.push(this.npc('presenter', cx - 0.5 * T, s.rect.y + 2.45 * T, 'down', false));
      for (let k = 0; k < 4; k++) this.audience.push({ x: s.rect.x + (0.8 + k * 0.8) * T, y: s.rect.y + (4.2 + (k % 2) * 0.5) * T, taken: false });
    }

    // block signs: categories inside the block (none when the event has no categories)
    if (this.categories)
      for (const [id, r] of this.blockRects) {
        const cats = [...new Set(this.slots.filter((s) => s.block === id && s.booth).map((s) => s.booth!.category))];
        if (!cats.length) continue;
        this.boothObjs.push(...this.plate(r.centerX, r.y - 0.45 * T, cats.join(' · ').toUpperCase(), ZONE_COLOR[CAT_ZONE[cats[0]]], 11));
      }
    for (const n of this.crowd) if (n.target && !this.spots.includes(n.target)) n.target = null;
  }

  private flash(slot: Slot) {
    const g = this.add.graphics().setDepth(99990);
    g.lineStyle(3, 0xf0506e, 1).strokeRoundedRect(slot.rect.x - 4, slot.rect.y - 4, slot.rect.width + 8, slot.rect.height + 8, 8);
    this.tweens.add({ targets: g, alpha: 0, duration: 600, yoyo: true, repeat: 3, onComplete: () => g.destroy() });
  }

  private emitLayout(extra: Partial<LayoutInfo> = {}) {
    const booths = this.slots.filter((s) => s.booth).length;
    const blocks = [...this.blockRects.keys()].map((id) => {
      const cats = [...new Set(this.slots.filter((s) => s.block === id && s.booth).map((s) => (this.categories ? s.booth!.category : 'booths')))];
      return { id, label: cats.join(' · ') || 'lounge' };
    });
    const info: LayoutInfo = { preset: this.preset, capacity: this.slots.length, booths, empty: this.slots.length - booths, blocks, ...extra };
    this.game.events.emit(PresetEvents.LAYOUT, info);
  }

  // ---------- update ----------
  update(_time: number, delta: number) {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const dir = new Phaser.Math.Vector2(
      Number(this.cursors.right.isDown || this.wasd.D.isDown) - Number(this.cursors.left.isDown || this.wasd.A.isDown),
      Number(this.cursors.down.isDown || this.wasd.S.isDown) - Number(this.cursors.up.isDown || this.wasd.W.isDown),
    );
    if (dir.lengthSq() > 0) this.path = [];
    else if (this.path.length) {
      const to = new Phaser.Math.Vector2(this.path[0].x - this.player.x, this.path[0].y - this.player.y);
      if (to.length() < 4) this.path.shift();
      else dir.copy(to);
    }
    if (dir.lengthSq() > 0) {
      dir.normalize().scale(SPEED);
      body.setVelocity(dir.x, dir.y);
      this.playerDir = facing(dir.x, dir.y);
    } else body.setVelocity(0, 0);
    this.animate(this.player, 0, this.playerDir, dir.lengthSq() > 0);
    this.player.setDepth(this.player.y);
    this.playerShadow.setPosition(this.player.x, this.player.y - 2).setDepth(this.player.y - 0.1);
    this.playerLabel.setPosition(this.player.x, this.player.y - 47).setDepth(100002);

    for (const n of this.crowd) this.updateNpc(n, delta);
    for (const n of [...this.crowd, ...this.boothNpcs]) {
      n.sprite.setDepth(n.sprite.y);
      n.shadow.setPosition(n.sprite.x, n.sprite.y - 2).setDepth(n.sprite.y - 0.1);
    }

    this.ring.setPosition(this.player.x, this.player.y - 6);
    this.updateHearing();

    const inside = this.slots.find((s) => s.booth && s.rect.contains(this.player.x, this.player.y)) ?? null;
    if (inside !== this.current) {
      if (this.current) this.game.events.emit(PresetEvents.BOOTH_LEAVE);
      this.current = inside;
      if (inside) this.game.events.emit(PresetEvents.BOOTH_ENTER, { ...inside.booth!, categories: this.categories });
    }
  }

  private updateNpc(n: Npc, delta: number) {
    if (n.path.length) {
      const next = n.path[0];
      const dx = next.x - n.sprite.x, dy = next.y - n.sprite.y, d = Math.hypot(dx, dy);
      const step = (NPC_SPEED * delta) / 1000;
      if (d <= step) {
        n.sprite.setPosition(next.x, next.y);
        n.path.shift();
        if (!n.path.length && this.audience.includes(n.target!)) n.dir = 'up';
      } else {
        n.sprite.x += (dx / d) * step;
        n.sprite.y += (dy / d) * step;
        n.dir = facing(dx, dy);
      }
      this.animate(n.sprite, n.row, n.dir, true);
      return;
    }
    this.animate(n.sprite, n.row, n.dir, false);
    if (!n.roam) return;
    n.wait -= delta;
    if (n.wait > 0) return;
    n.wait = Phaser.Math.Between(5000, 14000);
    const free = [...this.audience, ...this.spots.filter((s) => (s as Spot & { kind: string }).kind !== 'seat')].filter((s) => !s.taken);
    const target = Phaser.Utils.Array.GetRandom(free);
    if (!target) return;
    const path = this.nav.find(n.sprite.x, n.sprite.y - 4, target.x, target.y);
    if (!path) return;
    if (n.target) n.target.taken = false;
    target.taken = true;
    n.target = target;
    n.path = path;
  }

  // ---------- hearing range ----------
  setRange(tiles: number) {
    this.range = tiles;
    this.registry.set('hearingRange', tiles);
    this.drawRing();
    this.hearingKey = '';
  }

  private drawRing() {
    const r = this.range * T;
    this.ring.clear();
    this.ring.fillStyle(0x4655e8, 0.05).fillCircle(0, 0, r);
    this.ring.lineStyle(2, 0x4655e8, 0.3).strokeCircle(0, 0, r);
    this.ring.fillStyle(0x4655e8, 0.08).fillCircle(0, 0, FULL_VOLUME);
  }

  // booth zone = same room (everyone inside, nobody outside) · open floor = within range, booth zones excluded
  private updateHearing() {
    const zoneOf = (x: number, y: number) => this.slots.find((s) => s.booth && s.rect.contains(x, y)) ?? null;
    const mine = zoneOf(this.player.x, this.player.y);
    const people = [...this.crowd, ...this.boothNpcs].filter((n) => {
      const z = zoneOf(n.sprite.x, n.sprite.y);
      if (mine) return z === mine;
      return !z && Phaser.Math.Distance.Between(n.sprite.x, n.sprite.y, this.player.x, this.player.y) < this.range * T;
    }).length;
    this.ring.setVisible(!mine);
    const key = `${this.range}:${people}:${!!mine}`;
    if (key === this.hearingKey) return;
    this.hearingKey = key;
    this.game.events.emit(PresetEvents.HEARING, { range: this.range, people, where: mine ? 'booth' : 'open' } satisfies Hearing);
  }

  // ---------- helpers ----------
  private eachTile(r: Phaser.Geom.Rectangle, fn: (x: number, y: number) => void) {
    for (let y = r.y / T; y < r.bottom / T; y++) for (let x = r.x / T; x < r.right / T; x++) fn(x, y);
  }

  private lounge(id: string) {
    const r = this.blockRects.get(id)!;
    const inner = new Phaser.Geom.Rectangle(r.x + T, r.y + T, r.width - 2 * T, r.height - 2 * T);
    this.eachTile(inner, (x, y) => this.floor.putTileAt(TILE.RUG + 1, x, y));
    const cols = Math.max(1, Math.floor(inner.width / (7 * T)));
    const rows = Math.max(1, Math.floor(inner.height / (5 * T)));
    const cw = inner.width / cols, ch = inner.height / rows;
    const add = (key: string, x: number, y: number) => this.addProp(key, x, y, this.boothSolids, this.boothObjs);
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++) {
        const cx = inner.x + cw * (col + 0.5), top = inner.y + ch * row;
        add('sofa', cx, top + 1.6 * T);
        add('coffee_table', cx, top + 2.9 * T);
        add((row + col) % 2 ? 'armchair_mint' : 'armchair_lilac', cx - 2.3 * T, top + 3 * T);
        add((row + col) % 2 ? 'beanbag_sky' : 'beanbag_butter', cx + 2.3 * T, top + 3.1 * T);
        for (const [x, y] of [[cx - 1.2 * T, top + 3.9 * T], [cx + 1.2 * T, top + 3.9 * T]]) this.audience.push({ x, y, taken: false });
      }
    add('plant', inner.x + 0.4 * T, inner.y + 1.2 * T);
    add('plant', inner.right - 0.4 * T, inner.bottom - 0.2 * T);
    this.boothObjs.push(...this.plate(r.centerX, r.y - 0.45 * T, 'LOUNGE', ZONE_COLOR.lounge, 11));
  }

  private spawnCrowd() {
    const rnd = new Phaser.Math.RandomDataGenerator([this.preset]);
    for (const s of this.spots as (Spot & { kind: string })[]) {
      if (s.kind === 'seat' && rnd.frac() < 0.4) { this.crowd.push(this.npc(rnd.pick(['student', 'visitor']), s.x, s.y, 'up', false)); s.taken = true; }
      else if (s.kind === 'lounge' && rnd.frac() < 0.6) { const n = this.npc('visitor', s.x, s.y, 'down', true); n.target = s; s.taken = true; this.crowd.push(n); }
      else if (s.kind === 'wander') { const n = this.npc(rnd.pick(['student', 'visitor', 'judge', 'staff']), s.x, s.y, 'down', true); n.target = s; s.taken = true; this.crowd.push(n); }
    }
  }

  private npc(kind: string, x: number, y: number, dir: Dir, roam: boolean): Npc {
    const rows = this.rowsByKind[kind] ?? [1];
    const row = rows[Math.floor(Math.random() * rows.length)];
    const sprite = this.add.sprite(x, y, 'students', row * 16).setOrigin(0.5, 1);
    const shadow = this.add.image(x, y, 'preset-props', 'shadow');
    return { sprite, shadow, row, dir, path: [], wait: Phaser.Math.Between(500, 8000), roam, target: null };
  }

  private addProp(key: string, x: number, bottom: number, solids: Phaser.Physics.Arcade.StaticGroup, track: Phaser.GameObjects.GameObject[] | null) {
    const frame = this.textures.getFrame('preset-props', key);
    const img = this.add.image(x, bottom, 'preset-props', key).setOrigin(0.5, 1).setDepth(bottom);
    track?.push(img);
    const box = (this.cache.json.get('preset-boxes') as Record<string, number[]>)[key];
    if (!box || !frame) return;
    const [bx, by, bw, bh] = box;
    const left = x - frame.width / 2 + bx, top = bottom - frame.height + by;
    const zone = this.add.zone(left + bw / 2, top + bh / 2, bw, bh);
    solids.add(zone);
    track?.push(zone);
    this.nav.mark(left - 6, top - 4, bw + 12, bh + 8);
  }

  private text(s: string, size: number, color: string, bg?: string) {
    const t = this.add.text(0, 0, s, {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', fontSize: `${size}px`, fontStyle: '700', color,
      resolution: 4, padding: { left: 6, right: 6, top: 3, bottom: 3 }, ...(bg ? { backgroundColor: bg } : {}),
    });
    t.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    return t;
  }

  private plate(x: number, y: number, s: string, color: { bg: number; ink: string }, size: number) {
    const label = this.text(s, size, color.ink).setPosition(x, y).setOrigin(0.5, 0.5).setDepth(100000);
    const g = this.add.graphics().setDepth(99999);
    g.fillStyle(0x3b2f4f, 0.18).fillRoundedRect(x - label.width / 2, y - label.height / 2 + 2, label.width, label.height, label.height / 2);
    g.fillStyle(color.bg, 1).fillRoundedRect(x - label.width / 2, y - label.height / 2, label.width, label.height, label.height / 2);
    this.minimap?.ignore([label, g]);
    return [label, g];
  }

  private createAnims(rows: number) {
    const dirs: Dir[] = ['down', 'left', 'right', 'up'];
    for (let row = 0; row < rows; row++)
      dirs.forEach((d, i) => {
        const start = row * 16 + i * 4;
        const key = `walk-${row}-${d}`;
        if (!this.anims.exists(key))
          this.anims.create({ key, frames: this.anims.generateFrameNumbers('students', { frames: [start + 1, start, start + 3, start] }), frameRate: 8, repeat: -1 });
      });
  }

  private animate(sprite: Phaser.GameObjects.Sprite, row: number, dir: Dir, moving: boolean) {
    const key = `walk-${row}-${dir}`;
    if (moving) {
      if (sprite.anims.currentAnim?.key !== key || !sprite.anims.isPlaying) sprite.play(key);
    } else {
      sprite.stop();
      sprite.setFrame(row * 16 + { down: 0, left: 4, right: 8, up: 12 }[dir]);
    }
  }

  private placeMinimap = () => {
    this.minimap.setPosition(this.scale.width - this.minimap.width - 12, this.scale.height - this.minimap.height - 12);
  };
}
