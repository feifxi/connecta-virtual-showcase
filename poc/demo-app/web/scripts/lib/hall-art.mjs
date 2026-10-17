// Tileset (32px) + props for the showcase hall. Soft pastel, outlined, top-down 3/4 view.
import { Img, hex, shade, mix, rng } from './pixel.mjs';

export const T = 32;
const OUT = hex('#4a3f5c');

export const ZONES = {
  mint: { floor: hex('#cdeedd'), accent: hex('#3fae7f'), ink: hex('#1f6b4c') },
  lilac: { floor: hex('#e4dbfa'), accent: hex('#8a6ee0'), ink: hex('#4e3a99') },
  peach: { floor: hex('#ffe0d1'), accent: hex('#f08a5d'), ink: hex('#9a4523') },
  sky: { floor: hex('#d6e9fb'), accent: hex('#4b95e0'), ink: hex('#1f5a96') },
  neutral: { floor: hex('#e6e7ef'), accent: hex('#7d84a6'), ink: hex('#3d4466') }, // booths of an event without categories
};

// ---------- tiles ----------
// id -> painter(img, ox, oy)
const wood = (seed) => (img, ox, oy) => {
  const r = rng(seed);
  const base = hex('#f1dcc0');
  img.rect(ox, oy, T, T, base);
  for (let row = 0; row < 4; row++) {
    const y = oy + row * 8;
    const tone = shade(base, 0.97 + r() * 0.05);
    img.rect(ox, y, T, 8, tone);
    img.hline(ox, ox + T - 1, y + 7, shade(base, 0.9));
    const seam = ((row * 13 + seed * 7) % 24) + 4;
    img.vline(ox + seam, y, y + 6, shade(base, 0.9));
    img.px(ox + ((seam + 9) % 30), y + 3, shade(base, 0.94));
  }
};
const carpet = (zone) => (img, ox, oy) => {
  const c = ZONES[zone].floor;
  img.rect(ox, oy, T, T, c);
  for (let y = 0; y < T; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < T; x += 4) img.px(ox + x, oy + y, shade(c, 0.96));
};
const stone = (img, ox, oy) => {
  const c = hex('#ecebf3');
  img.rect(ox, oy, T, T, c);
  img.hline(ox, ox + T - 1, oy + T - 1, shade(c, 0.93));
  img.vline(ox + T - 1, oy, oy + T - 1, shade(c, 0.93));
  img.px(ox + 6, oy + 9, shade(c, 0.96)); img.px(ox + 21, oy + 20, shade(c, 0.96));
};
const stageFloor = (img, ox, oy) => {
  const c = hex('#7b5a8f');
  img.rect(ox, oy, T, T, c);
  for (let row = 0; row < 4; row++) {
    img.hline(ox, ox + T - 1, oy + row * 8 + 7, shade(c, 0.88));
    img.vline(ox + ((row * 11) % 28) + 2, oy + row * 8, oy + row * 8 + 6, shade(c, 0.88));
  }
};
const stageEdge = (img, ox, oy) => {
  stageFloor(img, ox, oy);
  img.rect(ox, oy + 20, T, 12, hex('#5a3f6b'));
  img.hline(ox, ox + T - 1, oy + 20, hex('#a184b3'));
  for (let x = 3; x < T; x += 8) img.rect(ox + x, oy + 25, 3, 2, hex('#ffd36e'));
};
const wallTop = (img, ox, oy) => {
  img.rect(ox, oy, T, T, hex('#8f86a6'));
  img.rect(ox + 1, oy + 1, T - 2, T - 2, hex('#a59dbb'));
};
const wallFace = (lower, window) => (img, ox, oy) => {
  const c = hex('#fbf3e6');
  img.rect(ox, oy, T, T, c);
  img.vline(ox + T - 1, oy, oy + T - 1, shade(c, 0.97));
  if (window) {
    const glass = hex('#bfe3f7');
    if (!lower) {
      img.rect(ox + 3, oy + 8, 26, 24, hex('#e7dccb'));
      img.rect(ox + 5, oy + 10, 22, 22, glass);
      img.rect(ox + 7, oy + 12, 4, 10, hex('#e5f5fd'));
      img.vline(ox + 16, oy + 10, oy + 31, hex('#e7dccb'));
    } else {
      img.rect(ox + 3, oy, 26, 18, hex('#e7dccb'));
      img.rect(ox + 5, oy, 22, 14, glass);
      img.vline(ox + 16, oy, oy + 13, hex('#e7dccb'));
      img.rect(ox + 2, oy + 16, 28, 3, hex('#d9cbb4'));
    }
  }
  if (lower) {
    img.rect(ox, oy + 24, T, 8, hex('#d9c6ad'));
    img.hline(ox, ox + T - 1, oy + 24, hex('#c4ae92'));
  }
};
const mat = (img, ox, oy) => {
  img.rect(ox, oy, T, T, hex('#6b6f8f'));
  for (let y = 2; y < T; y += 4) img.hline(ox + 1, ox + T - 2, oy + y, hex('#5c607e'));
};
const rug = (img, ox, oy) => {
  const c = hex('#ffd9c7');
  img.rect(ox, oy, T, T, c);
  for (let y = 0; y < T; y += 8) for (let x = 0; x < T; x += 8) {
    img.px(ox + x + 3, oy + y + 3, hex('#f7b9a0')); img.px(ox + x + 4, oy + y + 4, hex('#f7b9a0'));
  }
};

