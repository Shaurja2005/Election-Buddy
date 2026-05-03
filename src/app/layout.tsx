import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
    <html lang="en" suppressHydrationWarning>
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
          {/* Skip Navigation Link for Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-content focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Skip to main content
          </a>

          <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
            <Header />
            <div id="main-content" role="main" tabIndex={-1} className="flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
