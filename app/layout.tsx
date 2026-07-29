import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const headerHost = forwardedHost ?? requestHeaders.get("host") ?? "localhost:3000";
  const safeHost = /^[a-z0-9.-]+(?::\d+)?$/i.test(headerHost)
    ? headerHost
    : "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : safeHost.startsWith("localhost")
        ? "http"
        : "https";
  const origin = `${protocol}://${safeHost}`;
  const socialCard = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: "Khushpreet Singh — Full-Stack Software Engineer",
    description:
      "Khushpreet Singh builds production software from interface to infrastructure—full-stack products, backend systems, AI workflows, and AWS deployments.",
    keywords: [
      "Khushpreet Singh",
      "Software Engineer",
      "Full-Stack Engineer",
      "Backend Engineer",
      "Frontend Engineer",
      "Next.js Developer",
      "AWS Developer",
    ],
    authors: [{ name: "Khushpreet Singh" }],
    openGraph: {
      title: "Khushpreet Singh — Full-Stack Software Engineer",
      description:
        "Interface to infrastructure. Explore full-stack products, backend systems, AI workflows, and production deployments.",
      type: "website",
      images: [
        {
          url: socialCard,
          width: 1672,
          height: 939,
          alt: "Khushpreet Singh — Interface to Infrastructure",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Khushpreet Singh — Full-Stack Software Engineer",
      description:
        "Interface to infrastructure. Full-stack products, backend systems, AI workflows, and production deployments.",
      images: [socialCard],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
