/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgflip.com",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
