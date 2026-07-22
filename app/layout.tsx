import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Nama Travel | Umroh & Haji",
    template: "%s | Nama Travel",
  },
  description: "Biro perjalanan umroh & haji resmi berizin Kemenag.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
