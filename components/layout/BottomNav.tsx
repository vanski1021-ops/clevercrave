"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useListStore } from "@/stores/listStore";
import { Home, ClipboardList, Menu, CookingPot } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Kitchen", href: "/pantry", icon: CookingPot },
  { label: "List", href: "/list", icon: ClipboardList },
  { label: "Profile", href: "/profile", icon: Menu },
];

export function BottomNav() {
  const pathname = usePathname();
  const listItems = useListStore((state) => state.items);
  const listCount = useMemo(
    () => listItems.filter((i) => !i.checked).length,
    [listItems]
  );

  return (
    <nav
      className="fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 h-20 flex justify-around items-center pb-2 pb-safe z-30 px-2 shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.08)]"
      aria-label="Bottom navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        const IconComponent = item.icon;

        // Special handling for List item to show badge
        if (item.label === "List") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 text-xs font-medium active:scale-95 transition-all duration-200 ${
                isActive ? "" : "hover:text-gray-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={`relative p-2 ${isActive ? "scale-110 transition-transform" : ""}`}>
                <IconComponent
                  className={`
                    h-7 w-7 transition-all duration-200
                    ${isActive ? "text-orange-600 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" : "text-gray-400"}
                  `}
                />
                {listCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-[22px] h-[22px] bg-orange-500 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {listCount > 9 ? "9+" : listCount}
                  </div>
                )}
              </div>
              <span
                className={`
                  transition-all duration-200
                  ${isActive ? "text-orange-600 font-extrabold" : "text-gray-400"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium active:scale-95 transition-all duration-200 ${
              isActive ? "" : "hover:text-gray-700"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <div className={`p-2 ${isActive ? "scale-110 transition-transform" : ""}`}>
              <IconComponent
                className={`
                  h-7 w-7 transition-all duration-200
                  ${isActive ? "text-orange-600 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]" : "text-gray-400"}
                `}
              />
            </div>
            <span
              className={`
                transition-all duration-200
                ${isActive ? "text-orange-600 font-extrabold" : "text-gray-400"}
              `}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
