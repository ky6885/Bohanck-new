import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "城谜 CityQuest - AI 城市剧本游",
  description: "探索城市的秘密，体验AI驱动的城市剧本游",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
