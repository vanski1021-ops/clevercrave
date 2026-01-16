type MealContext = {
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Late-night";
  heading: string;
  cta: string;
};

export function getMealContext(date: Date = new Date()): MealContext {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) {
    return {
      mealType: "Breakfast",
      heading: "Let’s start easy.",
      cta: "What can I make for breakfast?",
    };
  }

  if (hour >= 11 && hour < 16) {
    return {
      mealType: "Lunch",
      heading: "Midday Fuel.",
      cta: "What’s a good lunch right now?",
    };
  }

  if (hour >= 16 && hour < 22) {
    return {
      mealType: "Dinner",
      heading: "Tonight's Vibe",
      cta: "What should I cook tonight?",
    };
  }

  return {
    mealType: "Late-night",
    heading: "Late-Night Bite",
    cta: "Generate Late-Night Bites",
  };
}
