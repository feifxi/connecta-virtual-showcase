import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Connecta · UI mockup",
  description: "Online showcase events where visitors walk between booths and talk to presenters live.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("font-sans antialiased", jakarta.variable)}>
      <body className="min-h-screen bg-background text-foreground">{children}</body>
    </html>
  );
}
