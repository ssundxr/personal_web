/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-map-gl"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 390, 412, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
