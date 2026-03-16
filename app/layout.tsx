import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CELESTIAL — Celestial Intelligence, Personalized",
  description:
    "Discover your cosmic blueprint with a personalized birth chart reading. Unlock insights on love, career, finances, and your life's purpose.",
  keywords: ["birth chart", "astrology", "natal chart", "horoscope", "zodiac", "celestial insights"],
  authors: [{ name: "CELESTIAL" }],
  openGraph: {
    type: "website",
    title: "CELESTIAL — Celestial Intelligence, Personalized",
    description:
      "Discover your cosmic blueprint with a personalized birth chart reading. Unlock insights on love, career, finances, and your life's purpose.",
    siteName: "CELESTIAL",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CELESTIAL — Celestial Intelligence, Personalized",
    description:
      "Discover your cosmic blueprint with a personalized birth chart reading.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
