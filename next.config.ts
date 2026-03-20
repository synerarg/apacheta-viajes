import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
<<<<<<< HEAD
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días de cache
  },
};
=======
        hostname: "lnsljictakzrerskzgym.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
}
>>>>>>> e6393b6262c225370970ab7409ffe1a0e44530d4

export default nextConfig
