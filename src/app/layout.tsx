import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {TopBar} from "@/app/top-bar";
import {Footer} from "@/app/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La boussole Gaza",
  description: "Regroupement de citations au sujet du génocide à Gaza",
};

export default function RootLayout({children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <div
      className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <TopBar/>

      {children}
      <Footer/>
    </div>
    </body>
    </html>
  );
}
