// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Cloudinary-র যেকোনো পাথের ইমেজ অ্যালাউ করার জন্য
      },

      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // নতুন যুক্ত হলো (ডিফল্ট ইমেজের জন্য)
      },

      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },

      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.aljazeera.com',
      },
      {
        protocol: 'https',
        hostname: 'img.olympics.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // আপনার ইউজার অ্যাভাটারের জন্য
      },

    ],

  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
};

export default nextConfig;