export const TILE = {
  WOOD: 0, WOOD2: 1, STONE: 2, MINT: 3, LILAC: 4, PEACH: 5, SKY: 6, STAGE: 7,
  STAGE_EDGE: 8, WALL_TOP: 9, FACE_UP: 10, FACE_LOW: 11, WIN_UP: 12, WIN_LOW: 13, MAT: 14, RUG: 15, NEUTRAL: 16,
};
const PAINTERS = [
  wood(1), wood(2), stone, carpet('mint'), carpet('lilac'), carpet('peach'), carpet('sky'), stageFloor,
  stageEdge, wallTop, wallFace(false, false), wallFace(true, false), wallFace(false, true), wallFace(true, true), mat, rug, carpet('neutral'),
];
export const COLLIDES = [TILE.WALL_TOP, TILE.FACE_UP, TILE.FACE_LOW, TILE.WIN_UP, TILE.WIN_LOW];

export function tileset() {
  const cols = 8;
  const img = new Img(cols * T, Math.ceil(PAINTERS.length / cols) * T);
  PAINTERS.forEach((p, i) => p(img, (i % cols) * T, Math.floor(i / cols) * T));
  return { img, cols, count: PAINTERS.length };
}

// ---------- props ----------
// Each prop: image + collision box (relative to image top-left) + anchor at bottom centre.
const outlined = (img) => img.outline(OUT);

function plant(big) {
  const img = new Img(32, big ? 52 : 36);
  const h = img.h;
  const pot = hex('#f3efe8');
  img.rrect(9, h - 14, 14, 12, 3, pot);
  img.rect(9, h - 14, 14, 3, shade(pot, 0.9));
  img.hline(10, 21, h - 4, shade(pot, 0.88));
  const L = [hex('#5cbf8a'), hex('#46a774'), hex('#7fd6a6')];
  const leaves = big
    ? [[16, 14, 9, 7], [8, 22, 7, 6], [24, 22, 7, 6], [12, 30, 7, 5], [21, 31, 7, 5], [16, 24, 6, 6], [16, 7, 5, 5]]
    : [[16, 10, 7, 6], [9, 15, 6, 5], [23, 15, 6, 5], [16, 17, 5, 5]];
  leaves.forEach(([x, y, rx, ry], i) => img.ellipse(x, y, rx, ry, L[i % 3]));
  img.vline(16, big ? 30 : 18, h - 14, hex('#3e8f63'));
  return { img: outlined(img), box: [9, h - 10, 14, 8] };
}

function boothBackdrop(zone, variant) {
  const Z = ZONES[zone];
  const img = new Img(104, 82);
  const frame = hex('#ffffff');
  // stand legs
  img.rect(10, 70, 4, 10, hex('#b9b4c9')); img.rect(90, 70, 4, 10, hex('#b9b4c9'));
  // panel
  img.rrect(2, 2, 100, 70, 4, frame);
  img.rect(2, 2, 100, 12, Z.accent);
  img.rect(2, 12, 100, 2, shade(Z.accent, 0.85));
  img.rrect(2, 2, 100, 6, 3, shade(Z.accent, 1.1));
  // poster on the panel
  const r = rng(variant * 31 + zone.length);
  const px = 30, py = 18;
  img.rect(px, py, 44, 50, hex('#fdfcff'));
  img.rect(px, py, 44, 7, Z.floor);
  img.hline(px + 3, px + 30, py + 3, Z.ink);
  img.hline(px + 3, px + 20, py + 5, shade(Z.ink, 1.4));
  // figure + chart + text lines
  img.rect(px + 3, py + 10, 18, 14, Z.floor);
  img.ellipse(px + 12, py + 17, 5, 5, Z.accent);
  for (let i = 0; i < 4; i++) img.rect(px + 25 + i * 4, py + 22 - Math.floor(r() * 10) - 2, 3, Math.floor(r() * 10) + 2, i % 2 ? Z.accent : shade(Z.accent, 1.3));
  for (let i = 0; i < 6; i++) img.hline(px + 3, px + 3 + 20 + Math.floor(r() * 18), py + 28 + i * 3, hex('#c9c6d6'));
  img.rect(px + 30, py + 40, 11, 8, hex('#eeeaf6'));
  // side panels: a screen (left) and info sheet (right)
  img.rect(6, 20, 20, 14, hex('#3a3550'));
  img.rect(7, 21, 18, 12, variant % 2 ? hex('#8fd1ff') : hex('#b9f0d3'));
  img.rect(9, 23, 8, 2, hex('#ffffff', 200));
  img.rect(80, 22, 16, 20, hex('#fff6dc'));
  for (let i = 0; i < 4; i++) img.hline(82, 93, 26 + i * 4, hex('#e2cf9a'));
  img.rect(80, 48, 16, 16, Z.floor);
  img.ellipse(88, 56, 4, 4, Z.accent);
  return { img: outlined(img), box: [8, 70, 88, 10] };
}

