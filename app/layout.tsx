import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { GlobalThemeControl } from "@/components/shared/global-theme-control";
import { DemoSessionProvider } from "@/features/auth/session/session-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "UIPKGE Boilerplate",
  description:
    "A frontend-only UIPKGE application foundation and component laboratory.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableColorScheme
          enableSystem
          storageKey="theme"
        >
          <DemoSessionProvider>
            <GlobalThemeControl />
            {children}
          </DemoSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
