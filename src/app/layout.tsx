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
      <body className='overflow-y-auto'>
        <ThemeChanger/>
        {children}</body>
      <BootstrapClient/>
    </html>
  );
}


export const metadata:Metadata={
  title:"NewsHelp",
  description:"A news website made with Next.js",
  robots:{
    follow:true,
    index:true
  },
  category: "news",
  manifest: '/manifest.json',
}