// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
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
  // Add this to suppress the warning
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("punycode");
    }
    return config;
  },
};

module.exports = nextConfig;
