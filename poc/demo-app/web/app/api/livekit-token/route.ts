import { AccessToken, TrackSource } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

// POC: no auth — identity and role come from the query string.
// Real app: identity comes from the session and grants from the user's role in the DB.
// role=visitor → microphone only (visitors have no camera/screen) · anything else → all sources (S2 page)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room');
  const name = searchParams.get('name')?.trim();
  const identity = searchParams.get('identity'); // S4: Colyseus sessionId, so positions map to LiveKit participants
  const role = searchParams.get('role');
  if (!room || !name) return NextResponse.json({ error: 'room and name are required' }, { status: 400 });

  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return NextResponse.json({ error: 'LIVEKIT_* env not set (copy .env.example to .env.local)' }, { status: 500 });
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: identity || `${name}-${crypto.randomUUID().slice(0, 4)}`,
    name,
    ttl: '1h',
  });
  at.addGrant({
    roomJoin: true,
    room,
    canSubscribe: true,
    canPublish: true,
    canPublishSources:
      role === 'visitor'
        ? [TrackSource.MICROPHONE]
        : [TrackSource.MICROPHONE, TrackSource.CAMERA, TrackSource.SCREEN_SHARE, TrackSource.SCREEN_SHARE_AUDIO],
  });
  return NextResponse.json({ url: livekitUrlFor(req, LIVEKIT_URL), token: await at.toJwt() });
}

// LIVEKIT_URL=ws://localhost:7880 only works on this machine — for a page opened as http://192.168.x.x:3000,
// hand out the same host so other devices on the LAN can reach LiveKit
function livekitUrlFor(req: Request, configured: string) {
  const url = new URL(configured);
  const pageHost = req.headers.get('host')?.split(':')[0];
  if (pageHost && ['localhost', '127.0.0.1'].includes(url.hostname)) url.hostname = pageHost;
  return url.toString().replace(/\/$/, '');
}
