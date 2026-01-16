"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, X } from "lucide-react";
import { Recipe } from "@/types";

export default function CookingModePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;

  const recipe = useMemo<Recipe | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const recipes: Recipe[] = JSON.parse(
        localStorage.getItem("generatedRecipes") || "[]"
      );
      return recipes.find((r) => r.id === recipeId) ?? null;
    } catch (error) {
      console.warn("Failed to load recipe:", error);
      return null;
    }
  }, [recipeId]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const totalSteps = recipe?.steps?.length || 0;
  const currentStepData = recipe?.steps?.[currentStep];
  useEffect(() => {
    if (!recipe) {
      router.push("/");
    }
  }, [recipe, router]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
  };

  const handleComplete = () => {
    setCompletedSteps((prev) => {
      const next = prev.includes(currentStep)
        ? prev.filter((s) => s !== currentStep)
        : [...prev, currentStep];

      if (next.length === totalSteps && totalSteps > 0) {
        setShowCompletion(true);
      }

      return next;
    });
    if ("vibrate" in navigator) navigator.vibrate(10);
  };

  const handleFinish = () => {
    // Save completion state to localStorage before navigating
    localStorage.setItem('justCompletedRecipe', recipeId);
    if ('vibrate' in navigator) navigator.vibrate([10, 50, 10]);
    router.push('/');
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Recipe Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            Great job! You&apos;ve finished cooking {recipe.title}
          </p>
          
          <button
            onClick={handleFinish}
            className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            Done, Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col">
      {/* Top Bar */}
      <div className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-sm font-bold text-gray-900">
          Step {currentStep + 1} of {totalSteps}
        </div>

        {currentStepData?.duration && (
          <div className="flex items-center gap-1 text-sm font-bold text-orange-500">
            <Clock className="w-4 h-4" />
            {currentStepData.duration}
          </div>
        )}
        {!currentStepData?.duration && <div className="w-10"></div>}
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center p-8 pt-24 pb-32">
        <div className="max-w-2xl w-full">
          <div className="text-7xl font-black text-gray-900 mb-6 text-center">
            {currentStep + 1}
          </div>
          <p className="text-3xl leading-relaxed text-gray-700 text-center">
            {currentStepData?.instruction || "No instruction available"}
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 p-6 pb-8 z-50">
        <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 py-4 rounded-2xl bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={handleComplete}
            className={`flex-1 py-4 rounded-2xl font-bold active:scale-95 transition-transform ${
              completedSteps.includes(currentStep)
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {completedSteps.includes(currentStep) ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Done
              </span>
            ) : (
              "Mark Done"
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === totalSteps - 1}
            className="flex-1 py-4 rounded-2xl bg-orange-500 text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
