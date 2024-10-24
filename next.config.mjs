/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        hostname: "e-commerce-by-mithu.oneentry.cloud",
      },
    ],
  },
};

export default nextConfig;
