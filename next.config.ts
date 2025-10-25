import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer remotePatterns to explicitly whitelist remote image sources and
    // paths. This is safer than a broad domains list because it lets us
    // restrict protocol/hostname/path patterns and avoid accidental host
    // wildcards that could be abused.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
