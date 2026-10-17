// Chibi student characters: 32x48 frames, 4 directions x 4 walk frames.
// Frame order per row: down 0-3 · left 4-7 · right 8-11 · up 12-15
import { Img, hex, shade } from './pixel.mjs';

export const FW = 32;
export const FH = 48;
const OUTLINE = hex('#3b2f4f');
const EYE = hex('#2b2340');
const WHITE = hex('#ffffff');
const BLUSH = hex('#ff8fa3', 150);
const SHOE = hex('#3a3346');

export const SKIN = ['#ffe0c7', '#f6cfae', '#e9b48f', '#c98d68'].map((s) => hex(s));
export const HAIR = ['#2e2738', '#4a3328', '#6b4430', '#a5683f', '#d8a25b', '#5b5f7a', '#8b5a9e'].map((s) => hex(s));

// top: uniform | staff | judge | hoodie | tee ; bottom: pants | skirt
function drawBody(img, s, dir, f) {
  const step = f === 1 ? 1 : f === 3 ? -1 : 0; // walk phase
  const bob = f === 1 || f === 3 ? 1 : 0; // body dips on the step frames
  const top = {
    uniform: hex('#f6f7fc'),
    staff: hex('#4655e8'),
    judge: hex('#2f3a63'),
    hoodie: s.topColor,
    tee: s.topColor,
  }[s.top];
  const topShade = shade(top, s.top === 'uniform' ? 0.88 : 0.82);
  const bottom = s.bottomColor;
  const front = dir === 'down';
  const back = dir === 'up';
  const side = !front && !back;

  // legs + shoes (y 38-46)
  if (s.bottom === 'skirt') {
    if (side) {
      img.rect(13, 41 + bob, 3, 4 - Math.max(0, step), s.skin);
      img.rect(17, 41 + bob, 3, 4 - Math.max(0, -step), s.skin);
      img.rect(12 - step, 44 + bob, 4, 2, SHOE);
      img.rect(17 + step, 44 + bob, 4, 2, SHOE);
    } else {
      img.rect(12, 41 + bob, 3, 4 - (step > 0 ? 1 : 0), s.skin);
      img.rect(17, 41 + bob, 3, 4 - (step < 0 ? 1 : 0), s.skin);
      img.rect(11, 44 + bob - (step > 0 ? 1 : 0), 5, 2, SHOE);
      img.rect(16, 44 + bob - (step < 0 ? 1 : 0), 5, 2, SHOE);
    }
    // skirt: slightly flared
    img.rect(10, 36 + bob, 12, 3, bottom);
    img.rect(9, 39 + bob, 14, 2, bottom);
    img.hline(10, 21, 40 + bob, shade(bottom, 0.8));
  } else if (side) {
    img.rect(13 - step, 38 + bob, 4, 6, bottom);
    img.rect(16 + step, 38 + bob, 4, 6, shade(bottom, 0.85));
    img.rect(12 - step * 2, 44 + bob, 5, 2, SHOE);
    img.rect(16 + step * 2, 44 + bob, 5, 2, SHOE);
  } else {
    img.rect(11, 37 + bob, 10, 2, bottom);
    img.rect(11, 39 + bob, 4, 5 - (step > 0 ? 1 : 0), bottom);
    img.rect(17, 39 + bob, 4, 5 - (step < 0 ? 1 : 0), bottom);
    img.rect(11, 44 + bob - (step > 0 ? 1 : 0), 4, 2, SHOE);
    img.rect(17, 44 + bob - (step < 0 ? 1 : 0), 4, 2, SHOE);
  }

  // torso (y 26-37)
  const tx = side ? 11 : 10;
  const tw = side ? 10 : 12;
  img.rrect(tx, 26 + bob, tw, 12, 3, top);
  img.rect(tx, 33 + bob, tw, 4, top);
  img.vline(tx, 28 + bob, 36 + bob, topShade);
  img.vline(tx + tw - 1, 28 + bob, 36 + bob, topShade);
  if (s.bottom === 'pants' && s.top === 'uniform') img.hline(tx, tx + tw - 1, 36 + bob, hex('#2d2a3a')); // belt

  if (front) {
    if (s.top === 'uniform') {
      img.px(14, 27 + bob, topShade); img.px(17, 27 + bob, topShade); // collar
      if (s.tie) { img.rect(15, 28 + bob, 2, 6, hex('#2f3a63')); img.rect(15, 28 + bob, 2, 1, hex('#475796')); }
      else { img.rect(15, 28 + bob, 2, 2, hex('#e6b34a')); } // pin
    }
    if (s.top === 'judge') {
      img.rect(14, 27 + bob, 4, 6, hex('#f6f7fc'));
      img.rect(15, 28 + bob, 2, 5, hex('#c0394b'));
      img.px(13, 28 + bob, shade(top, 1.3)); img.px(18, 28 + bob, shade(top, 1.3)); // lapels
    }
    if (s.top === 'hoodie') {
      img.rect(12, 26 + bob, 8, 2, shade(top, 0.85));
      img.vline(14, 28 + bob, 31 + bob, WHITE); img.vline(17, 28 + bob, 31 + bob, WHITE); // strings
      img.rect(12, 33 + bob, 8, 3, shade(top, 0.9)); // pocket
    }
    if (s.top === 'staff') img.rect(18, 29 + bob, 2, 2, WHITE); // logo dot
    if (s.lanyard) {
      img.px(13, 28 + bob, s.lanyard); img.px(14, 29 + bob, s.lanyard);
      img.px(18, 28 + bob, s.lanyard); img.px(17, 29 + bob, s.lanyard);
      img.rect(14, 30 + bob, 4, 5, WHITE);
      img.rect(14, 30 + bob, 4, 2, s.lanyard);
    }
  }
  if (back && s.top === 'hoodie') img.rrect(11, 25 + bob, 10, 4, 2, shade(top, 0.85));
  if (back && s.top === 'staff') img.rect(13, 29 + bob, 6, 2, WHITE); // "STAFF" print

  // arms: sleeves + hands, swinging opposite to legs
  const sleeve = s.top === 'tee' || s.top === 'staff' ? 4 : s.top === 'uniform' ? 4 : 7;
  if (side) {
    const ax = 14 + step;
    img.rect(ax, 28 + bob, 4, 6, shade(top, 0.86));
    img.rect(ax, 34 + bob, 4, 2, s.skin);
  } else {
    const la = step, ra = -step;
    img.rect(7, 28 + bob + la, 3, sleeve, topShade);
    img.rect(7, 28 + bob + la + sleeve, 3, 8 - sleeve, s.skin);
    img.rect(22, 28 + bob + ra, 3, sleeve, topShade);
    img.rect(22, 28 + bob + ra + sleeve, 3, 8 - sleeve, s.skin);
  }
  return bob;
}

