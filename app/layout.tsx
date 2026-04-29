import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-app-sans",
  subsets: ["latin", "latin-ext"],
});

const fontSerif = Playfair_Display({
  variable: "--font-app-serif",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "ЛапаДом",
  description: "Бутик-отель для собак и кошек",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}