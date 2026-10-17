// Generates the showcase hall art + map (POC "hall" page): tileset, chibi characters, props atlas, Tiled JSON.
// All art is drawn by code (owned by the team, no third-party assets). Run: npm run gen:hall
import { writeFileSync, mkdirSync } from 'node:fs';
import { Img, hex, rng } from './lib/pixel.mjs';
import { spriteSheet, SKIN, HAIR, FW, FH } from './lib/chibi.mjs';
import { T, TILE, COLLIDES, tileset, props } from './lib/hall-art.mjs';

const OUT = new URL('../public/assets/hall/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// ---------- characters ----------
const ROLE = { visitor: null, presenter: hex('#4fbf8f'), staff: hex('#ffb347'), judge: hex('#f2c94c') };
const r = rng(7);
const pick = (a) => a[Math.floor(r() * a.length)];
const navy = hex('#2b2d42');
const casual = ['#c7b6f5', '#9ee0c2', '#ffc9b5', '#a8d1fa', '#ffe08a', '#f7a8c4'].map((s) => hex(s));
const jeans = ['#5b6f9e', '#3d4a6b', '#8a7f72', '#2b2d42'].map((s) => hex(s));

function student(gender, role) {
  const girl = gender === 'f';
  return {
    skin: pick(SKIN),
    hair: pick(HAIR.slice(0, 5)),
    hairStyle: girl ? pick(['long', 'bob', 'pony', 'buns']) : pick(['short', 'short', 'spiky']),
    top: 'uniform', tie: !girl, bottom: girl ? 'skirt' : 'pants', bottomColor: navy,
    lanyard: ROLE[role], glasses: r() < 0.25,
  };
}
function visitor() {
  const girl = r() < 0.5;
  return {
    skin: pick(SKIN), hair: pick(HAIR), hairStyle: girl ? pick(['long', 'bob', 'pony']) : pick(['short', 'spiky']),
    top: pick(['hoodie', 'tee']), topColor: pick(casual),
    bottom: girl && r() < 0.5 ? 'skirt' : 'pants', bottomColor: pick(jeans), glasses: r() < 0.2,
  };
}
const staff = (g) => ({ ...student(g, 'staff'), top: 'staff', tie: false, bottom: 'pants', bottomColor: hex('#3d4a6b') });
const judge = (g) => ({ ...student(g, 'judge'), top: 'judge', tie: false, bottom: 'pants', bottomColor: hex('#2f3a63'), hair: pick([HAIR[0], HAIR[1], HAIR[5]]) });

// Row order is the character "kind" index used by the game (see hallData.ts)
const characters = [
  { kind: 'player', spec: { skin: SKIN[1], hair: HAIR[2], hairStyle: 'short', top: 'tee', topColor: hex('#4655e8'), bottom: 'pants', bottomColor: hex('#3d4a6b') } },
  ...Array.from({ length: 6 }, (_, i) => ({ kind: 'presenter', spec: student(i % 2 ? 'f' : 'm', 'presenter') })),
  ...Array.from({ length: 4 }, (_, i) => ({ kind: 'student', spec: student(i % 2 ? 'm' : 'f', 'visitor') })),
  ...Array.from({ length: 5 }, () => ({ kind: 'visitor', spec: visitor() })),
  { kind: 'staff', spec: staff('f') }, { kind: 'staff', spec: staff('m') },
  { kind: 'judge', spec: judge('m') }, { kind: 'judge', spec: judge('f') },
];
writeFileSync(new URL('students.png', OUT), spriteSheet(characters.map((c) => c.spec)).png());

// ---------- tileset ----------
const ts = tileset();
writeFileSync(new URL('tiles.png', OUT), ts.img.png());

// ---------- props atlas (shelf packing) ----------
const P = props();
const ATLAS_W = 512;
const entries = Object.entries(P).sort((a, b) => b[1].img.h - a[1].img.h);
let x = 0, y = 0, shelf = 0;
const frames = {};
for (const [name, p] of entries) {
  if (x + p.img.w > ATLAS_W) { x = 0; y += shelf + 2; shelf = 0; }
  frames[name] = { x, y, w: p.img.w, h: p.img.h };
  x += p.img.w + 2;
  shelf = Math.max(shelf, p.img.h);
}
const atlas = new Img(ATLAS_W, y + shelf);
for (const [name, p] of entries) atlas.blit(p.img, frames[name].x, frames[name].y);
writeFileSync(new URL('props.png', OUT), atlas.png());
writeFileSync(new URL('props.json', OUT), JSON.stringify({
  frames: Object.fromEntries(Object.entries(frames).map(([n, f]) => [n, {
    frame: f, rotated: false, trimmed: false, spriteSourceSize: { x: 0, y: 0, ...f }, sourceSize: { w: f.w, h: f.h },
  }])),
  meta: { image: 'props.png', size: { w: ATLAS_W, h: y + shelf }, scale: '1' },
}));

// ---------- map ----------
const W = 60, H = 40;
const floor = new Array(W * H).fill(0);
const walls = new Array(W * H).fill(0);
const setT = (layer, tx, ty, id) => { if (tx >= 0 && ty >= 0 && tx < W && ty < H) layer[ty * W + tx] = id + 1; };
const fill = (layer, x0, y0, x1, y1, id) => { for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) setT(layer, tx, ty, id); };

