import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-mono" });

export const metadata = {
  title: "Saurabh Kumar — AI Engineer | Ask me anything",
  description: "Chat-first portfolio of AI developer Saurabh Kumar. Projects, skills and fun entries include illustrative placeholder demos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>{children}</body>
    </html>
  );
}