function boothTable(zone, kind) {
  const Z = ZONES[zone];
  const img = new Img(80, 44);
  const top = hex('#fffdf8');
  img.rect(2, 16, 76, 8, top); // table top (seen from above)
  img.rect(2, 24, 76, 16, Z.accent); // table cloth front
  img.rect(2, 24, 76, 2, shade(Z.accent, 0.85));
  img.rect(30, 28, 20, 8, shade(Z.accent, 1.15)); // logo patch
  img.ellipse(40, 32, 3, 3, hex('#ffffff', 220));
  if (kind === 0) {
    // laptop
    img.rect(26, 4, 28, 14, hex('#4a4560'));
    img.rect(28, 6, 24, 10, hex('#9fd8ff'));
    img.rect(30, 8, 10, 2, hex('#ffffff', 200));
    img.rect(24, 17, 32, 4, hex('#bdb8cc'));
  } else if (kind === 1) {
    // monitor + keyboard
    img.rect(20, 0, 30, 18, hex('#3d3852'));
    img.rect(22, 2, 26, 14, hex('#c2f0d8'));
    img.rect(24, 4, 14, 3, hex('#ffffff', 200));
    img.rect(33, 18, 4, 2, hex('#3d3852'));
    img.rect(52, 18, 16, 4, hex('#d9d5e4'));
  } else {
    // robot kit / hardware
    img.rrect(26, 4, 20, 14, 3, hex('#ffd36e'));
    img.rect(30, 8, 4, 4, hex('#3d3852')); img.rect(38, 8, 4, 4, hex('#3d3852'));
    img.vline(36, 0, 4, hex('#3d3852')); img.px(36, 0, hex('#f05d5d'));
    img.rect(52, 12, 14, 8, hex('#3fae7f'));
    for (let i = 0; i < 4; i++) img.px(54 + i * 3, 14, hex('#ffd36e'));
  }
  // flyer stack + name card
  img.rect(8, 16, 10, 6, hex('#ffffff')); img.rect(9, 17, 8, 1, Z.accent);
  img.rect(62, 14, 10, 6, hex('#fff1c7'));
  return { img: outlined(img), box: [2, 16, 76, 24] };
}

function sofa() {
  const img = new Img(96, 44);
  const c = hex('#ffb8a1');
  img.rrect(2, 2, 92, 22, 6, shade(c, 0.92)); // back
  img.rrect(2, 16, 92, 24, 6, c); // seat
  img.rrect(2, 10, 12, 30, 5, shade(c, 0.9));
  img.rrect(82, 10, 12, 30, 5, shade(c, 0.9));
  img.vline(48, 18, 36, shade(c, 0.88));
  img.rrect(18, 8, 14, 12, 3, hex('#fff1c7')); // cushion
  return { img: outlined(img), box: [2, 14, 92, 26] };
}

function armchair(color) {
  const img = new Img(40, 40);
  const c = hex(color);
  img.rrect(2, 2, 36, 18, 6, shade(c, 0.92));
  img.rrect(2, 14, 36, 22, 6, c);
  img.rrect(2, 10, 8, 26, 4, shade(c, 0.88));
  img.rrect(30, 10, 8, 26, 4, shade(c, 0.88));
  return { img: outlined(img), box: [2, 14, 36, 22] };
}

