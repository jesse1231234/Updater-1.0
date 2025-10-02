/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // You do NOT call app.setGlobalPrefix('api'), so use this:
      { source: '/api/:path*', destination: 'http://localhost:4000/:path*' },
    ];
  },
  output: 'standalone',
};
module.exports = nextConfig;
