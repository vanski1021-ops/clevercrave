"use client";

import "./globals.css";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePathname } from "next/navigation";
import ScanOverlay from "@/components/ScanOverlay";
import DevCreditsPanel from "@/components/DevCreditsPanel";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showScanOverlay, setShowScanOverlay] = useState(false);

  const handleFabClick = () => {
    setShowScanOverlay(true);
  };

  const handleCloseScanOverlay = () => {
    setShowScanOverlay(false);
  };

  // Don't show FAB if we're on a dedicated scan sub-route (like /scan/camera)
  const isOnScanSubRoute = pathname.startsWith("/scan/");

  return (
    <html lang="en">
      <body>
        <AppShell
          showFab={!showScanOverlay && !isOnScanSubRoute}
          onFabClick={handleFabClick}
        >
          {children}
        </AppShell>
        {showScanOverlay && <ScanOverlay onClose={handleCloseScanOverlay} />}
        <DevCreditsPanel />
      </body>
    </html>
  );
}
