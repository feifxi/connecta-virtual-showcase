import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

// POC: no auth — anyone can join any room with full publish rights.
// Real app: identity comes from the session and grants from the user's role.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room');
  const name = searchParams.get('name')?.trim();
  if (!room || !name) return NextResponse.json({ error: 'room and name are required' }, { status: 400 });

  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return NextResponse.json({ error: 'LIVEKIT_* env not set (copy .env.example to .env.local)' }, { status: 500 });
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `${name}-${crypto.randomUUID().slice(0, 4)}`,
    name,
    ttl: '1h',
  });
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });
  return NextResponse.json({ url: LIVEKIT_URL, token: await at.toJwt() });
}