const fr = rng(3);
for (let ty = 0; ty < H; ty++) for (let tx = 0; tx < W; tx++) setT(floor, tx, ty, fr() < 0.5 ? TILE.WOOD : TILE.WOOD2);
// top wall: cap + 2-tile face with windows
for (let tx = 0; tx < W; tx++) {
  const win = tx % 8 === 4 || tx % 8 === 5;
  setT(walls, tx, 0, TILE.WALL_TOP);
  setT(walls, tx, 1, win ? TILE.WIN_UP : TILE.FACE_UP);
  setT(walls, tx, 2, win ? TILE.WIN_LOW : TILE.FACE_LOW);
}
for (let ty = 0; ty < H; ty++) { setT(walls, 0, ty, TILE.WALL_TOP); setT(walls, W - 1, ty, TILE.WALL_TOP); }
const ENTRANCE = [29, 34];
for (let tx = 0; tx < W; tx++) if (tx < ENTRANCE[0] || tx > ENTRANCE[1]) setT(walls, tx, H - 1, TILE.WALL_TOP);
fill(floor, ENTRANCE[0], H - 3, ENTRANCE[1], H - 1, TILE.MAT);
// main aisles in stone
fill(floor, 1, 16, W - 2, 17, TILE.STONE);
fill(floor, 31, 3, 33, H - 4, TILE.STONE);
fill(floor, 1, 31, W - 2, 32, TILE.STONE);

// stage (left)
fill(floor, 1, 3, 14, 8, TILE.STAGE);
fill(floor, 1, 9, 14, 9, TILE.STAGE_EDGE);
// lounge rug (right)
fill(floor, 50, 7, 57, 13, TILE.RUG);

let oid = 1;
const objects = { booths: [], props: [], signs: [], spots: [], spawns: [] };
const prop = (key, cx, bottom) => objects.props.push({
  id: oid++, name: key, type: 'prop', x: cx * T, y: bottom * T, width: 0, height: 0, point: true, rotation: 0, visible: true,
  properties: [
    { name: 'key', type: 'string', value: key },
    { name: 'box', type: 'string', value: P[key].box ? P[key].box.join(',') : '' },
    { name: 'w', type: 'int', value: P[key].img.w }, { name: 'h', type: 'int', value: P[key].img.h },
  ],
});
const spot = (kind, tx, ty, extra = {}) => objects.spots.push({
  id: oid++, name: kind, type: 'spot', x: tx * T, y: ty * T, width: 0, height: 0, point: true, rotation: 0, visible: true,
  properties: Object.entries(extra).map(([n, v]) => ({ name: n, type: typeof v === 'number' ? 'float' : 'string', value: v })),
});
const sign = (text, zone, tx, ty) => objects.signs.push({
  id: oid++, name: text, type: 'sign', x: tx * T, y: ty * T, width: 0, height: 0, point: true, rotation: 0, visible: true,
  properties: [{ name: 'zone', type: 'string', value: zone }],
});

