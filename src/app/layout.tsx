import type { Metadata, Viewport } from "next";
import "./globals.css";
// Leaflet CSS
import "leaflet/dist/leaflet.css";

export const viewport: Viewport = {
  themeColor: "#eab308",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming on inputs on iOS/Android
};

export const metadata: Metadata = {
  title: "SafeCity AI",
  description: "Xavfsiz shahar uchun interaktiv xarita",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SafeCity",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
