"use client";

import { useListStore } from "@/stores/listStore";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ListPage() {
  const router = useRouter();
  const items = useListStore((state) => state.items);
  const toggleItem = useListStore((state) => state.toggleItem);
  const removeItem = useListStore((state) => state.removeItem);
  const clearChecked = useListStore((state) => state.clearChecked);
  const addItem = useListStore((state) => state.addItem);

  const [newItem, setNewItem] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Long press timer ref
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggeredRef = useRef(false);

  // Calculate counts
  const checkedCount = items.filter((item) => item.checked).length;

  // Sort items: unchecked first, then checked
  const sortedItems = [...items].sort((a, b) => {
    if (a.checked === b.checked) return 0;
    return a.checked ? 1 : -1;
  });

  // Handle add item
  const handleAddItem = () => {
    const trimmed = newItem.trim();
    if (trimmed) {
      addItem(trimmed);
      setNewItem("");
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
  };

  // Handle key press in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  // Handle share list
  const handleShareList = async () => {
    const uncheckedItems = items.filter((i) => !i.checked);
    const checkedItems = items.filter((i) => i.checked);

    let text = "🛒 My Shopping List\n\n";

    if (uncheckedItems.length > 0) {
      text += "📝 To Buy:\n";
      uncheckedItems.forEach((item) => {
        text += `☐ ${item.name}\n`;
      });
    }

    if (checkedItems.length > 0) {
      text += "\n✅ Completed:\n";
      checkedItems.forEach((item) => {
        text += `✓ ${item.name}\n`;
      });
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Shopping List",
          text: text,
        });
        if ("vibrate" in navigator) navigator.vibrate([10, 50, 10]);
      } catch {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      alert("List copied to clipboard! ✓");
    }
  };

  // Long press handlers for delete
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

  // Handle checkbox click (only if not long press)
  const handleItemClick = (id: string) => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    toggleItem(id);
    if ("vibrate" in navigator) navigator.vibrate(10);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeItem(deleteConfirm);
      setDeleteConfirm(null);
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6 pb-32 animate-in fade-in duration-300">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Shopping List
      </h1>
      <p className="text-gray-500 font-medium mb-6">
        {items.length} items
        {checkedCount > 0 && (
          <span className="text-green-600 ml-2">• {checkedCount} completed</span>
        )}
      </p>

      {/* Add Item Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none text-lg px-2 bg-white text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-normal"
        />
        <button
          onClick={handleAddItem}
          disabled={newItem.trim() === ""}
          className={`w-12 h-12 rounded-xl flex items-center justify-center active:scale-95 transition-transform ${
            newItem.trim() === ""
              ? "bg-gray-200 text-gray-400"
              : "bg-orange-500 text-white"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-8xl opacity-30 mb-6">🛒</span>
          <h2 className="text-2xl font-bold text-gray-400 mb-3">
            Your list is empty
          </h2>
          <p className="text-gray-500 mb-8">Type items above or browse recipes</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl text-center shadow-lg shadow-orange-200 active:scale-95 transition-transform"
            >
              Browse Recipes
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length > 0 && (
        <>
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                onTouchStart={() => handleTouchStart(item.id)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onContextMenu={(e) => e.preventDefault()}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 cursor-pointer select-none transition-all active:scale-[0.98] active:bg-orange-50 ${
                  item.checked ? "opacity-60" : ""
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-7 h-7 border-2 rounded-lg flex items-center justify-center active:scale-90 transition-all ${
                    item.checked
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {item.checked && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Item Name */}
                <span
                  className={`flex-1 text-lg font-bold ${
                    item.checked ? "text-gray-400 line-through" : "text-gray-900"
                  }`}
                >
                  {item.name}
                </span>

                {/* Delete hint (visual only, long press triggers) */}
                <div className="w-10 h-10 flex items-center justify-center text-gray-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-900 font-bold py-3 px-6 rounded-2xl active:scale-95 transition-transform"
              >
                Clear {checkedCount} Completed
              </button>
            )}
            <button
              onClick={handleShareList}
              className="flex-1 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-orange-200 active:scale-95 transition-transform"
            >
              Share List
            </button>
          </div>
        </>
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
              &quot; from your list?
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
