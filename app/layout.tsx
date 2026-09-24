import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIGDEAL — MMORPG News & Intelligence",
  description:
    "Independent news, research, context and intelligence across the world's leading MMORPGs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}