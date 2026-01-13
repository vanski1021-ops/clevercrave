"use client";

import "./globals.css";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { usePathname } from "next/navigation";
import { usePantryStore } from "@/stores/pantryStore";
import ScanOverlay from "@/components/ScanOverlay";
import DevCreditsPanel from "@/components/DevCreditsPanel";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showScanOverlay, setShowScanOverlay] = useState(false);
  const pantryItems = usePantryStore((state) => state.items);

  const handleFabClick = () => {
    setShowScanOverlay(true);
  };

  const handleCloseScanOverlay = () => {
    setShowScanOverlay(false);
  };

  // Don't show FAB if we're on a dedicated scan sub-route (like /scan/camera)
  const isOnScanSubRoute = pathname.startsWith("/scan/");
  
  // Hide FAB on pantry page if inventory is empty
  const isOnPantryWithNoItems = pathname === "/pantry" && pantryItems.length === 0;
  
  // Show FAB logic: not on scan routes AND not on empty pantry page
  const shouldShowFab = !showScanOverlay && !isOnScanSubRoute && !isOnPantryWithNoItems;

  return (
    <html lang="en">
      <body>
        <AppShell
          showFab={shouldShowFab}
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
