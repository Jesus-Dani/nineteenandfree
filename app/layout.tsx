import type { Metadata } from "next";
import { Shantell_Sans, Caveat } from "next/font/google";
import { ScribbleBackground } from "@/components/ScribbleBackground";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const shantellSans = Shantell_Sans({
  variable: "--font-shantell-sans",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nineteenandfree — A birthday outreach of grace",
  description:
    "A one-time Christian birthday outreach campaign celebrating 19 years of God's grace by giving Bibles, books, and support to children — Romans 8:1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${shantellSans.variable} ${caveat.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-cream text-charcoal">
        <ScribbleBackground />
        <Header />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
