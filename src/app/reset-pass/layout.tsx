import BootstrapClient from "@/components/BootstrapClient";
import { Metadata } from "next";

export const metadata:Metadata={
    title:"Forget Passowrd"
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
