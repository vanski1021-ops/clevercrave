export interface Recipe {
  id: string;
  title: string;
  description?: string;
  image: string;
  totalTime: string;
  tags: string[];
  ingredientsUsed: string[];
  missingIngredients: string[];
  steps?: Array<{ instruction: string; duration?: string }>;
  generatedAt?: number;
}
