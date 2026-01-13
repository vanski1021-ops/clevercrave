"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import HomeHeader from "@/components/home/HomeHeader";
import HeroGenerateCard from "@/components/home/HeroGenerateCard";
import RecommendedHeader from "@/components/home/RecommendedHeader";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types";

/* ---------------- Mock Data (Temporary) ---------------- */

const MOCK_RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Garlic Butter Shrimp Pasta",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1200",
    totalTime: "15 min",
    tags: ["Comfort"],
    ingredientsUsed: ["Pasta", "Garlic", "Butter", "Shrimp"],
    missingIngredients: ["White Wine"],
  },
  {
    id: "2",
    title: "Teriyaki Chicken Bowl",
    image:
      "https://images.unsplash.com/photo-1604908177522-4326e1b9b89e?q=80&w=1200",
    totalTime: "20 min",
    tags: ["Healthy"],
    ingredientsUsed: ["Chicken", "Rice", "Broccoli"],
    missingIngredients: ["Sesame Seeds"],
  },
  {
    id: "3",
    title: "Caprese Grilled Cheese",
    image:
      "https://images.unsplash.com/photo-1604908177225-5f9f1c7d2c43?q=80&w=1200",
    totalTime: "10 min",
    tags: ["Fast"],
    ingredientsUsed: ["Bread", "Mozzarella", "Tomato"],
    missingIngredients: [],
  },
];

/* ---------------- Page ---------------- */

export default function HomePage() {
  const router = useRouter();
  // State for dynamic recipes (no fallback - check for actual generated recipes)
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [hasGeneratedRecipes, setHasGeneratedRecipes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  useEffect(() => {
    // Load generated recipes from localStorage
    const loadRecipes = () => {
      const stored = localStorage.getItem('generatedRecipes');
      if (stored) {
        try {
          const generated = JSON.parse(stored);
          if (generated.length > 0) {
            setRecipes(generated);
            setHasGeneratedRecipes(true);
          } else {
            setRecipes([]);
            setHasGeneratedRecipes(false);
          }
        } catch (err) {
          console.error('Failed to load recipes:', err);
          setRecipes([]);
          setHasGeneratedRecipes(false);
        }
      } else {
        setRecipes([]);
        setHasGeneratedRecipes(false);
      }
    };
    
    // Load on mount
    loadRecipes();
    
    // Listen for new generations
    const handleNewRecipes = () => {
      loadRecipes();
    };
    
    // Listen for loading state
    const handleLoadingStart = () => setIsLoading(true);
    const handleLoadingEnd = () => setIsLoading(false);
    
    window.addEventListener('recipesGenerated', handleNewRecipes);
    window.addEventListener('recipesGenerating', handleLoadingStart);
    window.addEventListener('recipesGeneratedComplete', handleLoadingEnd);
    
    return () => {
      window.removeEventListener('recipesGenerated', handleNewRecipes);
      window.removeEventListener('recipesGenerating', handleLoadingStart);
      window.removeEventListener('recipesGeneratedComplete', handleLoadingEnd);
    };
  }, []);

  // Check for completed recipe and show toast
  useEffect(() => {
    const completed = localStorage.getItem('justCompletedRecipe');
    if (completed) {
      setShowCompletionToast(true);
      localStorage.removeItem('justCompletedRecipe');
      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setShowCompletionToast(false);
      }, 3000);
    }
  }, []);

  const handleCook = (recipe: Recipe) => {
    // Navigate to recipe detail page using unique ID
    router.push(`/recipes/${recipe.id}`);
  };

  const handleShare = async (recipe: Recipe) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this ${recipe.title} recipe!`,
          url: `${window.location.origin}/recipes/${recipe.id}`
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      alert('Sharing not supported on this device');
    }
  };

  return (
    <div className="bg-[#FFF7ED] min-h-full animate-in fade-in duration-500">
      {/* Completion Toast */}
      {showCompletionToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
            <span>🎉</span>
            <span>Recipe completed successfully!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <HomeHeader />

      {/* Hero CTA */}
      <HeroGenerateCard />

      {/* Recommended */}
      {hasGeneratedRecipes && <RecommendedHeader />}

      {/* Recipe Layout - Featured + Grid OR Empty State */}
      <div className="px-5 pb-10 space-y-6">
        {!hasGeneratedRecipes && !isLoading ? (
          // Empty State - No recipes generated yet
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="text-8xl mb-6">🍳</div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-3 text-center">
              Your Personal Recipe Assistant
            </h2>
            
            <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
              Add ingredients to your inventory and I&apos;ll create personalized recipes 
              based on what you have. Reduce waste, save money, cook delicious meals.
            </p>
            
            {/* Visual instruction pointing to FAB */}
            <div className="flex items-center gap-3 bg-orange-50 border-2 border-orange-200 rounded-2xl px-6 py-4 mb-8">
              <span className="text-2xl">👉</span>
              <p className="text-orange-800 font-bold text-sm">
                Tap the + button below to get started
              </p>
            </div>
            
            {/* 3-step preview */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="text-center">
                <div className="text-2xl mb-1">📸</div>
                <p className="font-medium">Snap</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✏️</div>
                <p className="font-medium">Type</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">✨</div>
                <p className="font-medium">Generate</p>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          // Skeleton loading states
          <>
            {/* Featured skeleton */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span>✨ Featured</span>
              </h3>
              <div className="w-full h-[500px] bg-gray-100 animate-pulse rounded-3xl" />
            </div>
            
            {/* Grid skeletons */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                More Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-[380px] bg-gray-100 animate-pulse rounded-3xl" />
                <div className="h-[380px] bg-gray-100 animate-pulse rounded-3xl" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* FEATURED: Card 3 - Chef's Pick (Large) */}
            {recipes[2] && (
              <div className="w-full animate-in fade-in duration-500">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span>✨ Featured</span>
                </h3>
                <RecipeCard
                  recipe={recipes[2]}
                  cardIndex={2}
                  onCook={() => handleCook(recipes[2])}
                  onAddMissing={() => {}}
                  onShare={(r) => handleShare(r)}
                  className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/10 bg-white cursor-pointer active:scale-[0.98] transition-all duration-200"
                />
              </div>
            )}
            
            {/* Cards 1 & 2 - Quick Options (Smaller, side by side) */}
            {recipes.length >= 2 && (
              <div className="animate-in fade-in duration-500" style={{ animationDelay: '100ms' }}>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                  More Options
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1 */}
                  {recipes[0] && (
                    <div className="animate-in slide-in-from-left duration-300">
                      <RecipeCard
                        recipe={recipes[0]}
                        cardIndex={0}
                        onCook={() => handleCook(recipes[0])}
                        onAddMissing={() => {}}
                        onShare={(r) => handleShare(r)}
                        className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-xl shadow-orange-900/10 bg-white cursor-pointer active:scale-[0.98] transition-all duration-200"
                      />
                    </div>
                  )}
                  
                  {/* Card 2 */}
                  {recipes[1] && (
                    <div className="animate-in slide-in-from-right duration-300">
                      <RecipeCard
                        recipe={recipes[1]}
                        cardIndex={1}
                        onCook={() => handleCook(recipes[1])}
                        onAddMissing={() => {}}
                        onShare={(r) => handleShare(r)}
                        className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-xl shadow-orange-900/10 bg-white cursor-pointer active:scale-[0.98] transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
