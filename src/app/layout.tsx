import { ClerkProvider, SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import TutorChat from "@/components/TutorChat";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGroteskDisplay = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImpactX",
  description: "Advanced adaptive learning platform for official statistics capacity building.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authObj = await auth();
  const userId = authObj.userId;
  
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceGroteskDisplay.variable} h-full antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ClerkProvider>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <TutorChat />
        </ClerkProvider>
      </body>
    </html>
  );
}