import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono, Geist, Geist_Mono, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "flag-icons/css/flag-icons.min.css";
import { getMetadata } from "@/lib/metadata";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
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
    template: '%s | Drawdown'
  },
  description: 'Learn to trade properly with structured courses, AI-powered tools and honest mentorship. No gurus. No hype. Just edge.',
  openGraph: {
    siteName: 'Drawdown',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@drawdowntrading',
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
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${geist.variable} ${geistMono.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
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