function coffeeTable() {
  const img = new Img(52, 30);
  img.ellipse(26, 12, 24, 10, hex('#f6e6cf'));
  img.ellipse(26, 11, 22, 8, hex('#fff6e8'));
  img.rect(24, 20, 4, 8, hex('#c9b291'));
  img.rrect(14, 6, 8, 6, 2, hex('#ffffff')); img.rect(16, 7, 4, 2, hex('#8b5e3c')); // cup
  img.rect(30, 8, 10, 6, hex('#bfe3f7'));
  return { img: outlined(img), box: [4, 6, 44, 18] };
}

function beanbag(color) {
  const img = new Img(34, 28);
  const c = hex(color);
  img.ellipse(17, 16, 15, 11, c);
  img.ellipse(17, 12, 10, 7, shade(c, 1.08));
  img.px(12, 9, hex('#ffffff', 160));
  return { img: outlined(img), box: [4, 10, 26, 14] };
}

function screen() {
  const img = new Img(200, 120);
  img.rect(98, 96, 4, 22, hex('#8f86a6'));
  img.rect(70, 114, 60, 4, hex('#8f86a6'));
  img.rrect(2, 2, 196, 96, 4, hex('#3a3550'));
  img.rect(8, 8, 184, 84, hex('#4655e8'));
  img.rect(8, 8, 184, 84, hex('#4655e8'));
  // slide content
  img.rect(20, 22, 90, 8, hex('#ffffff'));
  img.rect(20, 36, 60, 4, hex('#c9cef8'));
  img.rect(20, 46, 70, 4, hex('#c9cef8'));
  img.rect(20, 56, 50, 4, hex('#c9cef8'));
  img.rrect(126, 20, 54, 54, 6, hex('#ffd36e'));
  img.ellipse(153, 47, 16, 16, hex('#ff8fa3'));
  img.ellipse(153, 47, 8, 8, hex('#ffffff'));
  img.rect(20, 74, 40, 8, hex('#9ee0c2'));
  return { img: outlined(img), box: [60, 110, 80, 8] };
}

function podium() {
  const img = new Img(32, 48);
  img.rect(4, 8, 24, 38, hex('#ffffff'));
  img.rect(2, 4, 28, 6, hex('#e9e6f2'));
  img.rect(4, 18, 24, 12, hex('#4655e8'));
  img.ellipse(16, 24, 4, 4, hex('#ffffff'));
  img.vline(20, 0, 4, hex('#3a3550')); img.ellipse(20, 0.5, 2, 1.5, hex('#3a3550'));
  return { img: outlined(img), box: [2, 34, 28, 12] };
}

function speaker() {
  const img = new Img(22, 46);
  img.rect(2, 2, 18, 42, hex('#3a3550'));
  img.ellipse(11, 12, 6, 6, hex('#5a5373')); img.ellipse(11, 12, 2, 2, hex('#8f86a6'));
  img.ellipse(11, 30, 7, 7, hex('#5a5373')); img.ellipse(11, 30, 3, 3, hex('#8f86a6'));
  return { img: outlined(img), box: [2, 34, 18, 10] };
}

function chair() {
  // audience chair seen from behind (people face the stage)
  const img = new Img(24, 30);
  img.rrect(2, 2, 20, 14, 4, hex('#7c87f0'));
  img.rect(4, 14, 16, 8, hex('#a5adf5'));
  img.rect(4, 22, 2, 6, hex('#8f86a6')); img.rect(18, 22, 2, 6, hex('#8f86a6'));
  return { img: outlined(img), box: [2, 16, 20, 10] };
}

function desk(color, label) {
  const img = new Img(150, 46);
  const c = hex(color);
  img.rect(2, 14, 146, 8, hex('#fffdf8'));
  img.rect(2, 22, 146, 20, c);
  img.rect(2, 22, 146, 2, shade(c, 0.85));
  for (const x of [20, 70, 120]) {
    img.rect(x, 4, 20, 11, hex('#4a4560'));
    img.rect(x + 2, 6, 16, 7, hex('#9fd8ff'));
    img.rect(x - 2, 14, 24, 3, hex('#bdb8cc'));
  }
  img.rect(50, 14, 10, 6, hex('#ffffff')); img.rect(100, 14, 10, 6, hex('#fff1c7'));
  if (label) img.rect(55, 27, 40, 10, hex('#ffffff', 230));
  return { img: outlined(img), box: [2, 14, 146, 28] };
}

function rollup(color) {
  const img = new Img(32, 84);
  const c = hex(color);
  img.rect(4, 78, 24, 5, hex('#b9b4c9'));
  img.rect(5, 2, 22, 76, c);
  img.rect(5, 2, 22, 4, shade(c, 0.85));
  img.ellipse(16, 22, 7, 7, hex('#ffffff'));
  img.ellipse(16, 22, 3, 3, c);
  for (let i = 0; i < 4; i++) img.hline(9, 22 - (i % 2) * 4, 36 + i * 5, hex('#ffffff', 220));
  img.rect(9, 62, 14, 8, hex('#ffd36e'));
  return { img: outlined(img), box: [4, 76, 24, 7] };
}

