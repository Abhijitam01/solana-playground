/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@solana-playground/types"],
  output: "standalone",
};

module.exports = nextConfig;

