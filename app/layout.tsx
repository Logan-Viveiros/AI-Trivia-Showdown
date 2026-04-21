import type { Metadata } from "next";
import { Baloo_2, Bungee } from "next/font/google";
import "./globals.css";
import BackgroundMusic from "./components/BackgroundMusic";

const displayFont = Bungee({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const bodyFont = Baloo_2({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Trivia Showdown",
  description: "Jump into AI-powered quizzes, build your own, or discover new trivia challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
