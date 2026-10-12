import logo from "@/assets/logo.png";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Darias Dashboard",
  description:
    "Manage and organize your wedding events, guests, and schedules effortlessly with Darias Wedding Dashboard.",
  icons: {
    icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <NavBar /> */}
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster />

        {/* <Footer /> */}
      </body>
    </html>
  );
}