// booth zones: 4 categories x 6 booths
const ZONE_DEFS = [
  { zone: 'mint', tile: TILE.MINT, label: 'AI & Data', x: 17, y: 3 },
  { zone: 'lilac', tile: TILE.LILAC, label: 'Web & Mobile', x: 34, y: 3 },
  { zone: 'peach', tile: TILE.PEACH, label: 'IoT & Robotics', x: 17, y: 18 },
  { zone: 'sky', tile: TILE.SKY, label: 'Games & XR', x: 34, y: 18 },
];
const TITLES = {
  mint: ['Elective Recommender', 'Thai Receipt OCR', 'Campus Crowd Forecast', 'Plant Disease Scanner', 'Lecture Summariser', 'Fake News Checker'],
  lilac: ['Dorm Repair Tracker', 'Club Event Hub', 'Lost & Found Map', 'Carpool for Students', 'Canteen Pre-order', 'Study Room Booking'],
  peach: ['Smart Parking Sensor', 'Air Quality Station', 'Delivery Robot', 'Smart Farm Kit', 'Elderly Fall Alert', 'Energy Meter Dashboard'],
  sky: ['VR Chemistry Lab', 'Thai History RPG', 'AR Campus Tour', 'Rehab Exercise Game', 'Sign Language Trainer', 'Rhythm Typing Game'],
};
const STATUS = ['live', 'present', 'present', 'empty', 'present', 'live'];
let boothNo = 1;
for (const z of ZONE_DEFS) {
  fill(floor, z.x, z.y, z.x + 13, z.y + 12, z.tile);
  sign(z.label, z.zone, z.x + 7, z.y - 0.45);
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < 3; i++) {
      const bx = z.x + 1 + i * 4;
      const by = z.y + 1 + row * 6;
      const idx = row * 3 + i;
      const no = String(boothNo++).padStart(2, '0');
      const status = STATUS[(idx + boothNo) % STATUS.length];
      prop(`backdrop_${z.zone}_${(i + row) % 2}`, bx + 2, by + 2);
      prop(`table_${z.zone}_${(idx + row) % 3}`, bx + 2, by + 3.3);
      objects.booths.push({
        id: oid++, name: `booth-${no}`, type: 'booth', x: bx * T, y: by * T, width: 4 * T, height: 5 * T, rotation: 0, visible: true,
        properties: [
          { name: 'no', type: 'string', value: no },
          { name: 'title', type: 'string', value: TITLES[z.zone][idx] },
          { name: 'zone', type: 'string', value: z.zone },
          { name: 'category', type: 'string', value: z.label },
          { name: 'status', type: 'string', value: status },
        ],
      });
      if (status !== 'empty') {
        spot('presenter', bx + 1.5, by + 2.45, { booth: no });
        if (status === 'live' || idx % 2 === 0) spot('presenter', bx + 2.6, by + 2.45, { booth: no });
      }
      for (let k = 0; k < 4; k++) spot('audience', bx + 0.8 + k * 0.8, by + 4.2 + (k % 2) * 0.5, { booth: no });
    }
}

// stage
prop('screen', 7.5, 6.2);
prop('podium', 11.5, 7.6);
prop('speaker', 2.2, 7.8);
prop('speaker', 13, 7.8);
for (let ry = 0; ry < 4; ry++)
  for (let cx = 0; cx < 10; cx++) {
    const tx = 2.5 + cx + (cx >= 5 ? 1 : 0);
    prop('chair', tx, 11.6 + ry * 1.3);
    if ((cx + ry) % 3 === 0) spot('seat', tx, 11.3 + ry * 1.3);
  }
spot('host', 10.5, 7.3);
sign('Main Stage', 'stage', 7.5, 9.6);

// lounge
prop('counter', 53, 4.7);
prop('water', 57.5, 4.7);
prop('sofa', 53.5, 9.2);
prop('coffee_table', 53.5, 11.4);
prop('armchair_mint', 50.8, 12);
prop('armchair_lilac', 56.4, 12);
prop('beanbag_sky', 51.5, 14.6);
prop('beanbag_butter', 55.5, 14.8);
prop('plant', 49.6, 6.5);
prop('plant', 58, 14.8);
for (const [tx, ty] of [[52, 6.2], [54.5, 6.3], [50.6, 13.3], [56.6, 13.4], [53.5, 13.6]]) spot('lounge', tx, ty);
sign('Lounge & Coffee', 'lounge', 53.5, 2.9);

