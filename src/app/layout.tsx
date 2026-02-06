import type { Metadata } from "next";
import { Poppins, Sofia_Sans } from "next/font/google";
import "./globals.css";
import { ReportNav } from "@/components/navigation/ReportNav";

const sofiaSans = Sofia_Sans({
  variable: "--font-sofia-sans",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPARK Schools Marketing Report 2025",
  description: "Annual Marketing Performance Report - January 2025 to January 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sofiaSans.variable} ${poppins.variable} antialiased`}>
        <ReportNav />
        {children}
      </body>
    </html>
  );
}
