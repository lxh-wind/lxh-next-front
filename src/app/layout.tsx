import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "LXH Next Admin",
  description: "一个基于 Next.js 构建的现代化后台管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={inter.className}>
      <body
        className="min-h-screen bg-background font-sans antialiased"
      >
        <ThemeProvider>
          {/* <div className="fixed top-4 right-4 z-50">
            <Link href="/dashboard">
              <Button>进入管理系统</Button>
            </Link>
          </div> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