// judges + vote (right, lower)
prop('judge_desk', 53.5, 21.6);
prop('vote_box', 56.8, 25.4);
prop('board', 52, 27.6);
prop('bin', 58, 25.2);
for (const tx of [51, 53.3, 55.6]) spot('judge', tx, 20.6);
sign('Judges', 'judge', 53.5, 18.4);
sign('Popular Vote', 'vote', 56.8, 23.2);

// entrance + registration
prop('reg_desk', 24.5, 35.4);
prop('board', 40, 35.6);
prop('rollup_blue', 28.2, 38.4);
prop('rollup_pink', 35.6, 38.4);
for (const tx of [21.8, 24.2, 26.6]) spot('staff', tx, 34.3);
sign('Registration', 'reg', 24.5, 32.0);
sign('Senior Project Showcase 2027', 'welcome', 31.9, 35.3);

// plants along walls
for (const tx of [15.6, 31.9, 48.4]) prop('plant', tx, 4.2);
for (const tx of [2, 15.5, 48.5]) prop('plant_s', tx, 38.6);
for (const [tx, ty] of [[1.4, 22], [1.4, 30], [58.2, 30]]) prop('plant', tx, ty);
prop('water', 15.6, 30);
prop('bin', 15.6, 30.8);

// workshop for high-school visitors (left, lower)
for (const [cx, by] of [[5.5, 22], [11.5, 22], [5.5, 27.4], [11.5, 27.4]]) {
  prop('work_desk', cx, by);
  for (const dx of [-1.6, 0, 1.6]) { prop('chair', cx + dx, by + 1.25); spot('seat', cx + dx, by + 0.95); }
  spot('tutor', cx, by - 0.95);
}
sign('Workshop', 'mint', 8.5, 18.6);
// rest corner (right, lower)
prop('armchair_mint', 45, 35.4);
prop('armchair_lilac', 47.5, 35.4);
prop('beanbag_butter', 52, 36);
prop('plant', 50, 35.2);
spot('lounge', 46.2, 36.6);

// free walkers + spawn
for (const [tx, ty] of [[32, 10], [32, 24], [24, 16.6], [41, 16.6], [10, 20], [45, 31.6], [20, 31.6], [52, 30], [8, 27], [32, 34]]) spot('wander', tx, ty);
objects.spawns.push({ id: oid++, name: 'spawn', type: 'spawn', point: true, x: 32 * T, y: 38.2 * T, width: 0, height: 0, rotation: 0, visible: true });

const objLayer = (id, name, objs) => ({ id, name, type: 'objectgroup', draworder: 'topdown', objects: objs, opacity: 1, visible: true, x: 0, y: 0 });
const tileLayer = (id, name, data) => ({ id, name, type: 'tilelayer', data, width: W, height: H, opacity: 1, visible: true, x: 0, y: 0 });
const map = {
  type: 'map', version: '1.10', tiledversion: '1.11.0', orientation: 'orthogonal', renderorder: 'right-down', infinite: false,
  width: W, height: H, tilewidth: T, tileheight: T, compressionlevel: -1, nextlayerid: 8, nextobjectid: oid,
  properties: [{ name: 'characters', type: 'string', value: characters.map((c) => c.kind).join(',') }],
  layers: [
    tileLayer(1, 'floor', floor), tileLayer(2, 'walls', walls),
    objLayer(3, 'booths', objects.booths), objLayer(4, 'props', objects.props), objLayer(5, 'signs', objects.signs),
    objLayer(6, 'spots', objects.spots), objLayer(7, 'spawns', objects.spawns),
  ],
  tilesets: [{
    firstgid: 1, name: 'hall-tiles', image: 'tiles.png', imagewidth: ts.img.w, imageheight: ts.img.h,
    tilewidth: T, tileheight: T, tilecount: ts.count, columns: ts.cols, margin: 0, spacing: 0,
    tiles: COLLIDES.map((id) => ({ id, properties: [{ name: 'collides', type: 'bool', value: true }] })),
  }],
};
writeFileSync(new URL('hall.json', OUT), JSON.stringify(map));
console.log(`hall ${W}x${H} · ${objects.booths.length} booths · ${objects.props.length} props · ${characters.length} characters (${FW}x${FH})`);
