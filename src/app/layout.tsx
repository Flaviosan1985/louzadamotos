import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admycar",
  description: "Sistema de gestão para lojas e agências de veículos multimarcas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={cn(geistSans.variable, geistMono.variable, "flex min-h-full w-full antialiased")}
      suppressHydrationWarning
    >
      <body className="flex min-h-full w-full flex-auto flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
