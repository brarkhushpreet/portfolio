import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Khushpreet Singh — Full-Stack Software Engineer",
  description:
    "Khushpreet Singh builds full-stack products, AI systems, realtime backends, and dependable AWS infrastructure.",
  keywords: [
    "Khushpreet Singh",
    "Full-Stack Software Engineer",
    "Backend Engineer",
    "AI Engineer",
    "Next.js Developer",
    "AWS Developer",
  ],
  authors: [{ name: "Khushpreet Singh" }],
  openGraph: {
    title: "Khushpreet Singh — Full-Stack Software Engineer",
    description: "Interface / systems / cloud. Selected projects and production engineering work.",
    type: "website",
    url: siteUrl,
    images: [{
      url: "/og.png",
      width: 1672,
      height: 941,
      alt: "Khushpreet Singh — Full-Stack Software Engineer",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khushpreet Singh — Full-Stack Software Engineer",
    description: "Interface / systems / cloud. Selected projects and production engineering work.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
