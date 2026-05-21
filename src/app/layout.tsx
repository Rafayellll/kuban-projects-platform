import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AssistantWidget } from "@/components/assistant-widget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ПроКубань — проектный вход в компании региона",
  description:
    "Платформа мини-стажировок и проектной деятельности для молодёжи Краснодарского края. AI-матчинг, экскурсии, наставничество.",
  metadataBase: new URL("https://prokuban.example.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased text-ink bg-paper">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AssistantWidget />
      </body>
    </html>
  );
}
