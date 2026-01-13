"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePantryStore } from "@/stores/pantryStore";
import { useUserStore } from "@/stores/userStore";

interface ScannedItem {
  id: string;
  name: string;
  category: string;
  location: "Fridge" | "Freezer" | "Pantry";
}

const LOCATIONS: ("Fridge" | "Freezer" | "Pantry")[] = ["Fridge", "Freezer", "Pantry"];

export default function ReviewPage() {
  const router = useRouter();
  const addItems = usePantryStore((state) => state.addItems);
  const incrementWasteSaved = useUserStore((state) => state.incrementWasteSaved);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  // Touch handlers for long-press delete
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchTargetId, setTouchTargetId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('detectedItems')
    if (stored) {
      const detectedData = JSON.parse(stored)
      
      // Handle data from Gemini AI (has category)
      const itemsWithMeta = detectedData.map((item: any, idx: number) => ({
        id: `item-${Date.now()}-${idx}`,
        name: item.name || item,
        category: item.category || 'Other',
        location: 'Fridge' as const
      }))
      
      setItems(itemsWithMeta)
    }
  }, []);

  // Cleanup touch timer on unmount
  useEffect(() => {
    return () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
      }
    };
  }, [touchTimer]);

  const updateLocation = (id: string, location: "Fridge" | "Freezer" | "Pantry") => {
    setItems(items.map(item => 
      item.id === id ? { ...item, location } : item
    ));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleTouchStart = (id: string) => {
    const timer = setTimeout(() => {
      handleDelete(id);
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, 500); // 500ms long press
    setTouchTimer(timer);
    setTouchTargetId(id);
  };

  const handleTouchEnd = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      setTouchTimer(null);
    }
    setTouchTargetId(null);
  };

  const handleAddToPantry = () => {
    // Transform items to match store format (remove id)
    const itemsToAdd = items.map((item) => ({
      name: item.name,
      category: item.category,
      location: item.location,
    }));

    // Add to store
    addItems(itemsToAdd);

    // Increment waste saved counter
    incrementWasteSaved(items.length);

    // Save count before clearing items
    setItemCount(items.length);

    // Show success toast
    setShowToast(true);

    // Clear localStorage
    localStorage.removeItem("detectedItems");

    // Route to pantry after 1.5 seconds
    setTimeout(() => {
      router.push("/pantry");
    }, 1500);
  };

  const handleScanMore = () => {
    // Keep current items and go back to scan
    router.push("/scan/camera");
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex flex-col items-center justify-center py-20">
        <span className="text-6xl opacity-50 mb-4">🤷</span>
        <p className="text-gray-400 font-bold text-lg mb-6">No items detected</p>
        <Link
          href="/scan"
          className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md p-6 border-b border-gray-100">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">Confirm Items</h1>
          <p className="text-sm text-gray-500 mt-1">Select location • Tap delete to remove</p>
        </div>
      </div>

      {/* Item List */}
      <div className="p-5 flex flex-col gap-4">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-in fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              {/* Item name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {item.name}
                </h3>
              </div>

              {/* Delete button */}
              <button
                onTouchStart={() => handleTouchStart(item.id)}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                onClick={() => handleDelete(item.id)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Location toggles */}
            <div className="flex gap-2">
              {['Fridge', 'Freezer', 'Pantry'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => updateLocation(item.id, loc as any)}
                  className={`flex-1 text-xs font-bold py-2 rounded-full transition-all ${
                    item.location === loc
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-5 pb-8 z-50">
        <div className="flex gap-3">
          {/* Secondary: Scan More */}
          <button
            onClick={handleScanMore}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-900 font-bold py-4 px-6 rounded-2xl hover:border-gray-300 transition-colors"
          >
            Scan More
          </button>

          {/* Primary: Add to Pantry */}
          <button
            onClick={handleAddToPantry}
            className="flex-[2] bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
          >
            Add Items
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div 
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-2xl animate-[slideDown_0.3s_ease-out]"
        >
          ✓ Added {itemCount} items to pantry!
        </div>
      )}
    </div>
  );
}
