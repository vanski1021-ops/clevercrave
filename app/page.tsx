"use client";

import HomeHeader from "@/components/home/HomeHeader";
import HeroGenerateCard from "@/components/home/HeroGenerateCard";
import HomeFilters from "@/components/home/HomeFilters";
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
  return (
    <div className="bg-[#FFF7ED] min-h-full">
      {/* Header */}
      <HomeHeader />

      {/* Hero CTA */}
      <HeroGenerateCard />

      {/* Filters */}
      <HomeFilters />

      {/* Recommended */}
      <RecommendedHeader />

      {/* Recipe Carousel */}
      <div className="flex gap-5 px-5 pb-10 overflow-x-auto no-scrollbar snap-x">
        {MOCK_RECIPES.map((recipe, idx) => (
          <RecipeCard
            key={idx}
            recipe={recipe}
            onCook={() => {}}
            onAddMissing={() => {}}
            onShare={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
