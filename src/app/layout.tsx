import type { Metadata } from "next";
import {
  Inter,
  Noto_Sans_Devanagari,
  Noto_Sans_Bengali,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Nastaliq_Urdu,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SkipLink from "@/components/SkipLink";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  variable: "--font-bengali",
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil", "latin"],
  variable: "--font-tamil",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu", "latin"],
  variable: "--font-telugu",
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  subsets: ["kannada", "latin"],
  variable: "--font-kannada",
  display: "swap",
});

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam", "latin"],
  variable: "--font-malayalam",
  display: "swap",
});

// Nastaliq ships only a variable weight axis; keep it at one weight.
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  display: "swap",
});

const fontVariables = [
  inter.variable,
  notoDevanagari.variable,
  notoBengali.variable,
  notoTamil.variable,
  notoTelugu.variable,
  notoKannada.variable,
  notoMalayalam.variable,
  notoNastaliqUrdu.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Ballot Buddy — Your Election Assistant",
  description:
    "A non-partisan AI assistant to help US voters understand election processes, registration deadlines, polling locations, and more. Powered by Google Civic API and Gemini AI.",
  keywords: [
    "election assistant",
    "voter registration",
    "polling locations",
    "how to vote",
    "election guide",
    "civic information",
    "ballot buddy",
    "Google Civic API",
    "Gemini AI",
  ],
  authors: [{ name: "Ballot Buddy" }],
  openGraph: {
    title: "Ballot Buddy — Your Election Assistant",
    description:
      "Get personalized election information for your address. Non-partisan, accurate, and easy to understand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" data-font="latin" className={fontVariables} suppressHydrationWarning>
      <body
        className="min-h-screen bg-base-100 antialiased"
        suppressHydrationWarning
      >
        {/* Google Analytics 4 */}
        <GoogleAnalytics />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <LanguageProvider>
            <SkipLink />

            <AuthProvider>
              <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
                <Header />
                <div id="main-content" role="main" tabIndex={-1} className="flex-1 flex flex-col">
                  {children}
                </div>
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
