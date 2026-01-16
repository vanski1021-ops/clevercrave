import { NextResponse } from "next/server";
import { generateRecipes } from "@/lib/openai";

interface GenerateRecipesRequest {
  pantryItems?: string[];
  mealType?: string;
  dietaryPreferences?: string[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRecipesRequest;
    const pantryItems = body.pantryItems ?? [];
    const mealType = body.mealType ?? "Dinner";
    const dietaryPreferences = body.dietaryPreferences ?? [];

    if (!Array.isArray(pantryItems) || pantryItems.length === 0) {
      return NextResponse.json(
        { error: "pantryItems must be a non-empty array" },
        { status: 400 }
      );
    }

    const recipes = await generateRecipes(pantryItems, mealType, dietaryPreferences);
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Recipe generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate recipes" },
      { status: 500 }
    );
  }
}
