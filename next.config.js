// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  async rewrites() {
    return [
      {
        source: "/apple-touch-icon.png",
        destination: "/apple-icon",
      },
      {
        source: "/favicon.ico",
        destination: "/icon",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: false, // Keep Next.js optimization for other images
    domains: [], // Remove domains array if it exists
  },
  // Use userland punycode instead of Node's deprecated built-in
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      punycode: require.resolve("punycode"),
    };
    return config;
  },
};

module.exports = nextConfig;
