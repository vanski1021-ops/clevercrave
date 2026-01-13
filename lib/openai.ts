import OpenAI from 'openai'

// Initialize OpenAI (server-side only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export interface Recipe {
  id: string
  title: string
  description: string
  tags: string[]
  totalTime: string
  ingredientsUsed: string[]
  missingIngredients: string[]
  steps: Array<{ instruction: string; duration?: string }>
  image: string
  generatedAt?: number
}

// Helper function to get image keyword from recipe title
function getImageKeyword(title: string): string {
  const keywords = title.toLowerCase();
  if (keywords.includes('chicken')) return 'chicken-dish';
  if (keywords.includes('fish') || keywords.includes('salmon') || keywords.includes('tuna')) return 'fish-dish';
  if (keywords.includes('pasta') || keywords.includes('spaghetti')) return 'pasta';
  if (keywords.includes('rice') || keywords.includes('bowl')) return 'rice-bowl';
  if (keywords.includes('salad') || keywords.includes('spinach')) return 'salad';
  if (keywords.includes('soup') || keywords.includes('stew')) return 'soup';
  if (keywords.includes('burger') || keywords.includes('sandwich')) return 'burger';
  if (keywords.includes('pizza')) return 'pizza';
  if (keywords.includes('beef') || keywords.includes('steak')) return 'beef-steak';
  if (keywords.includes('pork')) return 'pork-dish';
  if (keywords.includes('shrimp') || keywords.includes('seafood')) return 'seafood';
  if (keywords.includes('vegetable') || keywords.includes('veggie')) return 'vegetables';
  if (keywords.includes('noodle')) return 'noodles';
  return 'food-dish';
}

// Helper function to generate DALL-E image for a recipe
async function generateRecipeImage(recipe: Recipe): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional food photography of ${recipe.title}. The dish is beautifully plated on a white ceramic plate with natural lighting, shallow depth of field, and a rustic wooden table background. Magazine quality, appetizing, restaurant-style presentation.`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    
    return response.data?.[0]?.url || '';
  } catch (error) {
    console.error('DALL-E generation failed:', error);
    return ''; // Fallback to Unsplash if fails
  }
}

export async function generateRecipes(
  pantryItems: string[],
  mealType: string = 'Dinner',
  dietaryPreferences: string[] = []
): Promise<Recipe[]> {
  
  try {
    const dietaryRules = dietaryPreferences.length > 0 
      ? `\nDIETARY: ${dietaryPreferences.join(', ')}` 
      : ''
    
    const prompt = `You are a creative chef AI. Generate EXACTLY 3 different ${mealType.toLowerCase()} recipes using these ingredients:

AVAILABLE: ${pantryItems.join(', ')}${dietaryRules}

CULINARY RULES - NEVER VIOLATE:

1. Only suggest ingredient combinations that are:
   - Commonly paired in real world cuisines
   - Culinary compatible and logical
   - Something people actually want to eat
   - Used in established recipes or cooking traditions

2. FORBIDDEN combinations (never suggest):
   - Peanut butter with seafood (scallops, fish, shrimp)
   - Sweet ingredients with raw seafood
   - Dessert ingredients in savory mains
   - Dairy with strongly acidic ingredients

3. When suggesting recipes with limited ingredients:
   - You CAN add 2-5 missing ingredients if it makes a GREAT recipe
   - Prioritize common, affordable additions
   - Missing ingredients should be pantry staples or easy to find
   - The recipe should be worth shopping for those items

4. Recipe quality standards:
   - Must be delicious and appetizing
   - Clear flavor profiles (Italian, Asian, American, etc.)
   - Balanced nutrition when possible
   - Appropriate cooking methods for ingredients

RECIPE REQUIREMENTS:

Recipe 1 - READY TO COOK:
- Use ONLY available ingredients (0 missing)
- Must be simple and quick
- NO substitutions, NO additions, NO "or" alternatives
- If exact match is impossible, make a very simple dish with what's available

