"use client";

import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleFabClick = () => {
    router.push("/scan");
  };

  return (
    <html lang="en">
      <body>
        <AppShell
          showFab={!pathname.startsWith("/scan")}
          onFabClick={handleFabClick}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
