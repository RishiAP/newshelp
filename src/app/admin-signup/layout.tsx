import BootstrapClient from "@/components/BootstrapClient";
import { Metadata } from "next";

export const metadata:Metadata={
    title:"Signup | NewsHelp",
    description:"Create an account to manage your articles.",
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