function counter() {
  const img = new Img(128, 48);
  img.rect(2, 14, 124, 8, hex('#fff6e8'));
  img.rect(2, 22, 124, 22, hex('#c99b72'));
  for (let x = 8; x < 124; x += 16) img.vline(x, 24, 42, hex('#b88a62'));
  img.rect(10, 0, 18, 16, hex('#3a3550')); img.rect(13, 3, 12, 6, hex('#8f86a6')); img.rect(16, 10, 6, 4, hex('#ffffff'));
  for (let i = 0; i < 5; i++) { img.rrect(40 + i * 10, 10, 7, 7, 2, hex('#ffffff')); img.rect(41 + i * 10, 11, 5, 2, hex('#8b5e3c')); }
  img.ellipse(104, 14, 10, 5, hex('#ffe3a8')); img.ellipse(100, 12, 3, 2, hex('#e6a157')); img.ellipse(108, 13, 3, 2, hex('#e6a157'));
  return { img: outlined(img), box: [2, 14, 124, 30] };
}

function board() {
  const img = new Img(72, 70);
  img.rect(10, 58, 4, 10, hex('#b9b4c9')); img.rect(58, 58, 4, 10, hex('#b9b4c9'));
  img.rrect(2, 2, 68, 58, 4, hex('#ffffff'));
  img.rect(2, 2, 68, 10, hex('#4655e8'));
  const Z = Object.values(ZONES);
  [[8, 18], [38, 18], [8, 38], [38, 38]].forEach(([x, y], i) => img.rect(x, y, 26, 16, Z[i].floor));
  img.ellipse(20, 26, 3, 3, hex('#f05d5d'));
  return { img: outlined(img), box: [8, 58, 56, 10] };
}

function voteBox() {
  const img = new Img(36, 44);
  img.rect(4, 16, 28, 26, hex('#fffdf8'));
  img.rect(4, 10, 28, 8, hex('#ffd36e'));
  img.rect(10, 12, 16, 3, hex('#7a5a1a'));
  img.rect(10, 24, 16, 10, hex('#ff8fa3'));
  img.ellipse(18, 29, 3, 3, hex('#ffffff'));
  img.rrect(20, 2, 8, 10, 1, hex('#ffffff')); // ballot going in
  return { img: outlined(img), box: [4, 30, 28, 12] };
}

function water() {
  const img = new Img(22, 46);
  img.rrect(5, 0, 12, 14, 4, hex('#bfe3f7'));
  img.rect(3, 14, 16, 30, hex('#ffffff'));
  img.rect(6, 20, 10, 4, hex('#8fd1ff'));
  return { img: outlined(img), box: [3, 34, 16, 10] };
}

function bin() {
  const img = new Img(20, 24);
  img.rect(3, 6, 14, 16, hex('#9ee0c2'));
  img.rect(2, 3, 16, 4, hex('#7cc9a6'));
  return { img: outlined(img), box: [3, 14, 14, 8] };
}

function shadow() {
  const img = new Img(22, 8);
  img.ellipse(11, 4, 10, 3.5, hex('#3b2f4f', 60));
  return { img, box: null };
}

export function props() {
  const p = {
    plant: plant(true),
    plant_s: plant(false),
    sofa: sofa(),
    armchair_mint: armchair('#9ee0c2'),
    armchair_lilac: armchair('#c7b6f5'),
    coffee_table: coffeeTable(),
    beanbag_sky: beanbag('#a8d1fa'),
    beanbag_butter: beanbag('#ffe08a'),
    screen: screen(),
    podium: podium(),
    speaker: speaker(),
    chair: chair(),
    reg_desk: desk('#4655e8', true),
    judge_desk: desk('#f2c94c', false),
    work_desk: desk('#9ee0c2', false),
    rollup_blue: rollup('#4655e8'),
    rollup_pink: rollup('#f08a9e'),
    counter: counter(),
    board: board(),
    vote_box: voteBox(),
    water: water(),
    bin: bin(),
    shadow: shadow(),
  };
  for (const zone of Object.keys(ZONES)) {
    for (let v = 0; v < 2; v++) p[`backdrop_${zone}_${v}`] = boothBackdrop(zone, v);
    for (let k = 0; k < 3; k++) p[`table_${zone}_${k}`] = boothTable(zone, k);
  }
  return p;
}
