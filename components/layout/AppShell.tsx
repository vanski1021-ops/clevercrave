import { ReactNode } from "react";
import { TopAdSlot } from "./TopAdSlot";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopAdSlot />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto bg-white">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
