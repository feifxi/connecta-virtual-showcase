import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // next dev would otherwise write its own AGENTS.md here; the repo root AGENTS.md is the single source
  agentRules: false,
  // Dev only: let other devices on the LAN (http://192.168.x.x:3000) load dev assets — Next blocks non-localhost origins by default
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
};

export default nextConfig;
