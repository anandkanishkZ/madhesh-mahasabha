/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to support dynamic routes and authentication
  // Use standard Next.js deployment (Vercel, Node.js server, etc.)
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ]
  },
  trailingSlash: true,
};

export default nextConfig;