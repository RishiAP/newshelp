import { Inter } from "next/font/google";
import BootstrapClient from "@/components/BootstrapClient";
import { Metadata } from "next";
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata:Metadata={
    title:"Admin Panel"
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <BootstrapClient/>
    </html>
  );
}
