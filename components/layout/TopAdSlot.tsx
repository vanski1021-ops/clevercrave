"use client";

import { useUserStore } from "@/stores/userStore";

export function TopAdSlot() {
  const wasteItemsSaved = useUserStore((state) => state.wasteItemsSaved);

  return (
    <div
      className="
        h-full w-full
        border-b border-orange-100
        bg-orange-50
        px-4
        flex items-center justify-between
      "
    >
      {/* Left: Icon + Status */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg leading-none">🌱</span>

        <div className="flex flex-col leading-tight truncate">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Waste Saved
          </span>
          <span className="text-xs font-bold text-green-700 truncate">
            {wasteItemsSaved === 0
              ? "Start saving food waste today!"
              : `${wasteItemsSaved} items saved this week`}
          </span>
        </div>
      </div>

      {/* Right: Placeholder Action (non-interactive for now) */}
      <div className="text-[10px] font-semibold uppercase tracking-wide text-orange-600">
        Ad
      </div>
    </div>
  );
}
