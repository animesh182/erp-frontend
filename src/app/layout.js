// "use client";
import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { ThemeProvider } from "@/components/themeprovider";
import { Toaster } from "@/components/ui/sonner";
import { ClockifyProvider } from "@/context/clockifyContext/ClockifyContext";
import { DateRangeProvider } from "@/context/dateRangeContext/DateRangeContext";

export const metadata = {
  title: "Avinto",
  description: "ERP system for Avinto",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
           <DateRangeProvider>
          <ClockifyProvider>
          {children}
          </ClockifyProvider>
          </DateRangeProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
