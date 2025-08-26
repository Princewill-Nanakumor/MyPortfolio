// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
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
