import BootstrapClient from "@/components/BootstrapClient";
import { Metadata } from "next";

export const metadata:Metadata={
    title:"Login | NewsHelp",
    description:"Login to your account to manage your articles.",
    category: "admin",
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
