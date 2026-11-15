import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";

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

/**
 * Runs before first paint: marks the document as scripted, restores a saved
 * theme (dark is the default), and guarantees the opening curtain lifts even
 * if the app bundle never arrives.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("portfolio-theme");if(t==="light"||t==="dark"){d.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m&&t==="light")m.setAttribute("content","#edece8")}}catch(e){}setTimeout(function(){d.classList.add("is-ready")},3500)})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0c0d0f" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preload" href="/fonts/geist-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
