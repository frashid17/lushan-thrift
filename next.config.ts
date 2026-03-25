import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let Node resolve nodemailer at runtime (Turbopack otherwise fails to resolve it in some setups)
  serverExternalPackages: ['nodemailer'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
