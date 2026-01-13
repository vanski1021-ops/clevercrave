"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Heart, Clock, Users, ChefHat } from "lucide-react";
import { useListStore } from "@/stores/listStore";
import { useUserStore } from "@/stores/userStore";
import { Recipe } from "@/types";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const addItem = useListStore((state) => state.addItem);
  const toggleFavorite = useUserStore((state) => state.toggleFavorite);
  const favoriteRecipes = useUserStore((state) => state.favoriteRecipes);
  const favorited = favoriteRecipes.includes(recipeId);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [justFavorited, setJustFavorited] = useState(false);

  useEffect(() => {
    // Load recipes from localStorage and find by unique ID
    const recipes = JSON.parse(localStorage.getItem("generatedRecipes") || "[]");
    
    // Find recipe by unique ID
    const found = recipes.find((r: Recipe) => r.id === recipeId);

    if (found) {
      setRecipe(found);
      // Initialize checked state based on what's in pantry (ingredientsUsed)
      const initialChecked: Record<string, boolean> = {};
      found.ingredientsUsed.forEach((ing: string) => {
        initialChecked[ing] = true;
      });
      setCheckedIngredients(initialChecked);
    } else {
      // Redirect if not found
      router.push('/');
    }
  }, [recipeId, router]);

  const handleShare = async () => {
    if (!recipe) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const handleAddMissingToList = () => {
    if (!recipe) return;
    
    const missingItems = recipe.missingIngredients;
    if (missingItems.length === 0) return;

    missingItems.forEach((item) => addItem(item));
    alert(`Added ${missingItems.length} items to your shopping list!`);
  };

  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [ingredient]: !prev[ingredient]
    }));
  };

  const handleFavorite = () => {
    const wasFavorited = favorited;
    toggleFavorite(recipeId);
    
    if (!wasFavorited) {
      setJustFavorited(true);
      setTimeout(() => setJustFavorited(false), 1000);
    }
    
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-32">
      {/* Top Bar */}
      <div className="fixed top-0 w-full z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleFavorite}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <Heart 
              className={`w-5 h-5 transition-all ${
                favorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white'
              } ${justFavorited ? 'animate-pulse' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[40vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${recipe.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF7ED] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-10 relative z-10 space-y-6">
        
        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="text-gray-500 font-medium">
              {recipe.description}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
          <div className="flex flex-col items-center gap-1 flex-1 border-r border-orange-50">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-gray-900">{recipe.totalTime}</span>
            <span className="text-[10px] text-gray-400 uppercase font-black">Time</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1 border-r border-orange-50">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-gray-900">2 Servings</span>
            <span className="text-[10px] text-gray-400 uppercase font-black">Yield</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-gray-900">Easy</span>
            <span className="text-[10px] text-gray-400 uppercase font-black">Level</span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex justify-between items-center">
            Ingredients
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {recipe.ingredientsUsed.length + recipe.missingIngredients.length} Items
            </span>
          </h2>
          
          <div className="space-y-3">
            {/* Used Ingredients (In Pantry) */}
            {recipe.ingredientsUsed.map((ing, idx) => (
              <div 
                key={`used-${idx}`}
                onClick={() => toggleIngredient(ing)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50 cursor-pointer transition-colors"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  checkedIngredients[ing] 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "border-gray-300"
                }`}>
                  {checkedIngredients[ing] && "✓"}
                </div>
                <span className={`font-bold flex-1 ${checkedIngredients[ing] ? "text-gray-900" : "text-gray-500"}`}>
                  {ing}
                </span>
                <span className="text-xs font-black text-green-500 bg-green-100 px-2 py-1 rounded-md">
                  HAVE
                </span>
              </div>
            ))}

            {/* Missing Ingredients */}
            {recipe.missingIngredients.map((ing, idx) => (
              <div 
                key={`missing-${idx}`}
                onClick={() => toggleIngredient(ing)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50 cursor-pointer transition-colors"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  checkedIngredients[ing] 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "border-gray-300"
                }`}>
                  {checkedIngredients[ing] && "✓"}
                </div>
                <span className={`font-bold flex-1 ${checkedIngredients[ing] ? "text-gray-900" : "text-gray-500"}`}>
                  {ing}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(ing);
                    alert(`Added ${ing} to list!`);
                  }}
                  className="text-xs font-black text-orange-500 bg-orange-100 px-2 py-1 rounded-md hover:bg-orange-200 active:scale-95 transition-all"
                >
                  + ADD
                </button>
              </div>
            ))}
          </div>

          {recipe.missingIngredients.length > 0 && (
            <button 
              onClick={handleAddMissingToList}
              className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl active:scale-95 transition-transform"
            >
              Add {recipe.missingIngredients.length} Missing Items to List
            </button>
          )}
        </div>

        {/* Instructions */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Instructions</h2>
            <div className="space-y-8">
              {recipe.steps.map((step: { instruction: string; duration?: string }, idx: number) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-0 top-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md shadow-orange-200">
                    {idx + 1}
                  </div>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.duration && (
                    <div className="mt-2 flex items-center gap-1 text-orange-500 text-xs font-bold">
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 pb-8 z-40">
          <button 
            onClick={() => router.push(`/recipes/${recipeId}/cook`)}
            className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-orange-200 active:scale-[0.98] transition-transform"
          >
            Start Cooking
          </button>
        </div>
      )}
    </div>
  );
}
