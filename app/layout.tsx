import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 📌 1. PISAHKAN THEME COLOR KE VIEWPORT EXPORT
export const viewport: Viewport = {
  themeColor: "#0f172a",
};

// 📌 2. METADATA BERSIH TANPA THEMECOLOR
export const metadata: Metadata = {
  title: "AirShield",
  description: "Weather and Air Hazard Tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AirShield",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}