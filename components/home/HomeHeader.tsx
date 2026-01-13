"use client";

import { useMemo, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { usePantryStore } from "@/stores/pantryStore";

export default function HomeHeader() {
  const credits = useUserStore((state) => state.credits);
  const monthlyGenerations = useUserStore((state) => state.monthlyGenerations);
  const checkAndResetMonthly = useUserStore((state) => state.checkAndResetMonthly);
  const pantryItems = usePantryStore((state) => state.items);
  const pantryCount = useMemo(
    () => pantryItems.filter((i) => i.status === "fresh").length,
    [pantryItems]
  );
  
  // Check for monthly reset on mount
  useEffect(() => {
    checkAndResetMonthly();
  }, [checkAndResetMonthly]);

  return (
    <div className="px-5 pt-5 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Tonight&apos;s Vibe
          </h1>
          <p className="mt-2 text-gray-600 font-medium">
            Using {pantryCount} items from your pantry.
          </p>
        </div>

        {/* Credit counter */}
        {credits > 0 ? (
          // Free tier credits
          <div className="shrink-0 bg-orange-100 px-3 py-1.5 rounded-full">
            <span className="text-orange-600 font-black text-sm">
              🪙 {credits}
            </span>
          </div>
        ) : (
          // Premium monthly generations
          <div className="shrink-0 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full shadow-md">
            <span className="text-white font-black text-sm">
              🪙 {monthlyGenerations}/10
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
