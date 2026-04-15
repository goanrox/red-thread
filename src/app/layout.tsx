import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-void text-ivory antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
