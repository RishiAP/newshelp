import BootstrapClient from "@/components/BootstrapClient";
import { Metadata } from "next";

export const metadata:Metadata={
    title:"Login | News Help"
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <BootstrapClient/>
    </html>
  );
}
