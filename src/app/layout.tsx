import type { Metadata } from "next";
import { Bricolage_Grotesque, Syne } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-body",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALBDO | Rust-Native DOM Compiler & HTTP Runtime",
  description:
    "ALBDO pre-release landing page for a Rust-native DOM compiler and HTTP runtime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
