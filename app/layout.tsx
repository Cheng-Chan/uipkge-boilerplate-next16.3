import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

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
          <div className="fixed top-4 right-4 z-50">
            <ThemeSwitcher />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
