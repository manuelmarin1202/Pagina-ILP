import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Reemplazamos 'domains' por 'remotePatterns'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'akutexkthhotpsztnlue.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Permitimos solo la ruta de storage
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
