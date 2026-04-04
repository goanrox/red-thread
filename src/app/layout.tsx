import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Red Thread — Premium Mystery Platform",
    template: "%s | Red Thread",
  },
  description:
    "The first premium narrative mystery platform built for people who love a great story. Investigate. Interrogate. Accuse.",
  keywords: ["mystery", "detective", "interactive fiction", "crime", "puzzle"],
  openGraph: {
    title: "Red Thread",
    description: "A premium cinematic mystery-solving experience.",
    siteName: "Red Thread",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Red Thread",
    description: "A premium cinematic mystery-solving experience.",
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-void text-parchment antialiased">
        {children}
      </body>
    </html>
  );
}
