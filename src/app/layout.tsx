import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
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

export const metadata: Metadata = {
  title: "Drawdown — Trade the Truth.",
  description: "Trading education for people who want to learn properly. No shortcuts. Just edge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background-primary text-text-primary selection:bg-accent selection:text-background-primary">
        <SmoothScroll>
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <GrainOverlay />
      </body>
    </html>
  );
}
