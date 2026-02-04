import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-sans">{children}</body>
    </html>
  );
}
