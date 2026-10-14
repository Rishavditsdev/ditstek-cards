import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components keeps previous routes mounted (React <Activity>), which
  // would carry editor state across visits. The PHP app started fresh every
  // time and this app has no dynamic data to cache, so it stays disabled.
  async redirects() {
    // The PHP site forwarded its root to the card generator (a temporary
    // redirect). The other legacy URLs are handled in src/proxy.ts.
    return [
      { source: "/", destination: "/card-generator", permanent: false },
      { source: "/index.php", destination: "/card-generator", permanent: false },
    ];
  },
};

export default nextConfig;
