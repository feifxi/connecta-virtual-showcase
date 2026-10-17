import * as Phaser from 'phaser';

// Showcase hall art POC: chibi characters, D-Day-like hall, NPC crowd. Offline (no server, no media).

export type ShowcaseBooth = {
  no: string; title: string; category: string; zone: string; status: 'live' | 'present' | 'empty';
  rect: Phaser.Geom.Rectangle; presenters: string[];
};

export const ShowcaseEvents = {
  BOOTH_ENTER: 'showcase-booth-enter',
  BOOTH_LEAVE: 'showcase-booth-leave',
  NEARBY: 'showcase-nearby',
} as const;

const T = 32;
const NAV = 16; // nav grid cell (px)
const SPEED = 150;
const NPC_SPEED = 70;
const HEAR_RADIUS = 5 * T; // same subscribe radius as S4
const ZONE_COLOR: Record<string, { bg: number; ink: string; hex: string }> = {
  mint: { bg: 0x3fae7f, ink: '#ffffff', hex: '#1f6b4c' },
  lilac: { bg: 0x8a6ee0, ink: '#ffffff', hex: '#4e3a99' },
  peach: { bg: 0xf08a5d, ink: '#ffffff', hex: '#9a4523' },
  sky: { bg: 0x4b95e0, ink: '#ffffff', hex: '#1f5a96' },
  stage: { bg: 0x7b5a8f, ink: '#ffffff', hex: '#5a3f6b' },
  lounge: { bg: 0xf08a9e, ink: '#ffffff', hex: '#9a3a52' },
  judge: { bg: 0xe0b53a, ink: '#3b2f10', hex: '#7a5a1a' },
  vote: { bg: 0xff8fa3, ink: '#ffffff', hex: '#9a3a52' },
  reg: { bg: 0x4655e8, ink: '#ffffff', hex: '#2a3290' },
  welcome: { bg: 0x2b2d42, ink: '#ffffff', hex: '#2b2d42' },
};

const NAMES = ['Mint', 'Book', 'Ploy', 'Nat', 'Jay', 'Fah', 'Beam', 'Kla', 'Ice', 'Oat', 'Tong', 'Pim', 'Earth', 'Fern', 'Gun', 'June',
  'Kaew', 'Mild', 'New', 'Pear', 'Tae', 'Win', 'Bow', 'Dew', 'Film', 'Guy', 'Ink', 'Max', 'Nan', 'Pond', 'Sun', 'Toey', 'Yo', 'Aom',
  'Bank', 'Cake', 'Donut', 'Frank', 'Gift', 'Hong', 'Jane', 'Kim', 'Lukpla', 'Muay', 'Namtan', 'Ohm', 'Palm', 'Ruj', 'Som', 'Tan'];
const LINES_PRESENTER = ['Hi! Want a quick demo?', 'This runs on real data', 'Try it on your phone!', 'We trained it on 12k images', 'Any questions?'];
const LINES_VISITOR = ['So cool!', 'How does it work?', 'Can I try?', 'Nice poster!', 'Which booth next?', 'Love the UI'];

type Dir = 'down' | 'left' | 'right' | 'up';
type Kind = 'player' | 'presenter' | 'student' | 'visitor' | 'staff' | 'judge';

type Actor = {
  sprite: Phaser.GameObjects.Sprite;
  shadow: Phaser.GameObjects.Image;
  label: Phaser.GameObjects.Text;
  row: number;
  name: string;
  dir: Dir;
  path: Phaser.Math.Vector2[];
  wait: number;
  roam: boolean;
  spot: Spot | null;
  bubble?: { box: Phaser.GameObjects.Text; until: number };
};
type Spot = { kind: string; x: number; y: number; booth?: string; taken: boolean };

