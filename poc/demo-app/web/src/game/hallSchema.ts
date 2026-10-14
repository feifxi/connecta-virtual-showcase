import { schema, t, type SchemaType } from '@colyseus/schema';

// Type-only mirror of realtime/src/schema.ts (the client decodes state by reflection) — keep the two in sync
const Player = schema({ name: t.string(), x: t.uint16(), y: t.uint16(), presenterOf: t.string() }, 'Player');
const HallState = schema({ players: t.map(Player) }, 'HallState');
export type PlayerState = SchemaType<typeof Player>;
export type HallState = SchemaType<typeof HallState>;