Recipe 2 - ALMOST THERE:
- Can have 1-2 missing ingredients (common items like herbs, wine, cream)
- Should elevate the meal significantly
- Missing items must be affordable and widely available

Recipe 3 - CHEF'S PICK:
- Can have 2-5 missing ingredients
- Should be impressive and restaurant-quality
- Missing ingredients must be worth buying
- Still doable at home with available equipment

OTHER RULES:
- Total time: 10-30 minutes
- Make them sound delicious
- Use realistic cooking techniques

FORMAT (return ONLY this JSON, no other text):
{
  "recipes": [
    {
      "title": "Recipe Name",
      "description": "One-line description",
      "tags": ["Fast", "Comfort", "Healthy"],
      "totalTime": "15 min",
      "ingredientsUsed": ["exact_name_from_list"],
      "missingIngredients": [], // MUST BE EMPTY FOR RECIPE 1
      "steps": [
        {"instruction": "Step 1", "duration": "5m"}
      ]
    }
  ]
}

Ensure Recipe 1 has missingIngredients: [] (empty array).`;

    // Retry loop for Recipe 1 validation
    let attempts = 0;
    const maxAttempts = 2;
    
    while (attempts <= maxAttempts) {
      attempts++;
      console.log(`Generation attempt ${attempts}...`);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef with deep culinary knowledge. You only suggest ingredient combinations that are commonly used in real world cuisines and that people actually want to eat. You NEVER combine incompatible ingredients like peanut butter with seafood. You always respond with valid JSON only, no other text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
      
      const responseText = completion.choices[0].message.content || '{}'
      
      // Parse response
      let recipesData
      try {
        const parsed = JSON.parse(responseText)
        recipesData = Array.isArray(parsed) ? parsed : parsed.recipes || []
      } catch {
        recipesData = []
      }
      
      // Generate unique timestamp for this batch
      const timestamp = Date.now();
      
      // Transform to our Recipe format with unique IDs
      const recipes: Recipe[] = recipesData.map((r: any, index: number) => {
        const title = r.title || 'Delicious Recipe';
        return {
          id: `${timestamp}-${index}`, // Unique ID like "1704123456789-0"
          title,
          description: r.description || 'A tasty meal',
          tags: r.tags || ['Tasty'],
          totalTime: r.totalTime || '20 min',
          ingredientsUsed: r.ingredientsUsed || [],
          missingIngredients: r.missingIngredients || [],
          steps: r.steps || [],
          image: `https://source.unsplash.com/800x1200/?${getImageKeyword(title)}`,
          generatedAt: timestamp
        };
      })

      // Validation 1: Check for bad culinary combinations
      const hasBadCombo = recipes.some(r => {
        const allIngredients = [...r.ingredientsUsed, ...r.missingIngredients]
          .map(i => i.toLowerCase());
        
        // Check for peanut butter + seafood
        const hasPeanutButter = allIngredients.some(i => 
          i.includes('peanut') && (i.includes('butter') || i.includes('pb'))
        );
        const hasSeafood = allIngredients.some(i => 
          i.includes('scallop') || i.includes('shrimp') || 
          i.includes('fish') || i.includes('salmon') || 
          i.includes('tuna') || i.includes('crab') || 
          i.includes('lobster') || i.includes('seafood')
        );
        
        if (hasPeanutButter && hasSeafood) {
          console.warn(`Bad combination detected in "${r.title}": peanut butter + seafood`);
          return true;
        }
        
        return false;
      });
      
      if (hasBadCombo) {
        console.warn('Bad recipe combination detected. Retrying generation...');
        continue; // Retry the generation loop
      }

      // Validation 2: Check if Recipe 1 has missing ingredients
      if (recipes.length > 0) {
        const recipe1 = recipes[0];
        const missingCount = recipe1.missingIngredients.length;
        
        console.log('Recipe 1 validation:', {
          title: recipe1.title,
          totalIngredients: recipe1.ingredientsUsed.length + missingCount,
          missing: missingCount
        });

        if (missingCount === 0) {
          // Generate DALL-E image ONLY for recipe 3 (Chef's Pick)
          if (recipes.length >= 3 && recipes[2]) {
            console.log('Generating DALL-E image for Chef\'s Pick...');
            const dalleImage = await generateRecipeImage(recipes[2]);
            if (dalleImage) {
              recipes[2].image = dalleImage;
            }
          }
          
          // Log generation summary
          console.log('Recipe generation complete:', {
            recipes: recipes.length,
            dalleImages: recipes.filter(r => r.image.includes('oaidalleapiprodscus')).length,
            estimatedCost: '$0.04075'
          });
          
          return recipes; // Success!
        }
        
        console.warn(`Recipe 1 failed validation (has ${missingCount} missing items). Retrying...`);
      } else {
        console.warn('No recipes generated. Retrying...');
      }
    }

    // Fallback if all attempts fail
    console.warn('All generation attempts failed validation. Generating fallback recipe.');
    return generateFallbackRecipes(pantryItems);
    
  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    
    // Detailed error messages based on error type
    if (error?.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please add credits to your OpenAI account.')
    }
    
    if (error?.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.')
    }
    
    if (error?.status === 429 || error?.code === 'rate_limit_exceeded') {
      throw new Error('Too many requests. Please try again in a moment.')
    }
    
    if (error?.code === 'model_not_found') {
      throw new Error('AI model not available. Please contact support.')
    }
    
    if (error?.message && error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.')
    }
    
    // Generic fallback
    throw new Error('Failed to generate recipes. Please try again.')
  }
}

