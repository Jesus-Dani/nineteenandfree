import type { Metadata } from "next";
import { Shantell_Sans, Caveat } from "next/font/google";
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

// Deliberately minimal — the public site's scribble background/Header/Footer
// live in app/(site)/layout.tsx, and Admin has its own separate chrome in
// app/admin/(dashboard)/layout.tsx, since Admin is private and not part of
// the themed public site (PRD Section 6).
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${shantellSans.variable} ${caveat.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-cream text-charcoal">{children}</body>
    </html>
  );
}
