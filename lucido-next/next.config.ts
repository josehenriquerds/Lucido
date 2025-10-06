import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config, { isServer }) => {
    // Otimização do cache do webpack para strings grandes
    config.cache = {
      ...config.cache,
      type: 'filesystem',
      compression: 'gzip',
      // Usa Buffer para serialização de strings grandes
      store: 'pack',
    };

    return config;
  },
};

export default nextConfig;
