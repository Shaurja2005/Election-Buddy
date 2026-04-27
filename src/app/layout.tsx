import type { Metadata } from "next";
import "./globals.css";

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
  ],
  authors: [{ name: "Ballot Buddy" }],
  openGraph: {
    title: "Ballot Buddy — Your Election Assistant",
    description:
      "Get personalized election information for your address. Non-partisan, accurate, and easy to understand.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-base-100 antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
