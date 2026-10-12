const nextConfig = {
  devIndicators: false,
  async headers() {
    return [{
      source: "/api/:path*",
      headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }]
    }];
  }
};

export default nextConfig;
