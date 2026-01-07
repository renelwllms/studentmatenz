import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "StudentMate NZ | International Student Support",
    template: "%s | StudentMate NZ",
  },
  description:
    "Settlement support for international students in New Zealand. Checklists, arrivals, and care plans that make the move feel effortless.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "StudentMate NZ",
    description:
      "Premium, practical settlement support for international students in New Zealand.",
    url: siteUrl,
    siteName: "StudentMate NZ",
    locale: "en_NZ",
    type: "website",
    images: [
      {
        url: `${siteUrl}/OGimage2.webp`,
        width: 1200,
        height: 630,
        alt: "StudentMate NZ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudentMate NZ",
    description:
      "Premium, practical settlement support for international students in New Zealand.",
    images: [
      {
        url: `${siteUrl}/OGimage2.webp`,
        alt: "StudentMate NZ",
      },
    ],
  },
  icons: {
    icon: "/ic_school_128_28729.ico",
    shortcut: "/ic_school_128_28729.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
