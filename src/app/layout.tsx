import './globals.css';
import BootstrapClient from "@/components/BootstrapClient";
import ThemeChanger from "@/components/ThemeChanger";


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
