import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow GitHub avatar images used in the app (e.g. avatars.githubusercontent.com)
    domains: ["avatars.githubusercontent.com"],
  },
};

export default nextConfig;
