'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export type DetectedIngredient = {
  name: string;
  category: 'Produce' | 'Protein' | 'Dairy' | 'Grain' | 'Pantry' | 'Other';
};

export async function detectIngredientsAction(base64Image: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      Analyze this image and list ALL visible food items.
      
      RULES:
      1. Identify items specifically (e.g., "Gala Apples" instead of "Fruit").
      2. Categorize each into exactly one of: Produce, Protein, Dairy, Grain, Pantry, Other.
      3. Return ONLY a JSON array of objects.
      
      Example Output:
      [
        {"name": "Milk", "category": "Dairy"},
        {"name": "Spinach", "category": "Produce"}
      ]
    `;

    // The SDK expects the base64 string without the "data:image/jpeg;base64," prefix
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("No data returned from AI");
    }

    // Parse JSON directly (Gemini 1.5 Flash is very reliable with JSON mode)
    const detectedItems: DetectedIngredient[] = JSON.parse(text);

    return { success: true, data: detectedItems };

  } catch (error: any) {
    console.error("Gemini Scan Error:", error);
    return { success: false, error: error.message || "Failed to analyze image" };
  }
}
