// Shared settings for the spike checks · BASE = web dev server · CHROME = local Chrome binary
export const BASE = process.env.BASE ?? 'http://localhost:3000';
export const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const OUT = new URL('./out/', import.meta.url).pathname;
// Pages opened via a LAN IP are not a secure context, so the browser blocks the microphone; this flag treats BASE as secure (test only)
export const INSECURE_AS_SECURE = `--unsafely-treat-insecure-origin-as-secure=${BASE}`;
