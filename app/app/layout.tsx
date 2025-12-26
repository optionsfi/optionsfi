import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "../components/AppWalletProvider";
import Navbar from "../components/Navbar";
import ToastProvider from "../components/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import { validateBypassToken } from "../lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptionsFi — On-Chain Options Infrastructure",
  description: "On-chain options infrastructure for tokenized equities. RFQ-priced, cash-settled, and fully composable.",
  icons: {
    icon: "/OptionsFi_favicon.png",
    shortcut: "/OptionsFi_favicon.png",
    apple: "/OptionsFi_favicon.png",
  },
};

import { SettingsProvider } from "../hooks/useSettings";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if coming soon page should be shown
  const showComingSoon = process.env.NEXT_PUBLIC_SHOW_COMING_SOON === "true";

  // Check for valid bypass token
  const cookieStore = await cookies();
  const bypassToken = cookieStore.get('bypass_token')?.value;
  const hasValidBypass = validateBypassToken(bypassToken);

  // Show navbar/ticker if coming soon is disabled OR user has bypass token
  const showNavbar = !showComingSoon || hasValidBypass;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AppWalletProvider>
          <SettingsProvider>
            <div className="min-h-screen flex flex-col">
              {showNavbar && (
                <>
                  <Navbar />
                </>
              )}
              {children}
            </div>
            <ToastProvider />
          </SettingsProvider>
        </AppWalletProvider>
        <Analytics />
      </body>
    </html>
  );
}
