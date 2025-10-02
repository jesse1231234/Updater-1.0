/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // proxy browser calls to Nest inside the container
      { source: '/api/:path*', destination: 'http://localhost:4000/:path*' },
    ];
  },
  output: 'standalone',
};
module.exports = nextConfig;
