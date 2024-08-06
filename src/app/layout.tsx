import './globals.css';
import BootstrapClient from "@/components/BootstrapClient";
import ThemeChanger from "@/components/ThemeChanger";
import { Metadata } from 'next';


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeChanger/>
        {children}</body>
      <BootstrapClient/>
    </html>
  );
}


export const metadata:Metadata={
  title:"News Help",
  description:"A news website made with Next.js"
}