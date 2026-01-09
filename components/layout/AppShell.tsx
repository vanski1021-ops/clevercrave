import { ReactNode } from "react";
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
        <button
          aria-label="Add items"
          onClick={onFabClick}
          className="fixed bottom-24 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full
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
      )}
    </div>
  );
}
