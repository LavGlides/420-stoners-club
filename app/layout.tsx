import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://420stonersclub.com"),
  title: {
    default: "420 Stoners Club - Premium Streetwear",
    template: "%s | 420 Stoners Club",
  },
  description:
    "Elevated streetwear for the culture. Premium quality apparel with limited drops. Discover unique pieces that stand out from the crowd.",
  keywords: [
    "streetwear",
    "premium apparel",
    "limited drops",
    "urban fashion",
    "420 culture",
    "designer clothing",
  ],
  authors: [{ name: "420 Stoners Club" }],
  creator: "civicstackGh",
  publisher: "420 Stoners Club",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "420 Stoners Club - Premium Streetwear",
    description:
      "Elevated streetwear for the culture. Premium quality apparel with limited drops. Discover unique pieces that stand out from the crowd.",
    url: "https://420stonersclub.com",
    siteName: "420 Stoners Club",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "420 Stoners Club - Premium Streetwear",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "420 Stoners Club - Premium Streetwear",
    description:
      "Elevated streetwear for the culture. Premium quality apparel with limited drops.",
    images: ["/logo.png"],
    creator: "@420stonersclub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
    >
      <body style={{ fontFamily: "var(--font-body)" }}>{children}</body>
    </html>
  );
}
