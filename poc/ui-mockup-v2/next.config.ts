import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next dev would otherwise write its own AGENTS.md here; the repo root AGENTS.md is the single source
  agentRules: false,
  // the dev badge sits on top of the hall toolbar
  devIndicators: false,
  // Dev only: let other devices on the LAN open the mockup
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
};

export default nextConfig;
