// Generates the hall preset maps (POC "presets" page): Room (≤ 12 booths) + Hall (≤ 30 booths).
// A preset holds only the floor, walls, decoration and booth *slots*. Booths are placed at runtime from the
// project list, so the same map works for any number of projects, with or without categories.
// Reuses the art library of the /hall page. Run: npm run gen:presets
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Img, rng } from './lib/pixel.mjs';
import { T, TILE, COLLIDES, tileset, props } from './lib/hall-art.mjs';

const OUT = new URL('../public/assets/presets/', import.meta.url);
mkdirSync(OUT, { recursive: true });

// characters: reuse the /hall sheet and its row kinds
const hallMap = JSON.parse(readFileSync(new URL('../public/assets/hall/hall.json', import.meta.url), 'utf8'));
const characters = hallMap.properties.find((p) => p.name === 'characters').value;

// ---------- tileset + props atlas ----------
const ts = tileset();
writeFileSync(new URL('tiles.png', OUT), ts.img.png());
const P = props();
const ATLAS_W = 512;
const entries = Object.entries(P).sort((a, b) => b[1].img.h - a[1].img.h);
let ax = 0, ay = 0, shelf = 0;
const frames = {};
for (const [name, p] of entries) {
  if (ax + p.img.w > ATLAS_W) { ax = 0; ay += shelf + 2; shelf = 0; }
  frames[name] = { x: ax, y: ay, w: p.img.w, h: p.img.h };
  ax += p.img.w + 2;
  shelf = Math.max(shelf, p.img.h);
}
const atlas = new Img(ATLAS_W, ay + shelf);
for (const [name, p] of entries) atlas.blit(p.img, frames[name].x, frames[name].y);
writeFileSync(new URL('props.png', OUT), atlas.png());
writeFileSync(new URL('props.json', OUT), JSON.stringify({
  frames: Object.fromEntries(Object.entries(frames).map(([n, f]) => [n, {
    frame: f, rotated: false, trimmed: false, spriteSourceSize: { x: 0, y: 0, ...f }, sourceSize: { w: f.w, h: f.h },
  }])),
  meta: { image: 'props.png', size: { w: ATLAS_W, h: ay + shelf }, scale: '1' },
}));
writeFileSync(new URL('boxes.json', OUT), JSON.stringify(Object.fromEntries(Object.entries(P).filter(([, p]) => p.box).map(([n, p]) => [n, p.box]))));

// ---------- map builder ----------
// booth slot = 4 x 5 tiles (backdrop · table · audience) · 1 tile gap between slots so each booth zone reads on its own
const SLOT_W = 4, SLOT_H = 5, PITCH_X = 5, PITCH_Y = 6;

