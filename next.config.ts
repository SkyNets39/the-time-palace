import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heeobtspnjgvyfhhlrxg.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/watch-images/**",
      },
    ],
  },
};

export default nextConfig;
