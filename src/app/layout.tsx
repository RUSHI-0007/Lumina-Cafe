import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CartSlideout } from "@/components/cart/cart-slideout";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#DFD6CB", // Matches 'cream' background
};

export const metadata: Metadata = {
  title: "Lumina Café | Artisanal Coffee Experience",
  description:
    "Ethically sourced single-origin beans. Masterfully extracted espresso. Warm, architecturally stunning spaces. Order ahead, reserve tasting rooms, and join the Lumina experience.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lumina",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google Fonts: Plus Jakarta Sans, Cormorant Garamond, IBM Plex Mono */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=IBM+Plex+Mono:wght@300;400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-cream min-h-screen font-sans antialiased">
          {children}
          <CartSlideout />
        </body>
      </html>
    </ClerkProvider>
  );
}
