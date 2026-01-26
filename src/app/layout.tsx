import type { Metadata } from "next";
import { Be_Vietnam_Pro, Space_Grotesk } from "next/font/google";
import "./globals.css";

const brandSans = Be_Vietnam_Pro({
  variable: "--font-brand-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const brandDisplay = Space_Grotesk({
  variable: "--font-brand-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CIO Year End Party 2026 | MoMo",
  description:
    "Countdown to MoMo CIO Year End Party 2026. Get ready for the big reveal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${brandSans.variable} ${brandDisplay.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
