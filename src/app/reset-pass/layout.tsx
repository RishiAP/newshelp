import BootstrapClient from "@/components/BootstrapClient";
import { Metadata } from "next";

export const metadata:Metadata={
    title:"Reset Password | NewsHelp",
    category: "Password Reset",
    manifest: '/manifest.json',
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>{children}<BootstrapClient/></>
  );
}
