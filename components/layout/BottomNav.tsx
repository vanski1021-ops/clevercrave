"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useListStore } from "@/stores/listStore";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Pantry", href: "/pantry", icon: PantryIcon },
  { label: "List", href: "/list", icon: ListIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
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
      className="fixed bottom-0 w-full bg-white border-t border-gray-100 h-20 flex justify-around items-center pb-2 z-30 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      aria-label="Bottom navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        // Special handling for List item to show badge
        if (item.label === "List") {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 text-xs font-medium"
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <item.icon
                  className={`
                    h-6 w-6
                    ${isActive ? "text-orange-600" : "text-gray-400"}
                  `}
                />
                {listCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                    {listCount > 9 ? "9+" : listCount}
                  </div>
                )}
              </div>
              <span
                className={`
                  ${isActive ? "text-orange-600" : "text-gray-400"}
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
            className="flex flex-col items-center justify-center gap-1 text-xs font-medium"
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon
              className={`
                h-6 w-6
                ${isActive ? "text-orange-600" : "text-gray-400"}
              `}
            />
            <span
              className={`
                ${isActive ? "text-orange-600" : "text-gray-400"}
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

/* ---------------- Icons ---------------- */

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5m8-11v10a1 1 0 01-1 1h-5m-6 0v-6a1 1 0 011-1h4a1 1 0 011 1v6"
      />
    </svg>
  );
}

function PantryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7h18M5 7v14a1 1 0 001 1h12a1 1 0 001-1V7M9 3h6a1 1 0 011 1v3H8V4a1 1 0 011-1z"
      />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 14a4 4 0 10-8 0m8 0a4 4 0 01-8 0m8 0a7 7 0 017 7H1a7 7 0 017-7"
      />
    </svg>
  );
}
