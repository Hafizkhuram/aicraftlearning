import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { description, siteName, siteUrl, tagline } from "@/lib/constants";

// Self-hosted to avoid fonts.gstatic.com TLS issues (e.g. Cloudflare WARP)
// and to make the brand fonts a bundled asset rather than a runtime fetch.
const fraunces = localFont({
  src: [
    {
      path: "./fonts/fraunces.woff2",
      weight: "500 700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["ui-serif", "Georgia", "serif"],
});

const dmSans = localFont({
  src: [
    {
      path: "./fonts/dm-sans.woff2",
      weight: "400 700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-dm-sans",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — ${tagline}`,
    template: `%s · ${siteName}`,
  },
  description,
  openGraph: {
    title: `${siteName} — ${tagline}`,
    description,
    url: siteUrl,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — ${tagline}`,
    description,
  },
  icons: { icon: "/aicraft-logo-primary.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${fraunces.variable} ${dmSans.variable}`}
      >
        <body className="min-h-screen flex flex-col">
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
