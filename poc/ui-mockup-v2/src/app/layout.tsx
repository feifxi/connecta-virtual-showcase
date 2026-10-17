import type { Metadata } from "next";
import { PreviewTools } from "@/components/preview-tools";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connecta · A little closer, wherever you are",
  description: "UI mockup v2 (design from poc/TestUI): walk between booths and talk to presenters live.",
  icons: { icon: "/assets/images/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
        <PreviewTools />
      </body>
    </html>
  );
}