function drawHead(img, s, dir, bob) {
  const cy = 15 + bob;
  const H = s.hair;
  const HL = shade(H, 1.35);
  const HD = shade(H, 0.8);
  const front = dir === 'down';
  const back = dir === 'up';
  const long = s.hairStyle === 'long';
  const bob2 = s.hairStyle === 'bob';


  // face
  img.ellipse(16, cy, 11, 10.5, s.skin);
  if (!back) {
    img.px(5, cy + 1, shade(s.skin, 0.9)); img.px(26, cy + 1, shade(s.skin, 0.9));
  }

  // hair cap
  const capBottom = back ? cy + 9 : cy - 2;
  img.ellipse(16, cy - 1, 11.5, 10.5, H, (x, y) => y <= capBottom);
  if (back) {
    img.ellipse(16, cy, 11, 10.5, H);
  } else if (front) {
    // fringe: jagged bangs across the forehead
    const fringe = s.hairStyle === 'spiky' ? [0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0] : [2, 2, 1, 1, 0, 1, 1, 2, 3, 2, 2];
    for (let i = 0; i < fringe.length; i++) {
      const x = 6 + i * 2;
      img.rect(x, cy - 2, 2, 1 + fringe[i], H);
    }
    // sideburns / side locks
    const sideLen = long ? 14 : bob2 ? 10 : 6;
    img.rect(5, cy - 3, 3, sideLen, H);
    img.rect(24, cy - 3, 3, sideLen, H);
  } else {
    // side view (facing left): hair covers back half
    img.ellipse(18, cy, 9.5, 10.5, H, (x, y) => x >= 19 || y <= cy - 3);
    img.rect(6, cy - 2, 6, 2, H);
    const sideLen = long ? 16 : bob2 ? 11 : 6;
    img.rect(19, cy - 3, 8, sideLen, H);
    img.rect(16, cy + 1, 3, 3, s.skin); // ear
    img.px(17, cy + 2, shade(s.skin, 0.85));
  }

  // style extras
  if (s.hairStyle === 'spiky') {
    for (const [x, h] of [[8, 3], [12, 4], [16, 5], [20, 4], [24, 3]]) img.rect(x, cy - 10 - h + 2, 2, h, H);
  }
  if (s.hairStyle === 'buns') {
    img.ellipse(7, cy - 9, 4, 4, H);
    img.ellipse(25, cy - 9, 4, 4, H);
    img.px(6, cy - 11, HL); img.px(24, cy - 11, HL);
  }
  if (s.hairStyle === 'pony') {
    if (back) img.rrect(13, cy + 6, 6, 12, 3, H);
    else if (!front) img.rrect(24, cy + 1, 6, 11, 3, H);
    else { img.rect(4, cy + 2, 2, 5, H); }
    img.rect(14, cy - 10, 4, 1, s.accent ?? hex('#ff8fa3'));
  }
  if (long && back) img.rrect(6, cy + 2, 20, 18, 6, H);
  if (bob2 && back) img.rrect(5, cy + 1, 22, 10, 6, H);

  // shine
  if (!back) { img.hline(10, 13, cy - 8, HL); img.px(9, cy - 7, HL); }
  else { img.hline(12, 16, cy - 7, HL); }

  // face details
  if (front) {
    for (const ex of [11, 19]) {
      img.rect(ex, cy + 1, 2, 3, EYE);
      img.px(ex, cy + 1, WHITE);
    }
    if (s.glasses) {
      const G = hex('#3b2f4f');
      for (const ex of [9, 17]) {
        img.hline(ex, ex + 5, cy, G); img.hline(ex, ex + 5, cy + 4, G);
        img.vline(ex, cy, cy + 4, G); img.vline(ex + 5, cy, cy + 4, G);
      }
      img.hline(15, 16, cy + 1, G);
    }
    img.rect(8, cy + 5, 2, 1, BLUSH); img.rect(22, cy + 5, 2, 1, BLUSH);
    img.hline(15, 16, cy + 6, hex('#b9506a'));
  } else if (!back) {
    img.rect(8, cy + 1, 2, 3, EYE);
    img.px(8, cy + 1, WHITE);
    if (s.glasses) {
      const G = hex('#3b2f4f');
      img.hline(6, 11, cy, G); img.hline(6, 11, cy + 4, G); img.vline(11, cy, cy + 4, G); img.hline(12, 16, cy + 1, G);
    }
    img.rect(6, cy + 5, 2, 1, BLUSH);
    img.px(7, cy + 6, hex('#b9506a'));
  }
}

