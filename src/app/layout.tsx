import { Inter } from "next/font/google";
import './globals.css';
import BootstrapClient from "@/components/BootstrapClient";
import ThemeChanger from "@/components/ThemeChanger";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeChanger/>
        {children}</body>
      <BootstrapClient/>
    </html>
  );
}
