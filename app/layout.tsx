import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme.css"
import { ThemeProvider } from "@/providers/theme-provider";
import MountedProvider from "@/providers/mounted.provider";
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ["latin"] });
// language 
import DirectionProvider from "@/providers/direction-provider";
import { AuthProvider } from "@/providers/auth.provider";
import React from "react";

export const metadata: Metadata = {
  title: "Dashcode admin Template",
  description: "created by codeshaper",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {

  //const messages = await getMessages();
  // const direction = getLangDir(locale);
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} dashcode-app`}>
        {/* <NextIntlClientProvider locale="en"> */}
        <AuthProvider>
          <ThemeProvider attribute="class"

            defaultTheme="light">
            <MountedProvider>

              <DirectionProvider direction="ltr">
                {children}
              </DirectionProvider>

            </MountedProvider>
            <Toaster />
            <SonnerToaster />
          </ThemeProvider>
        </AuthProvider>
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  );
}
