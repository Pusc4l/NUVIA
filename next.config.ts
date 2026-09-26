import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  // 1. Opsi 'skipWaiting' disatukan di PWA atau dihapus jika tidak perlu (TypeScript komplain)
});

const nextConfig: NextConfig = {
  // 2. Tambahkan 'as const' agar TypeScript membaca 'export' sebagai literal type, bukan string biasa
  output: "export" as const,
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);