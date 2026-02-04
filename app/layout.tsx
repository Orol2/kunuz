import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kun.uz News - Latest News from Uzbekistan",
  description: "Stay updated with the latest news from Kun.uz - Uzbekistan's leading news portal. Get breaking news, articles, and updates.",
  keywords: "kun.uz, news, Uzbekistan, latest news, breaking news",
  authors: [{ name: "Kun.uz News Scraper" }],
  openGraph: {
    title: "Kun.uz News - Latest News from Uzbekistan",
    description: "Stay updated with the latest news from Kun.uz",
    type: "website",
    locale: "uz_UZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
