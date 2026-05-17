import type { Metadata } from "next";
import { Plus_Jakarta_Sans  } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Activity Tracker",
  description: "Personal activity tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={jakarta.variable}>
      <body className={`antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
