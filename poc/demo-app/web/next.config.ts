import type { NextConfig } from 'next';

// agentRules: false — next dev would otherwise write its own AGENTS.md here; the repo root AGENTS.md is the single source
const nextConfig: NextConfig = { agentRules: false };

export default nextConfig;
