/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use unoptimized images so remote URLs don't need explicit domain whitelist.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