function builder(W, H, entrance) {
  const floor = new Array(W * H).fill(0);
  const walls = new Array(W * H).fill(0);
  const setT = (layer, tx, ty, id) => { if (tx >= 0 && ty >= 0 && tx < W && ty < H) layer[ty * W + tx] = id + 1; };
  const fill = (layer, x0, y0, x1, y1, id) => { for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) setT(layer, tx, ty, id); };
  const fr = rng(W * 7 + H);
  for (let ty = 0; ty < H; ty++) for (let tx = 0; tx < W; tx++) setT(floor, tx, ty, fr() < 0.5 ? TILE.WOOD : TILE.WOOD2);
  for (let tx = 0; tx < W; tx++) {
    const win = tx % 8 === 4 || tx % 8 === 5;
    setT(walls, tx, 0, TILE.WALL_TOP);
    setT(walls, tx, 1, win ? TILE.WIN_UP : TILE.FACE_UP);
    setT(walls, tx, 2, win ? TILE.WIN_LOW : TILE.FACE_LOW);
  }
  for (let ty = 0; ty < H; ty++) { setT(walls, 0, ty, TILE.WALL_TOP); setT(walls, W - 1, ty, TILE.WALL_TOP); }
  for (let tx = 0; tx < W; tx++) if (tx < entrance[0] || tx > entrance[1]) setT(walls, tx, H - 1, TILE.WALL_TOP);
  fill(floor, entrance[0], H - 3, entrance[1], H - 1, TILE.MAT);

  let oid = 1;
  const layers = { blocks: [], slots: [], props: [], signs: [], spots: [], spawns: [] };
  const pt = (type, name, x, y, properties = []) => ({ id: oid++, name, type, x: x * T, y: y * T, width: 0, height: 0, point: true, rotation: 0, visible: true, properties });
  const prop = (key, cx, bottom) => {
    if (!P[key]) throw new Error(`unknown prop ${key}`);
    layers.props.push(pt('prop', key, cx, bottom, [
      { name: 'key', type: 'string', value: key },
      { name: 'box', type: 'string', value: P[key].box ? P[key].box.join(',') : '' },
      { name: 'w', type: 'int', value: P[key].img.w }, { name: 'h', type: 'int', value: P[key].img.h },
    ]));
  };
  const spot = (kind, tx, ty) => layers.spots.push(pt('spot', kind, tx, ty));
  const sign = (text, zone, tx, ty) => layers.signs.push(pt('sign', text, tx, ty, [{ name: 'zone', type: 'string', value: zone }]));
  // block of booth slots: top-left tile (bx, by), rows x cols
  const block = (id, bx, by, rows, cols) => {
    const w = cols * PITCH_X + 1, h = rows * PITCH_Y + 1;
    layers.blocks.push({ id: oid++, name: id, type: 'block', x: bx * T, y: by * T, width: w * T, height: h * T, rotation: 0, visible: true, properties: [] });
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        layers.slots.push({
          id: oid++, name: `${id}-${r * cols + c + 1}`, type: 'slot',
          x: (bx + 1 + c * PITCH_X) * T, y: (by + 1 + r * PITCH_Y) * T, width: SLOT_W * T, height: SLOT_H * T, rotation: 0, visible: true,
          properties: [{ name: 'block', type: 'string', value: id }],
        });
  };
  const spawn = (tx, ty) => layers.spawns.push(pt('spawn', 'spawn', tx, ty));

  const save = (file, name) => {
    // fill order: block closest to the spawn first, reading order inside a block
    const sp = layers.spawns[0];
    const rank = Object.fromEntries(layers.blocks
      .map((b) => ({ id: b.name, d: Math.hypot(b.x + b.width / 2 - sp.x, b.y + b.height / 2 - sp.y) }))
      .sort((a, b) => a.d - b.d).map((b, i) => [b.id, i]));
    layers.blocks.sort((a, b) => rank[a.name] - rank[b.name]);
    layers.slots.sort((a, b) => rank[a.properties[0].value] - rank[b.properties[0].value] || a.y - b.y || a.x - b.x);
    layers.slots.forEach((s, i) => s.properties.push({ name: 'order', type: 'int', value: i }));
    const objLayer = (id, lname, objs) => ({ id, name: lname, type: 'objectgroup', draworder: 'topdown', objects: objs, opacity: 1, visible: true, x: 0, y: 0 });
    const tileLayer = (id, lname, data) => ({ id, name: lname, type: 'tilelayer', data, width: W, height: H, opacity: 1, visible: true, x: 0, y: 0 });
    const map = {
      type: 'map', version: '1.10', tiledversion: '1.11.0', orientation: 'orthogonal', renderorder: 'right-down', infinite: false,
      width: W, height: H, tilewidth: T, tileheight: T, compressionlevel: -1, nextlayerid: 9, nextobjectid: oid,
      properties: [
        { name: 'characters', type: 'string', value: characters },
        { name: 'preset', type: 'string', value: name },
      ],
      layers: [
        tileLayer(1, 'floor', floor), tileLayer(2, 'walls', walls),
        objLayer(3, 'blocks', layers.blocks), objLayer(4, 'slots', layers.slots), objLayer(5, 'props', layers.props),
        objLayer(6, 'signs', layers.signs), objLayer(7, 'spots', layers.spots), objLayer(8, 'spawns', layers.spawns),
      ],
      tilesets: [{
        firstgid: 1, name: 'hall-tiles', image: 'tiles.png', imagewidth: ts.img.w, imageheight: ts.img.h,
        tilewidth: T, tileheight: T, tilecount: ts.count, columns: ts.cols, margin: 0, spacing: 0,
        tiles: COLLIDES.map((id) => ({ id, properties: [{ name: 'collides', type: 'bool', value: true }] })),
      }],
    };
    writeFileSync(new URL(file, OUT), JSON.stringify(map));
    console.log(`${name} ${W}x${H} · ${layers.blocks.length} blocks · ${layers.slots.length} slots · ${layers.props.length} props`);
  };
  return { W, H, floor, fill, prop, spot, sign, block, spawn, save };
}

