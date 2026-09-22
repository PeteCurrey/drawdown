import type { Metadata } from "next";
import { Work_Sans, Instrument_Serif, Inter, JetBrains_Mono, Syne, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "flag-icons/css/flag-icons.min.css";
import { getMetadata } from "@/lib/metadata";
import { LEGAL_CONFIG } from "@/config/legal";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://drawdown.trading'),
  title: {
    default: 'Drawdown — Trade the Truth',
    template: '%s'
  },
  description: 'Learn to trade properly with structured courses, AI-powered tools and honest mentorship. No gurus. No hype. Just edge.',
  openGraph: {
    siteName: 'Drawdown',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@drawdown_hq',
  },
  robots: {
    index: true,
    follow: true,
  }
}

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable} ${syne.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Impact Site Verification */}
        <meta name="impact-site-verification" content="56d783d1-d037-48ed-870f-d779824b99db" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R8LQSZ9436"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-R8LQSZ9436');
            `,
          }}
        />
        {/* Ahrefs Analytics */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="N01jEQ+ncXGoGSG9gs0QhA" async />
        {/* Site-wide Organization Schema (E-E-A-T) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": LEGAL_CONFIG.fullTradingEntity,
              "legalName": LEGAL_CONFIG.contractingEntity,
              "url": "https://drawdown.trading",
              "logo": "https://drawdown.trading/assets/brand/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "GB",
                "addressLocality": "Chesterfield, Derbyshire"
              },
              "sameAs": [
                "https://twitter.com/drawdown_hq",
                "https://youtube.com/@drawdown"
              ]
            })
          }}
        />
      </head>

      <body className="min-h-screen flex flex-col bg-background-primary text-text-primary selection:bg-accent selection:text-background-primary transition-colors duration-500">
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ScrollProgress />
            <main className="flex-grow">
              {children}
            </main>
            <GrainOverlay />
            <SmoothScroll />
          </ThemeProvider>
      </body>
    </html>
  );
}
