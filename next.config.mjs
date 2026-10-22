/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: false,
  output: 'standalone',
  allowedDevOrigins: ['192.168.56.101'],
};

export default nextConfig;
