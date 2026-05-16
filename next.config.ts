import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: new Date().getTime().toString(),
  },
};

export default nextConfig;