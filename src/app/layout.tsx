import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { homePath, ticketsPath } from "@/paths";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Basic Next App",
  description: "A basic Next.js application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="
            supports:backdrop-blur:bg-background/50
            fixed left-0 right-0 top-0 z-20
            border-b bg-background/50 backdrop-blur
            w-full flex justify-between py-2.5 px-5">
          <div>
            <Button asChild variant="outline">
              <Link href={homePath()} className="text-lg font-bold">Home</Link>
            </Button>
          </div>
          <div>
            <Link href={ticketsPath()} className={buttonVariants({variant: "outline"})}>Tickets</Link>
          </div>
        </nav>
        <main
          className="
          min-h-screen flex-1
          overflow-y-auto overflow-x-hidden
          py-24 px-8
          bg-secondary/20
          flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
