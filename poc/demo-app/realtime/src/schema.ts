import { schema, t, type SchemaType } from '@colyseus/schema';

// uint16 = 2 bytes per coordinate (map is 1280x960 px), half of "number"
export const Player = schema({
  name: t.string(),
  x: t.uint16(),
  y: t.uint16(),
  presenterOf: t.string(), // booth name this player presents in, '' = visitor
}, 'Player');
export type Player = SchemaType<typeof Player>;

export const HallState = schema({
  players: t.map(Player),
}, 'HallState');
export type HallState = SchemaType<typeof HallState>;
