/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Modify the existing webpack config
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@uniswap/conedison': '@uniswap/conedison/dist',
    };

    return config;
  },
};

module.exports = nextConfig;
