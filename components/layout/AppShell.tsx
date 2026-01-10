"use client";

import { ReactNode, useState, useEffect } from "react";
import { TopAdSlot } from "./TopAdSlot";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  showFab?: boolean;
  onFabClick?: () => void;
}

export function AppShell({
  children,
  showFab = true,
  onFabClick,
}: AppShellProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      {/* Fixed App Frame */}
      <div className="flex h-full flex-col">
        {/* Top Ad Slot — FIXED HEIGHT, NEVER COLLAPSES */}
        <div className="h-16 shrink-0">
          <TopAdSlot />
        </div>

        {/* Scrollable Content Area (ONLY SCROLL CONTAINER) */}
        <main className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </main>

        {/* Bottom Navigation — FIXED HEIGHT */}
        <div className="h-20 shrink-0">
          <BottomNav />
        </div>
      </div>

      {/* Global Floating Action Button (Optional) */}
      {showFab && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-center">
          {/* Bouncy "ADD ITEMS" Tooltip */}
          {showTooltip && (
            <div className="mb-2 animate-bounce">
              <div className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                ADD ITEMS
              </div>
            </div>
          )}
          
          {/* FAB Button */}
          <button
            aria-label="Add items"
            onClick={onFabClick}
            className="flex h-16 w-16 items-center justify-center rounded-full
                       bg-gradient-to-br from-orange-500 via-orange-400 to-red-500
                       text-white shadow-2xl border-4 border-white
                       active:scale-95 transition-transform"
          >
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