// hair that hangs behind the shoulders: drawn before the body for front/side views
function drawBackHair(img, s, dir, f) {
  if (dir === 'up') return;
  const bob = f === 1 || f === 3 ? 1 : 0;
  const cy = 15 + bob;
  const HD = shade(s.hair, 0.8);
  if (s.hairStyle === 'long') {
    if (dir === 'down') img.rrect(5, cy - 2, 22, 20, 6, HD);
    else img.rrect(14, cy - 2, 13, 21, 5, HD);
  }
  if (s.hairStyle === 'bob') img.rrect(5, cy - 3, 22, 15, 6, HD);
}

export function drawFrame(s, dir, f) {
  const img = new Img(FW, FH);
  drawBackHair(img, s, dir, f);
  const bob = drawBody(img, s, dir, f);
  drawHead(img, s, dir, bob);
  return img.outline(OUTLINE);
}

export function spriteSheet(specs) {
  const sheet = new Img(FW * 16, FH * specs.length);
  specs.forEach((s, row) => {
    ['down', 'left', 'up'].forEach((dir) => {
      for (let f = 0; f < 4; f++) {
        const fr = drawFrame(s, dir, f);
        const col = dir === 'down' ? f : dir === 'left' ? 4 + f : 12 + f;
        sheet.blit(fr, col * FW, row * FH);
        if (dir === 'left') sheet.blit(fr, (8 + f) * FW, row * FH, true); // right = mirrored left
      }
    });
  });
  return sheet;
}
