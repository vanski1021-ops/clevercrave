"use server";

interface DetectedItem {
  name: string;
  category?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface DetectionResult {
  success: boolean;
  data?: DetectedItem[];
  error?: string;
}

export async function detectIngredientsAction(base64Image: string): Promise<DetectionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, error: "GEMINI_API_KEY not configured" };
  }

  if (!base64Image) {
    return { success: false, error: "No image data provided" };
  }

  try {
    const prompt =
      "Identify grocery items in the image. Return ONLY valid JSON: " +
      '[{"name":"Item Name","category":"Category"}]';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: "image/jpeg", data: base64Image } },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return { success: false, error: "Failed to analyze image" };
    }

    const responseData = (await response.json()) as GeminiResponse;
    const text = responseData.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("") ?? "";

    if (!text) {
      return { success: false, error: "No response content from AI" };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      console.warn("Failed to parse AI response as JSON:", error);
      return { success: false, error: "AI response was not valid JSON" };
    }

    const rawItems = Array.isArray(parsed)
      ? parsed
      : (parsed as { items?: unknown }).items ?? [];

    if (!Array.isArray(rawItems)) {
      return { success: false, error: "AI response format unexpected" };
    }

    const normalized: DetectedItem[] = [];

    rawItems.forEach((item) => {
      if (typeof item === "string") {
        const name = item.trim();
        if (name) {
          normalized.push({ name, category: "Other" });
        }
        return;
      }

      if (item && typeof item === "object" && "name" in item) {
        const name = typeof item.name === "string" ? item.name.trim() : "";
        const category =
          typeof item.category === "string" ? item.category.trim() : "Other";
        if (name) {
          normalized.push({ name, category });
        }
      }
    });

    return { success: true, data: normalized };
  } catch (error) {
    console.error("Ingredient detection failed:", error);
    return { success: false, error: "Failed to analyze image" };
  }
}
