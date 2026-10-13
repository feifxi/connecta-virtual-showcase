// Generates placeholder assets: hall map (Tiled JSON) + tileset PNG + player sprite PNG.
// Output can be opened and edited in Tiled. Run: npm run gen:map
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const OUT = new URL('../public/assets/maps/', import.meta.url);
const T = 32; // tile size
const W = 40; // map width in tiles
const H = 30; // map height in tiles

// Tile ids inside the tileset (Tiled gid = id + 1)
const FLOOR = 0, WALL = 1, BOOTH_FLOOR = 2, TABLE = 3;
const COLORS = {
  [FLOOR]: [[236, 233, 226], [224, 220, 211]],
  [WALL]: [[70, 76, 92], [52, 57, 70]],
  [BOOTH_FLOOR]: [[214, 228, 245], [198, 215, 238]],
  [TABLE]: [[156, 110, 74], [120, 82, 54]],
};

// --- tileset PNG (4 tiles in one row) ---
function png(width, height, pixel) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixel(x, y);
      const i = y * (width * 4 + 1) + 1 + x * 4;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = a;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const tilesetPng = png(T * 4, T, (x, y) => {
  const id = Math.floor(x / T);
  const lx = x % T;
  const [base, edge] = COLORS[id];
  const border = lx === 0 || y === 0 || lx === T - 1 || y === T - 1;
  return [...(border ? edge : base), 255];
});

// Player sprite: 24x24 circle. A PNG asset instead of Graphics.generateTexture(),
// which in Phaser 4 retains every scene (and its WebGL context) via the static Graphics.TargetCamera
const playerPng = png(24, 24, (x, y) => {
  const d = Math.hypot(x + 0.5 - 12, y + 0.5 - 12);
  if (d > 11.5) return [0, 0, 0, 0];
  return d > 9.5 ? [255, 255, 255, 255] : [228, 87, 46, 255];
});

// --- map layers ---
const floor = new Array(W * H).fill(FLOOR + 1);
const walls = new Array(W * H).fill(0);
const set = (layer, x, y, id) => { layer[y * W + x] = id + 1; };

for (let x = 0; x < W; x++) { set(walls, x, 0, WALL); set(walls, x, H - 1, WALL); }
for (let y = 0; y < H; y++) { set(walls, 0, y, WALL); set(walls, W - 1, y, WALL); }

// Booth grid: 3 rows x 4 cols, each booth 6x4 tiles, table row at the back
const BW = 6, BH = 4, COLS = 4, ROWS = 3, GAP_X = 3, GAP_Y = 4, LEFT = 3, TOP = 4;
const booths = [];
let nextObjectId = 1;
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const bx = LEFT + c * (BW + GAP_X);
    const by = TOP + r * (BH + GAP_Y);
    for (let y = by; y < by + BH; y++) for (let x = bx; x < bx + BW; x++) set(floor, x, y, BOOTH_FLOOR);
    for (let x = bx + 1; x < bx + BW - 1; x++) set(walls, x, by, TABLE);
    const n = r * COLS + c + 1;
    booths.push({
      id: nextObjectId++, name: `booth-${n}`, type: 'booth',
      x: bx * T, y: by * T, width: BW * T, height: BH * T,
      rotation: 0, visible: true,
      properties: [{ name: 'title', type: 'string', value: `Project ${n}` }],
    });
  }
}

const spawn = {
  id: nextObjectId++, name: 'spawn', type: 'spawn', point: true,
  x: (W / 2) * T, y: (H - 3) * T, width: 0, height: 0, rotation: 0, visible: true,
};

const tileLayer = (id, name, data) => ({
  id, name, type: 'tilelayer', data, width: W, height: H,
  opacity: 1, visible: true, x: 0, y: 0,
});

const map = {
  type: 'map', version: '1.10', tiledversion: '1.11.0',
  orientation: 'orthogonal', renderorder: 'right-down', infinite: false,
  width: W, height: H, tilewidth: T, tileheight: T, compressionlevel: -1,
  nextlayerid: 5, nextobjectid: nextObjectId,
  layers: [
    tileLayer(1, 'floor', floor),
    tileLayer(2, 'walls', walls),
    { id: 3, name: 'booths', type: 'objectgroup', draworder: 'topdown', objects: booths, opacity: 1, visible: true, x: 0, y: 0 },
    { id: 4, name: 'spawns', type: 'objectgroup', draworder: 'topdown', objects: [spawn], opacity: 1, visible: true, x: 0, y: 0 },
  ],
  tilesets: [{
    firstgid: 1, name: 'hall-tiles', image: 'hall-tiles.png',
    imagewidth: T * 4, imageheight: T, tilewidth: T, tileheight: T,
    tilecount: 4, columns: 4, margin: 0, spacing: 0,
    tiles: [WALL, TABLE].map((id) => ({ id, properties: [{ name: 'collides', type: 'bool', value: true }] })),
  }],
};

mkdirSync(OUT, { recursive: true });
writeFileSync(new URL('hall-tiles.png', OUT), tilesetPng);
writeFileSync(new URL('hall.json', OUT), JSON.stringify(map, null, 1));
mkdirSync(new URL('../sprites/', OUT), { recursive: true });
writeFileSync(new URL('../sprites/player.png', OUT), playerPng);
console.log(`hall.json ${W}x${H} tiles · ${booths.length} booths`);
