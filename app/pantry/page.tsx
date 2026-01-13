"use client";

import { usePantryStore, Ingredient } from "@/stores/pantryStore";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type FilterType = "all" | "fresh" | "low" | "out";
type SortType = "name" | "date" | "status";

export default function PantryPage() {
  const items = usePantryStore((state) => state.items);
  const updateStatus = usePantryStore((state) => state.updateStatus);
  const removeItem = usePantryStore((state) => state.removeItem);

  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy] = useState<SortType>("date");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);

  // Long press timer ref
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggeredRef = useRef(false);

  // Check if tip was dismissed before
  useEffect(() => {
    const tipDismissed = localStorage.getItem("pantry-tip-dismissed");
    if (!tipDismissed) {
      setShowTip(true);
    }
  }, []);

  // Handle tip dismissal
  const handleDismissTip = () => {
    setShowTip(false);
    localStorage.setItem("pantry-tip-dismissed", "true");
  };

  // Calculate counts
  const freshCount = items.filter((item) => item.status === "fresh").length;
  const lowCount = items.filter((item) => item.status === "low").length;
  const outCount = items.filter((item) => item.status === "out").length;

  // Filter items
  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "date")
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    if (sortBy === "status") {
      const statusOrder = { fresh: 0, low: 1, out: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });

  // Handle status cycling
  const handleStatusCycle = (
    id: string,
    currentStatus: Ingredient["status"]
  ) => {
    const nextStatus: Ingredient["status"] =
      currentStatus === "fresh"
        ? "low"
        : currentStatus === "low"
        ? "out"
        : "fresh";

    updateStatus(id, nextStatus);

    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  // Long press handlers for mobile delete
  const handleTouchStart = (itemId: string) => {
    longPressTriggeredRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setDeleteConfirm(itemId);
      if ("vibrate" in navigator) {
        navigator.vibrate([50, 100, 50]);
      }
    }, 800);
  };

  const handleTouchEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  // Handle card click (only if not a long press)
  const handleCardClick = (id: string, currentStatus: Ingredient["status"]) => {
    // Don't cycle status if long press was triggered
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    handleStatusCycle(id, currentStatus);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeItem(deleteConfirm);
      setDeleteConfirm(null);
      if ("vibrate" in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  // Get border class based on status
  const getBorderClass = (status: Ingredient["status"]) => {
    switch (status) {
      case "fresh":
        return "border-2 border-green-100 hover:border-green-200";
      case "low":
        return "border-2 border-amber-100 hover:border-amber-200";
      case "out":
        return "border-2 border-gray-100 hover:border-gray-200";
      default:
        return "border-2 border-gray-100 hover:border-gray-200";
    }
  };

  // Get status dot color
  const getStatusDotColor = (status: Ingredient["status"]) => {
    switch (status) {
      case "fresh":
        return "bg-green-500";
      case "low":
        return "bg-amber-400";
      case "out":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6 pb-32 animate-in fade-in duration-300">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Inventory</h1>
      <p className="text-sm font-medium mb-4">
        <span className="text-green-600">{freshCount} fresh</span>
        <span className="text-gray-300 mx-2">•</span>
        <span className="text-amber-500">{lowCount} running low</span>
        <span className="text-gray-300 mx-2">•</span>
        <span className="text-gray-400">{outCount} out</span>
      </p>

      {/* Dismissible Tip */}
      {showTip && items.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-3 mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            💡 Tap to cycle status • Hold to delete
          </p>
          <button
            onClick={handleDismissTip}
            className="ml-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Filter Chips */}
      {items.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`border-2 px-5 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
              filter === "all"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("fresh")}
            className={`border-2 px-5 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
              filter === "fresh"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            Fresh
          </button>
          <button
            onClick={() => setFilter("low")}
            className={`border-2 px-5 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
              filter === "low"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            Running Low
          </button>
          <button
            onClick={() => setFilter("out")}
            className={`border-2 px-5 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap ${
              filter === "out"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            Out
          </button>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-8xl opacity-30 mb-6">📦</span>
          
          <h2 className="text-2xl font-bold text-gray-400 mb-8">
            Your inventory is empty
          </h2>
          
          <Link
            href="/scan"
            className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-orange-200 active:scale-95 transition-transform inline-block"
          >
            + Add Items
          </Link>
        </div>
      )}

      {/* Filtered Empty State */}
      {sortedItems.length === 0 && items.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl opacity-30 mb-4">🔍</span>
          <p className="text-xl font-bold text-gray-400 mb-4">
            No {filter} items found
          </p>
          <button
            onClick={() => setFilter("all")}
            className="text-orange-500 font-bold underline"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Items List */}
      {sortedItems.length > 0 && (
        <div className="flex flex-col gap-3">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.id, item.status)}
              onTouchStart={() => handleTouchStart(item.id)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onContextMenu={(e) => e.preventDefault()}
              className={`relative bg-white rounded-2xl p-4 shadow-sm cursor-pointer select-none hover:shadow-md active:scale-95 active:bg-orange-50 transition-all flex items-center gap-4 ${getBorderClass(
                item.status
              )}`}
            >
              {/* Status Dot */}
              <div
                className={`w-3 h-3 rounded-full shadow-sm flex-shrink-0 ${getStatusDotColor(
                  item.status
                )}`}
              />

              {/* Name and Location */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-lg font-bold mb-1 ${
                    item.status === "out"
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }`}
                >
                  {item.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-6 animate-in fade-in duration-200">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Item?
            </h3>
            <p className="text-gray-500 mb-6">
              Remove &quot;{items.find((i) => i.id === deleteConfirm)?.name}
              &quot; from your inventory?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-900 font-bold py-3 rounded-2xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl active:scale-95 transition-transform"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
