import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata = {
  title: "Your Name — AI Engineer | Ask me anything",
  description: "Chat-first portfolio of an AI engineer. Ask about projects, skills, or contact — placeholder demo content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