function generateFallbackRecipes(pantryItems: string[]): Recipe[] {
  // Use first 3 items or whatever is available
  const available = pantryItems.slice(0, 3)
  const mainItem = available[0] || 'Ingredient'
  const timestamp = Date.now()
  
  const recipe1Title = `Simple ${mainItem} Dish`;
  const recipe2Title = `${mainItem} Surprise`;
  const recipe3Title = 'Chef\'s Special';
  
  return [
    {
      id: `${timestamp}-0`,
      title: recipe1Title,
      description: `A quick and easy dish using ${available.join(' and ')}`,
      tags: ['Fast', 'Simple', 'Fallback'],
      totalTime: '15 min',
      ingredientsUsed: available,
      missingIngredients: [],
      steps: [
        { instruction: `Prepare ${available.join(', ')}`, duration: '5m' },
        { instruction: 'Cook together in a pan', duration: '10m' },
        { instruction: 'Season to taste and serve', duration: '1m' }
      ],
      image: `https://source.unsplash.com/800x1200/?${getImageKeyword(recipe1Title)}`,
      generatedAt: timestamp
    },
    {
      id: `${timestamp}-1`,
      title: recipe2Title,
      description: 'A creative way to use your ingredients',
      tags: ['Creative'],
      totalTime: '20 min',
      ingredientsUsed: [mainItem],
      missingIngredients: ['Salt', 'Pepper', 'Oil'],
      steps: [
        { instruction: 'Heat oil in a pan', duration: '2m' },
        { instruction: `Cook ${mainItem} until done`, duration: '15m' }
      ],
      image: `https://source.unsplash.com/800x1200/?${getImageKeyword(recipe2Title)}`,
      generatedAt: timestamp
    },
    {
      id: `${timestamp}-2`,
      title: recipe3Title,
      description: 'Something a bit more fancy',
      tags: ['Chef'],
      totalTime: '30 min',
      ingredientsUsed: available,
      missingIngredients: ['Herbs', 'Spices'],
      steps: [
        { instruction: 'Marinate ingredients', duration: '10m' },
        { instruction: 'Cook slowly for best flavor', duration: '20m' }
      ],
      image: `https://source.unsplash.com/800x1200/?${getImageKeyword(recipe3Title)}`,
      generatedAt: timestamp
    }
  ]
}