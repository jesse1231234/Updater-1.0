// apps/web/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // If you do NOT call app.setGlobalPrefix('api') in Nest:
      { source: '/api/:path*', destination: 'http://localhost:4000/:path*' },

      // If you DO call app.setGlobalPrefix('api'), replace the above with:
      // { source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' },
    ];
  },
  output: 'standalone',
};
module.exports = nextConfig;