export class ShowcaseScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerActor!: Actor;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
  private path: Phaser.Math.Vector2[] = [];
  private npcs: Actor[] = [];
  private booths: ShowcaseBooth[] = [];
  private currentBooth: ShowcaseBooth | null = null;
  private blocked!: Uint8Array;
  private gw = 0;
  private gh = 0;
  private rowsByKind: Record<string, number[]> = {};
  private spots: Spot[] = [];
  private ring!: Phaser.GameObjects.Graphics;
  private marker!: Phaser.GameObjects.Graphics;
  private hud: Phaser.GameObjects.GameObject[] = [];
  private minimap!: Phaser.Cameras.Scene2D.Camera;
  private nearbyKey = '';
  private nextChat = 0;
  // unique display names: plain names first, then with an initial (Mint K.)
  private names = [...NAMES, ...'KPSTCN'.split('').flatMap((c) => NAMES.map((n) => `${n} ${c}.`))];

  constructor() {
    super('showcase');
  }

  preload() {
    this.load.tilemapTiledJSON('showcase', '/assets/hall/hall.json');
    this.load.image('showcase-tiles', '/assets/hall/tiles.png');
    this.load.spritesheet('students', '/assets/hall/students.png', { frameWidth: 32, frameHeight: 48 });
    this.load.atlas('props', '/assets/hall/props.png', '/assets/hall/props.json');
  }

  create() {
    const map = this.add.tilemap('showcase');
    const tileset = map.addTilesetImage('hall-tiles', 'showcase-tiles');
    if (!tileset) throw new Error('tileset missing');
    map.createLayer('floor', tileset, 0, 0)?.setDepth(-2);
    const walls = map.createLayer('walls', tileset, 0, 0);
    if (!walls) throw new Error('walls layer missing');
    walls.setDepth(-1).setCollisionByProperty({ collides: true });

    // characters: map property lists each sheet row's kind
    const kinds = String((map.properties as { name: string; value: string }[]).find((p) => p.name === 'characters')?.value ?? '').split(',');
    kinds.forEach((k, row) => (this.rowsByKind[k] ??= []).push(row));
    this.createAnims(kinds.length);

    // nav grid: walls + prop boxes are blocked
    this.gw = Math.ceil(map.widthInPixels / NAV);
    this.gh = Math.ceil(map.heightInPixels / NAV);
    this.blocked = new Uint8Array(this.gw * this.gh);
    for (let gy = 0; gy < this.gh; gy++)
      for (let gx = 0; gx < this.gw; gx++) {
        const t = walls.getTileAtWorldXY(gx * NAV + NAV / 2, gy * NAV + NAV / 2);
        if (t?.collides) this.blocked[gy * this.gw + gx] = 1;
      }

    const solids = this.physics.add.staticGroup();
    for (const o of map.getObjectLayer('props')?.objects ?? []) {
      const p = props(o);
      const img = this.add.image(o.x!, o.y!, 'props', p.key).setOrigin(0.5, 1).setDepth(o.y!);
      if (!p.box) continue;
      const [bx, by, bw, bh] = p.box;
      const left = img.x - p.w / 2 + bx;
      const top = img.y - p.h + by;
      const zone = this.add.zone(left + bw / 2, top + bh / 2, bw, bh);
      solids.add(zone);
      this.markBlocked(left - 6, top - 4, bw + 12, bh + 8);
    }

    // booths: number + title plate above each backdrop, status badge
    for (const o of map.getObjectLayer('booths')?.objects ?? []) {
      const p = props(o);
      const booth: ShowcaseBooth = {
        no: p.no, title: p.title, category: p.category, zone: p.zone, status: p.status as ShowcaseBooth['status'],
        rect: new Phaser.Geom.Rectangle(o.x!, o.y!, o.width!, o.height!), presenters: [],
      };
      this.booths.push(booth);
      const cx = booth.rect.centerX;
      const top = booth.rect.y - 0.6 * T + 6;
      this.plate(cx, top, `${booth.no}  ${booth.title}`, ZONE_COLOR[booth.zone], 9, booth.status === 'live' ? 'LIVE' : undefined);
    }

    for (const o of map.getObjectLayer('signs')?.objects ?? []) {
      const p = props(o);
      const big = p.zone === 'welcome';
      this.plate(o.x!, o.y!, o.name.toUpperCase(), ZONE_COLOR[p.zone] ?? ZONE_COLOR.welcome, big ? 12 : 11);
    }

    this.spots = (map.getObjectLayer('spots')?.objects ?? []).map((o) => ({ kind: o.name, x: o.x!, y: o.y!, booth: props(o).booth, taken: false }));

    // player
    const spawn = map.findObject('spawns', (o) => o.name === 'spawn');
    this.player = this.physics.add.sprite(spawn?.x ?? 100, spawn?.y ?? 100, 'students', 0).setOrigin(0.5, 1);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(16, 10).setOffset(8, 37);
    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.player, solids);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);
    this.playerActor = this.actor(this.player, 0, 'You', true);

    this.spawnCrowd();

    // proximity ring + click marker
    this.ring = this.add.graphics().setDepth(-0.5);
    this.ring.fillStyle(0x4655e8, 0.06).fillCircle(0, 0, HEAR_RADIUS);
    this.ring.lineStyle(2, 0x4655e8, 0.25).strokeCircle(0, 0, HEAR_RADIUS);
    this.marker = this.add.graphics().setDepth(-0.4).setVisible(false);
    this.marker.lineStyle(2, 0x4655e8, 0.9).strokeEllipse(0, 0, 18, 9);

    // camera
    const cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.setZoom(2);
    cam.startFollow(this.player, true, 0.12, 0.12);
    cam.setBackgroundColor('#efeaf6');
    this.input.on('wheel', (_p: unknown, _o: unknown, _dx: number, dy: number) => {
      cam.setZoom(Phaser.Math.Clamp(cam.zoom + (dy > 0 ? -0.5 : 0.5), 1, 3));
    });

    // minimap (bottom-right): whole hall, labels hidden
    const mw = 240;
    const mh = Math.round((mw * map.heightInPixels) / map.widthInPixels);
    this.minimap = this.cameras.add(0, 0, mw, mh).setZoom(mw / map.widthInPixels).setName('minimap');
    this.minimap.setBounds(0, 0, map.widthInPixels, map.heightInPixels).centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
    this.minimap.setBackgroundColor('#efeaf6');
    this.minimap.ignore(this.hud);
    this.minimap.ignore(this.ring);
    this.minimap.ignore(this.marker);
    this.placeMinimap();
    this.scale.on('resize', this.placeMinimap, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.placeMinimap, this));

    const keyboard = this.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = keyboard.addKeys('W,A,S,D') as typeof this.wasd;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // a click on the minimap jumps the walk target there
      const onMini = this.minimap.worldView && pointer.x >= this.minimap.x && pointer.y >= this.minimap.y &&
        pointer.x <= this.minimap.x + this.minimap.width && pointer.y <= this.minimap.y + this.minimap.height;
      const world = onMini ? this.minimap.getWorldPoint(pointer.x, pointer.y) : pointer.positionToCamera(cam) as Phaser.Math.Vector2;
      this.path = this.findPath(this.player.x, this.player.y - 4, world.x, world.y) ?? [];
      if (this.path.length) this.marker.setPosition(world.x, world.y).setVisible(true);
    });
  }

  update(time: number, delta: number) {
    this.updatePlayer();
    for (const n of this.npcs) this.updateNpc(n, time, delta);
    for (const a of [this.playerActor, ...this.npcs]) this.syncActor(a, time);
    this.ring.setPosition(this.player.x, this.player.y - 6);
    this.updateBooth();
    this.updateNearby();
    if (time > this.nextChat) this.randomChat(time);
  }

  // ---------- setup helpers ----------
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

  private plate(x: number, y: number, text: string, color: { bg: number; ink: string }, size: number, badge?: string) {
    const label = this.add.text(x, y, text, {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', fontSize: `${size}px`, fontStyle: '700', color: color.ink,
      resolution: 4, padding: { left: 6, right: 6, top: 3, bottom: 3 },
    }).setOrigin(0.5, 0.5).setDepth(100000);
    label.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    const g = this.add.graphics().setDepth(99999);
    g.fillStyle(0x3b2f4f, 0.18).fillRoundedRect(x - label.width / 2, y - label.height / 2 + 2, label.width, label.height, label.height / 2);
    g.fillStyle(color.bg, 1).fillRoundedRect(x - label.width / 2, y - label.height / 2, label.width, label.height, label.height / 2);
    this.hud.push(label, g);
    if (badge) {
      const b = this.add.text(x + label.width / 2 + 3, y, badge, {
        fontFamily: 'system-ui, sans-serif', fontSize: '8px', fontStyle: '800', color: '#ffffff', resolution: 4,
        padding: { left: 4, right: 4, top: 2, bottom: 2 }, backgroundColor: '#f0506e',
      }).setOrigin(0, 0.5).setDepth(100001);
      b.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
      this.tweens.add({ targets: b, alpha: 0.45, duration: 700, yoyo: true, repeat: -1 });
      this.hud.push(b);
    }
  }

  private actor(sprite: Phaser.GameObjects.Sprite, row: number, name: string, isPlayer = false): Actor {
    const shadow = this.add.image(sprite.x, sprite.y, 'props', 'shadow').setOrigin(0.5, 0.5);
    const label = this.add.text(sprite.x, sprite.y, name, {
      fontFamily: 'system-ui, sans-serif', fontSize: '7px', fontStyle: '700', color: isPlayer ? '#ffffff' : '#3b2f4f',
      resolution: 4, padding: { left: 3, right: 3, top: 1, bottom: 1 }, backgroundColor: isPlayer ? '#4655e8' : 'rgba(255,255,255,0.85)',
    }).setOrigin(0.5, 1);
    label.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.hud.push(label);
    return { sprite, shadow, label, row, name, dir: 'down', path: [], wait: 0, roam: false, spot: null };
  }

  private spawnCrowd() {
    const rnd = new Phaser.Math.RandomDataGenerator(['connecta']);
    const rows = (k: Kind) => this.rowsByKind[k] ?? [1];
    const add = (kind: Kind, s: Spot, dir: Dir, roam = false) => {
      const row = rnd.pick(rows(kind));
      const sprite = this.add.sprite(s.x, s.y, 'students', row * 16).setOrigin(0.5, 1);
      const plainLeft = this.names.findIndex((n) => n.includes('.')); // plain names sit at the front: use them first
      const pool = plainLeft > 0 ? plainLeft : this.names.length;
      const name = this.names.splice(rnd.between(0, pool - 1), 1)[0] ?? `Guest ${this.npcs.length}`;
      const a = this.actor(sprite, row, name);
      a.dir = dir;
      a.roam = roam;
      a.spot = s;
      a.wait = rnd.between(2000, 9000);
      s.taken = true;
      this.npcs.push(a);
      if (kind === 'presenter' && s.booth) this.booths.find((b) => b.no === s.booth)?.presenters.push(name);
      return a;
    };
    for (const s of this.spots) {
      const booth = s.booth ? this.booths.find((b) => b.no === s.booth) : undefined;
      if (s.kind === 'presenter') add('presenter', s, 'down');
      else if (s.kind === 'staff') add('staff', s, 'up');
      else if (s.kind === 'judge') add('judge', s, 'down');
      else if (s.kind === 'host') add('staff', s, 'down');
      else if (s.kind === 'tutor') add('presenter', s, 'down');
      else if (s.kind === 'seat' && rnd.frac() < 0.45) add(rnd.frac() < 0.5 ? 'student' : 'visitor', s, 'up');
      else if (s.kind === 'lounge' && rnd.frac() < 0.7) add('visitor', s, rnd.pick(['down', 'left', 'right']), true);
      else if (s.kind === 'audience' && booth && booth.status !== 'empty' && rnd.frac() < (booth.status === 'live' ? 0.75 : 0.3))
        add(rnd.pick(['student', 'visitor', 'visitor']), s, 'up', true);
    }
    // a judge walking the floor + a few wanderers
    const wander = this.spots.filter((s) => s.kind === 'wander');
    wander.forEach((s, i) => add(i === 0 ? 'judge' : i === 1 ? 'staff' : rnd.pick(['student', 'visitor']), s, 'down', true));
  }

  private placeMinimap = () => {
    const pad = 12;
    this.minimap.setPosition(this.scale.width - this.minimap.width - pad, this.scale.height - this.minimap.height - pad);
  };

  // ---------- movement ----------
  private updatePlayer() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const dir = new Phaser.Math.Vector2(
      Number(this.cursors.right.isDown || this.wasd.D.isDown) - Number(this.cursors.left.isDown || this.wasd.A.isDown),
      Number(this.cursors.down.isDown || this.wasd.S.isDown) - Number(this.cursors.up.isDown || this.wasd.W.isDown),
    );
    if (dir.lengthSq() > 0) {
      this.path = [];
      this.marker.setVisible(false);
    } else if (this.path.length) {
      const next = this.path[0];
      const to = new Phaser.Math.Vector2(next.x - this.player.x, next.y - this.player.y);
      if (to.length() < 4) {
        this.path.shift();
        if (!this.path.length) this.marker.setVisible(false);
      } else dir.copy(to);
    }
    if (dir.lengthSq() > 0) {
      dir.normalize().scale(SPEED);
      body.setVelocity(dir.x, dir.y);
      this.playerActor.dir = facing(dir.x, dir.y);
    } else body.setVelocity(0, 0);
    this.animate(this.playerActor, dir.lengthSq() > 0);
  }

  private updateNpc(n: Actor, time: number, delta: number) {
    if (n.path.length) {
      const next = n.path[0];
      const dx = next.x - n.sprite.x;
      const dy = next.y - n.sprite.y;
      const d = Math.hypot(dx, dy);
      const step = (NPC_SPEED * delta) / 1000;
      if (d <= step) {
        n.sprite.setPosition(next.x, next.y);
        n.path.shift();
        if (!n.path.length) n.dir = n.spot?.kind === 'audience' || n.spot?.kind === 'seat' ? 'up' : n.dir;
      } else {
        n.sprite.x += (dx / d) * step;
        n.sprite.y += (dy / d) * step;
        n.dir = facing(dx, dy);
      }
      this.animate(n, true);
      return;
    }
    this.animate(n, false);
    if (!n.roam) {
      // stationary people glance around now and then
      n.wait -= delta;
      if (n.wait < 0) {
        n.wait = Phaser.Math.Between(2500, 7000);
        const base: Dir = n.spot?.kind === 'staff' || n.spot?.kind === 'seat' ? 'up' : 'down';
        n.dir = Math.random() < 0.6 ? base : Phaser.Utils.Array.GetRandom(['left', 'right'] as Dir[]);
      }
      return;
    }
    n.wait -= delta;
    if (n.wait > 0) return;
    // pick another free booth audience spot (or a wander point) and walk there
    const free = this.spots.filter((s) => !s.taken && (s.kind === 'audience' || s.kind === 'wander' || s.kind === 'lounge'));
    const target = Phaser.Utils.Array.GetRandom(free);
    n.wait = Phaser.Math.Between(6000, 16000);
    if (!target) return;
    const path = this.findPath(n.sprite.x, n.sprite.y - 4, target.x, target.y);
    if (!path) return;
    if (n.spot) n.spot.taken = false;
    target.taken = true;
    n.spot = target;
    n.path = path;
  }

  private animate(a: Actor, moving: boolean) {
    const key = `walk-${a.row}-${a.dir}`;
    if (moving) {
      if (a.sprite.anims.currentAnim?.key !== key || !a.sprite.anims.isPlaying) a.sprite.play(key);
    } else {
      a.sprite.stop();
      a.sprite.setFrame(a.row * 16 + { down: 0, left: 4, right: 8, up: 12 }[a.dir]);
    }
  }

  private syncActor(a: Actor, time: number) {
    const { x, y } = a.sprite;
    a.sprite.setDepth(y);
    a.shadow.setPosition(x, y - 2).setDepth(y - 0.1);
    a.label.setPosition(x, y - 47).setDepth(100002 + y / 10000);
    if (a.bubble) {
      if (time > a.bubble.until) {
        a.bubble.box.destroy();
        a.bubble = undefined;
      } else a.bubble.box.setPosition(x, y - 56);
    }
  }

  private say(a: Actor, text: string, time: number) {
    a.bubble?.box.destroy();
    const box = this.add.text(a.sprite.x, a.sprite.y - 56, text, {
      fontFamily: 'system-ui, sans-serif', fontSize: '8px', color: '#3b2f4f', resolution: 4,
      backgroundColor: '#ffffff', padding: { left: 5, right: 5, top: 3, bottom: 3 },
    }).setOrigin(0.5, 1).setDepth(100010);
    box.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.minimap.ignore(box);
    a.bubble = { box, until: time + 3200 };
  }

  private randomChat(time: number) {
    this.nextChat = time + Phaser.Math.Between(900, 1800);
    const view = this.cameras.main.worldView;
    const visible = this.npcs.filter((n) => !n.path.length && !n.bubble && view.contains(n.sprite.x, n.sprite.y));
    const n = Phaser.Utils.Array.GetRandom(visible);
    if (!n) return;
    const presenter = n.spot?.kind === 'presenter';
    this.say(n, Phaser.Utils.Array.GetRandom(presenter ? LINES_PRESENTER : LINES_VISITOR), time);
  }

  private updateBooth() {
    const inside = this.booths.find((b) => b.rect.contains(this.player.x, this.player.y)) ?? null;
    if (inside === this.currentBooth) return;
    if (this.currentBooth) this.game.events.emit(ShowcaseEvents.BOOTH_LEAVE, this.currentBooth.no);
    this.currentBooth = inside;
    if (inside) {
      const { rect: _r, ...info } = inside;
      this.game.events.emit(ShowcaseEvents.BOOTH_ENTER, info);
    }
  }

  // people within the S4 hearing radius (sorted by distance)
  private updateNearby() {
    const near = this.npcs
      .map((n) => ({ n, d: Phaser.Math.Distance.Between(n.sprite.x, n.sprite.y, this.player.x, this.player.y) }))
      .filter((e) => e.d < HEAR_RADIUS)
      .sort((a, b) => a.d - b.d)
      .slice(0, 8)
      .map((e) => e.n.name);
    const key = near.join(',');
    if (key === this.nearbyKey) return;
    this.nearbyKey = key;
    this.game.events.emit(ShowcaseEvents.NEARBY, near);
  }

  // ---------- path finding (A* on a 16px grid, 8 directions, no corner cutting) ----------
  private markBlocked(x: number, y: number, w: number, h: number) {
    for (let gy = Math.floor(y / NAV); gy <= Math.floor((y + h) / NAV); gy++)
      for (let gx = Math.floor(x / NAV); gx <= Math.floor((x + w) / NAV); gx++)
        if (gx >= 0 && gy >= 0 && gx < this.gw && gy < this.gh) this.blocked[gy * this.gw + gx] = 1;
  }

  private nearestFree(gx: number, gy: number) {
    for (let r = 0; r < 6; r++)
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const x = gx + dx, y = gy + dy;
          if (x >= 0 && y >= 0 && x < this.gw && y < this.gh && !this.blocked[y * this.gw + x]) return [x, y] as const;
        }
    return null;
  }

  private findPath(sx: number, sy: number, tx: number, ty: number): Phaser.Math.Vector2[] | null {
    const s = this.nearestFree(Math.floor(sx / NAV), Math.floor(sy / NAV));
    const t = this.nearestFree(Math.floor(tx / NAV), Math.floor(ty / NAV));
    if (!s || !t) return null;
    const W = this.gw;
    const start = s[1] * W + s[0], goal = t[1] * W + t[0];
    const g = new Float32Array(W * this.gh).fill(Infinity);
    const from = new Int32Array(W * this.gh).fill(-1);
    const closed = new Uint8Array(W * this.gh);
    const open: number[] = [start];
    const f = new Float32Array(W * this.gh).fill(Infinity);
    const h = (i: number) => { const dx = Math.abs((i % W) - t[0]), dy = Math.abs(Math.floor(i / W) - t[1]); return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy); };
    g[start] = 0; f[start] = h(start);
    while (open.length) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (f[open[i]] < f[open[bi]]) bi = i;
      const cur = open[bi];
      open.splice(bi, 1);
      if (cur === goal) break;
      closed[cur] = 1;
      const cx = cur % W, cy = Math.floor(cur / W);
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= this.gh) continue;
          const ni = ny * W + nx;
          if (this.blocked[ni] || closed[ni]) continue;
          if (dx && dy && (this.blocked[cy * W + nx] || this.blocked[ny * W + cx])) continue;
          const ng = g[cur] + (dx && dy ? Math.SQRT2 : 1);
          if (ng < g[ni]) {
            if (g[ni] === Infinity) open.push(ni);
            g[ni] = ng; f[ni] = ng + h(ni); from[ni] = cur;
          }
        }
    }
    if (from[goal] === -1 && goal !== start) return null;
    const cells: number[] = [];
    for (let c = goal; c !== -1 && c !== start; c = from[c]) cells.unshift(c);
    const pts = cells.map((c) => new Phaser.Math.Vector2((c % W) * NAV + NAV / 2, Math.floor(c / W) * NAV + NAV / 2));
    // finish on the exact target when it is walkable
    if (pts.length && !this.blocked[Math.floor(ty / NAV) * W + Math.floor(tx / NAV)]) pts[pts.length - 1] = new Phaser.Math.Vector2(tx, ty);
    return simplify(pts);
  }
}

function props(o: Phaser.Types.Tilemaps.TiledObject) {
  const out: Record<string, string> & { box?: number[]; w: number; h: number } = { w: 0, h: 0 } as never;
  for (const p of (o.properties as { name: string; value: string | number }[] | undefined) ?? []) {
    if (p.name === 'box') out.box = String(p.value) ? String(p.value).split(',').map(Number) : undefined;
    else if (p.name === 'w' || p.name === 'h') out[p.name] = Number(p.value);
    else out[p.name] = String(p.value);
  }
  return out;
}

function facing(dx: number, dy: number): Dir {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}

// drop points that lie on a straight line so walking looks smooth
function simplify(pts: Phaser.Math.Vector2[]) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1], b = pts[i], c = pts[i + 1];
    const d1x = Math.sign(b.x - a.x), d1y = Math.sign(b.y - a.y), d2x = Math.sign(c.x - b.x), d2y = Math.sign(c.y - b.y);
    if (d1x !== d2x || d1y !== d2y) out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
