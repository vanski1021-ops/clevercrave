"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { Recipe } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const favoriteRecipes = useUserStore((state) => state.favoriteRecipes);
  const [favoriteRecipesData, setFavoriteRecipesData] = useState<Recipe[]>([]);

  useEffect(() => {
    // Load favorite recipes from localStorage
    const recipes = JSON.parse(localStorage.getItem("generatedRecipes") || "[]");
    const favorites = favoriteRecipes
      .map((id) => {
        // Try to find by ID first
        let found = recipes.find((r: Recipe) => r.id === id);
        // Fallback to index if ID doesn't match
        if (!found) {
          const index = parseInt(id);
          if (!isNaN(index) && recipes[index]) {
            found = recipes[index];
          }
        }
        return found;
      })
      .filter((r): r is Recipe => r !== undefined);
    setFavoriteRecipesData(favorites);
  }, [favoriteRecipes]);

  return (
    <div className="min-h-screen bg-[#FFF7ED] p-6 pb-32 animate-in fade-in duration-300">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Profile</h1>

      <div className="flex flex-col gap-6">
        {/* Section 1 — Account */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Account</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <button
              disabled
              className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
            >
              <span className="text-gray-400 font-medium">Profile Settings</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Coming Soon
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </button>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
            >
              <span className="text-gray-400 font-medium">Household Sharing</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Coming Soon
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </button>
          </div>
        </div>

        {/* Section — Saved Recipes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Saved Recipes
            </h2>
            {favoriteRecipes.length > 0 && (
              <span className="text-xs text-gray-400 font-bold">
                {favoriteRecipes.length} saved
              </span>
            )}
          </div>
          
          {favoriteRecipes.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <p className="text-gray-400 font-medium">No saved recipes yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Tap the ❤️ on recipes you love
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {favoriteRecipesData.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-400">Loading favorites...</p>
                  </div>
                ) : (
                  favoriteRecipesData.slice(0, 3).map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => router.push(`/recipes/${recipe.id}`)}
                      className="w-full p-4 flex items-center gap-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 active:bg-orange-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🍳</span>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">
                          {recipe.title}
                        </p>
                        <p className="text-xs text-gray-500">Tap to view</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
              
              {favoriteRecipes.length > 3 && (
                <button
                  onClick={() => alert('Coming soon! A dedicated favorites page is being built.')}
                  className="w-full mt-3 py-3 bg-white rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm active:bg-gray-50 transition-colors"
                >
                  View All {favoriteRecipes.length} Recipes →
                </button>
              )}
            </>
          )}
        </div>

        {/* Section 2 — Premium */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-extrabold text-white mb-2">Premium</h2>
            <p className="text-white/90 font-medium text-sm mb-3">
              Unlimited AI recipes • No ads • Advanced filters
            </p>
            <p className="text-white text-lg font-bold">$4.99 / month</p>
          </div>
          <button
            disabled
            className="w-full bg-white/20 backdrop-blur-sm text-white font-bold py-3 rounded-xl cursor-not-allowed opacity-60"
          >
            Coming Soon
          </button>
        </div>

        {/* Section 3 — Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Features</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <button
              disabled
              className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
            >
              <span className="text-gray-400 font-medium">Weekly AI Planning</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Coming Soon
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </button>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
            >
              <span className="text-gray-400 font-medium">Recipe History</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Coming Soon
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </button>
          </div>
        </div>

        {/* Section 4 — Support */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Support</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <button
              disabled
              className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
            >
              <span className="text-gray-400 font-medium">Help & FAQ</span>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
            >
              <span className="text-gray-400 font-medium">Send Feedback</span>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
            <button
              disabled
              className="w-full flex items-center justify-between p-4 text-left cursor-not-allowed"
            >
              <span className="text-gray-400 font-medium">Rate CleverCrave</span>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Section 5 — About */}
        <div className="text-center py-6 space-y-2">
          <p className="text-sm text-gray-400 font-medium">CleverCrave v1.0.0</p>
          <p className="text-sm text-gray-400">Made with ❤️ to reduce food waste</p>
        </div>
      </div>
    </div>
  );
}
