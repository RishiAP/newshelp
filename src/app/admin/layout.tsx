import BootstrapClient from "@/components/BootstrapClient";
import { Metadata } from "next";

export const metadata:Metadata={
    title:"Admin Panel",
    description:"Admin Panel for managing all your articles. Post, update or delete articles with ease."
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
   {children}
   <BootstrapClient/>
    </>
  );
}