// ---------- Room: one room, ≤ 12 booths (class poster session) ----------
{
  const m = builder(34, 26, [15, 18]);
  m.block('north', 1, 3, 1, 6);
  m.block('south', 1, 16, 1, 6);
  // open middle: lounge to stand and chat
  m.fill(m.floor, 11, 11, 22, 14, TILE.RUG);
  m.prop('coffee_table', 16.5, 13.4);
  m.prop('beanbag_sky', 13, 13.6);
  m.prop('beanbag_butter', 20, 13.6);
  m.prop('plant', 2, 14.6);
  m.prop('plant', 32, 14.6);
  m.prop('water', 31.2, 24.4);
  m.prop('board', 12, 24.6);
  m.prop('rollup_blue', 14.2, 24.6);
  m.prop('rollup_pink', 19.8, 24.6);
  for (const [tx, ty] of [[12.4, 12.4], [21, 12.4], [16.5, 11.6]]) m.spot('lounge', tx, ty);
  for (const [tx, ty] of [[6, 10.4], [26, 10.4], [9, 23.6], [25, 23.6]]) m.spot('wander', tx, ty);
  m.sign('Class Poster Session', 'welcome', 17, 10.2);
  m.spawn(17, 24.4);
  m.save('room.json', 'room');
}

// ---------- Hall: rows + aisles, ≤ 30 booths, with stage / workshop / lounge as scenery ----------
{
  const m = builder(70, 42, [32, 37]);
  // aisles in stone
  m.fill(m.floor, 1, 16, 68, 18, TILE.STONE);
  m.fill(m.floor, 1, 32, 68, 33, TILE.STONE);
  m.fill(m.floor, 15, 3, 16, 33, TILE.STONE);
  m.fill(m.floor, 33, 3, 34, 33, TILE.STONE);
  m.fill(m.floor, 51, 3, 52, 33, TILE.STONE);
  // 5 blocks of 2 x 3 slots · bottom-middle is the lounge next to the entrance
  m.block('A1', 17, 3, 2, 3);
  m.block('B1', 35, 3, 2, 3);
  m.block('C1', 53, 3, 2, 3);
  m.block('A2', 17, 19, 2, 3);
  m.block('C2', 53, 19, 2, 3);

  // stage (scenery · normal proximity)
  m.fill(m.floor, 1, 3, 14, 8, TILE.STAGE);
  m.fill(m.floor, 1, 9, 14, 9, TILE.STAGE_EDGE);
  m.prop('screen', 7.5, 6.2);
  m.prop('podium', 11.5, 7.6);
  m.prop('speaker', 2.2, 7.8);
  m.prop('speaker', 13, 7.8);
  for (let ry = 0; ry < 3; ry++)
    for (let cx = 0; cx < 10; cx++) {
      const tx = 2.5 + cx + (cx >= 5 ? 1 : 0);
      m.prop('chair', tx, 11.6 + ry * 1.3);
      if ((cx + ry) % 3 === 0) m.spot('seat', tx, 11.3 + ry * 1.3);
    }
  m.sign('Main Stage', 'stage', 7.5, 9.6);

  // workshop (scenery)
  for (const [cx, by] of [[5.5, 22], [11.5, 22], [5.5, 27.4], [11.5, 27.4]]) {
    m.prop('work_desk', cx, by);
    for (const dx of [-1.6, 0, 1.6]) { m.prop('chair', cx + dx, by + 1.25); m.spot('seat', cx + dx, by + 0.95); }
  }
  m.sign('Workshop', 'mint', 8, 18.6);

  // lounge next to the entrance
  m.fill(m.floor, 37, 21, 48, 29, TILE.RUG);
  m.prop('counter', 42.5, 21.2);
  m.prop('water', 47.5, 21.2);
  m.prop('sofa', 42.5, 25.4);
  m.prop('coffee_table', 42.5, 27.6);
  m.prop('armchair_mint', 39.5, 28.2);
  m.prop('armchair_lilac', 45.5, 28.2);
  m.prop('beanbag_sky', 38.5, 30.6);
  m.prop('beanbag_butter', 46.5, 30.8);
  m.prop('plant', 36, 22);
  m.prop('plant', 49.6, 30.6);
  for (const [tx, ty] of [[40.5, 22.4], [44.5, 22.4], [39.6, 29.4], [45.6, 29.4], [42.5, 29.6]]) m.spot('lounge', tx, ty);
  m.sign('Lounge & Coffee', 'lounge', 42.5, 18.6);

  // entrance plaza: directory board + roll-ups
  m.prop('board', 29.5, 38.6);
  m.prop('rollup_blue', 31.2, 40.4);
  m.prop('rollup_pink', 38.8, 40.4);
  for (const tx of [2, 14.5, 55.5, 67.5]) m.prop('plant_s', tx, 40.6);
  m.prop('bin', 41.5, 38.6);
  m.sign('Senior Project Showcase 2027', 'welcome', 34.9, 35.3);
  for (const [tx, ty] of [[34, 10], [34, 25], [24, 17.4], [44, 17.4], [60, 17.4], [52, 25], [20, 32.6], [48, 32.6], [10, 17.4]]) m.spot('wander', tx, ty);
  m.spawn(34.9, 40.2);
  m.save('hall.json', 'hall');
}
