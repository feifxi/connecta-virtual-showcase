import { readFileSync } from 'node:fs';

// Same Tiled JSON the client renders, so the server can reject positions inside walls/tables
type TiledLayer = { name: string; type: string; data?: number[]; objects?: { name: string; x: number; y: number }[] };
type TiledMap = {
  width: number; height: number; tilewidth: number; tileheight: number;
  layers: TiledLayer[];
  tilesets: { firstgid: number; tiles?: { id: number; properties?: { name: string; value: unknown }[] }[] }[];
};

const MAP_PATH = new URL('../../web/public/assets/maps/hall.json', import.meta.url);

export function loadHallMap() {
  const map: TiledMap = JSON.parse(readFileSync(MAP_PATH, 'utf8'));
  const solidGids = new Set<number>();
  for (const ts of map.tilesets) {
    for (const tile of ts.tiles ?? []) {
      if (tile.properties?.some((p) => p.name === 'collides' && p.value === true)) solidGids.add(ts.firstgid + tile.id);
    }
  }
  const walls = map.layers.find((l) => l.name === 'walls')?.data;
  if (!walls) throw new Error('layer "walls" not found in hall.json');
  const spawn = map.layers.find((l) => l.name === 'spawns')?.objects?.find((o) => o.name === 'spawn');

  const widthPx = map.width * map.tilewidth;
  const heightPx = map.height * map.tileheight;
  return {
    widthPx,
    heightPx,
    spawn: { x: spawn?.x ?? 100, y: spawn?.y ?? 100 },
    // Checks the player's center point only — enough to stop teleporting through walls
    isWalkable(x: number, y: number) {
      if (x < 0 || y < 0 || x >= widthPx || y >= heightPx) return false;
      const tx = Math.floor(x / map.tilewidth);
      const ty = Math.floor(y / map.tileheight);
      return !solidGids.has(walls[ty * map.width + tx]);
    },
  };
}
