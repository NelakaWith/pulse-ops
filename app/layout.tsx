import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import DevHydrationDebug from "@/components/dev-hydration-debug";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PulseOps | Developer Metrics Dashboard",
  description: "Dashboard for monitoring developer metrics and productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const devHtmlProps: Record<string, boolean | string> = {};
  if (process.env.NODE_ENV === "development") {
    // Add dev-only attributes to match client-side injections (extensions/dev overlays)
    // This helps avoid hydration mismatch warnings while debugging extensions.
    devHtmlProps.suppressHydrationWarning = true;
    // Some browser extensions inject `data-qb-installed`; mirror it server-side in dev
    // so the server and client HTML match and hydration warnings are reduced.
    devHtmlProps["data-qb-installed"] = "true";
  }

  return (
    <html lang="en" {...devHtmlProps}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {process.env.NODE_ENV === "development" && <DevHydrationDebug />}
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full bg-background">{children}</main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
