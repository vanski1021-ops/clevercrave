// Food categorization utility for auto-categorization and display

export type FoodCategory = 
  | 'Protein' 
  | 'Produce' 
  | 'Dairy' 
  | 'Grain' 
  | 'Pantry' 
  | 'Beverage' 
  | 'Condiment' 
  | 'Frozen' 
  | 'Other'

// Comprehensive food database (~150 items)
// Keywords are matched against item names (case-insensitive, partial match)
const FOOD_DATABASE: Record<string, FoodCategory> = {
  // ==================== PROTEINS (~30 items) ====================
  // Poultry
  chicken: 'Protein',
  turkey: 'Protein',
  duck: 'Protein',
  
  // Red Meat
  beef: 'Protein',
  steak: 'Protein',
  pork: 'Protein',
  lamb: 'Protein',
  veal: 'Protein',
  venison: 'Protein',
  bison: 'Protein',
  
  // Processed Meat
  bacon: 'Protein',
  sausage: 'Protein',
  ham: 'Protein',
  salami: 'Protein',
  pepperoni: 'Protein',
  hotdog: 'Protein',
  'hot dog': 'Protein',
  meatball: 'Protein',
  
  // Seafood
  salmon: 'Protein',
  tuna: 'Protein',
  shrimp: 'Protein',
  crab: 'Protein',
  lobster: 'Protein',
  fish: 'Protein',
  cod: 'Protein',
  tilapia: 'Protein',
  trout: 'Protein',
  sardine: 'Protein',
  anchovy: 'Protein',
  scallop: 'Protein',
  oyster: 'Protein',
  mussel: 'Protein',
  clam: 'Protein',
  
  // Other Proteins
  egg: 'Protein',
  tofu: 'Protein',
  tempeh: 'Protein',
  seitan: 'Protein',
  
  // ==================== PRODUCE (~40 items) ====================
  // Fruits
  apple: 'Produce',
  banana: 'Produce',
  orange: 'Produce',
  lemon: 'Produce',
  lime: 'Produce',
  grape: 'Produce',
  strawberry: 'Produce',
  blueberry: 'Produce',
  raspberry: 'Produce',
  blackberry: 'Produce',
  cherry: 'Produce',
  peach: 'Produce',
  pear: 'Produce',
  plum: 'Produce',
  mango: 'Produce',
  pineapple: 'Produce',
  watermelon: 'Produce',
  melon: 'Produce',
  kiwi: 'Produce',
  avocado: 'Produce',
  coconut: 'Produce',
  papaya: 'Produce',
  pomegranate: 'Produce',
  fig: 'Produce',
  
  // Vegetables
  spinach: 'Produce',
  lettuce: 'Produce',
  kale: 'Produce',
  cabbage: 'Produce',
  broccoli: 'Produce',
  cauliflower: 'Produce',
  carrot: 'Produce',
  celery: 'Produce',
  cucumber: 'Produce',
  tomato: 'Produce',
  pepper: 'Produce',
  onion: 'Produce',
  garlic: 'Produce',
  ginger: 'Produce',
  potato: 'Produce',
  'sweet potato': 'Produce',
  yam: 'Produce',
  corn: 'Produce',
  pea: 'Produce',
  bean: 'Produce',
  zucchini: 'Produce',
  squash: 'Produce',
  eggplant: 'Produce',
  mushroom: 'Produce',
  asparagus: 'Produce',
  artichoke: 'Produce',
  beet: 'Produce',
  radish: 'Produce',
  turnip: 'Produce',
  parsnip: 'Produce',
  leek: 'Produce',
  scallion: 'Produce',
  shallot: 'Produce',
  bok: 'Produce', // bok choy
  arugula: 'Produce',
  cilantro: 'Produce',
  parsley: 'Produce',
  basil: 'Produce',
  mint: 'Produce',
  dill: 'Produce',
  
  // ==================== DAIRY (~20 items) ====================
  milk: 'Dairy',
  cheese: 'Dairy',
  cheddar: 'Dairy',
  mozzarella: 'Dairy',
  parmesan: 'Dairy',
  feta: 'Dairy',
  brie: 'Dairy',
  gouda: 'Dairy',
  swiss: 'Dairy',
  cream: 'Dairy',
  'sour cream': 'Dairy',
  yogurt: 'Dairy',
  butter: 'Dairy',
  margarine: 'Dairy',
  'cottage cheese': 'Dairy',
  'cream cheese': 'Dairy',
  ricotta: 'Dairy',
  whipped: 'Dairy',
  'half and half': 'Dairy',
  custard: 'Dairy',
  
  // ==================== GRAINS (~20 items) ====================
  bread: 'Grain',
  toast: 'Grain',
  bagel: 'Grain',
  croissant: 'Grain',
  muffin: 'Grain',
  biscuit: 'Grain',
  roll: 'Grain',
  bun: 'Grain',
  tortilla: 'Grain',
  pita: 'Grain',
  naan: 'Grain',
  rice: 'Grain',
  pasta: 'Grain',
  noodle: 'Grain',
  spaghetti: 'Grain',
  macaroni: 'Grain',
  oat: 'Grain',
  oatmeal: 'Grain',
  cereal: 'Grain',
  granola: 'Grain',
  quinoa: 'Grain',
  couscous: 'Grain',
  barley: 'Grain',
  wheat: 'Grain',
  flour: 'Grain',
  cracker: 'Grain',
  pretzel: 'Grain',
  
  // ==================== PANTRY (~25 items) ====================
  chip: 'Pantry',
  chips: 'Pantry',
  peanut: 'Pantry',
  almond: 'Pantry',
  walnut: 'Pantry',
  cashew: 'Pantry',
  pistachio: 'Pantry',
  nut: 'Pantry',
  seed: 'Pantry',
  sugar: 'Pantry',
  honey: 'Pantry',
  syrup: 'Pantry',
  chocolate: 'Pantry',
  candy: 'Pantry',
  cookie: 'Pantry',
  cake: 'Pantry',
  brownie: 'Pantry',
  popcorn: 'Pantry',
  'peanut butter': 'Pantry',
  jelly: 'Pantry',
  jam: 'Pantry',
  nutella: 'Pantry',
  raisin: 'Pantry',
  dried: 'Pantry',
  canned: 'Pantry',
  soup: 'Pantry',
  broth: 'Pantry',
  stock: 'Pantry',
  oil: 'Pantry',
  vinegar: 'Pantry',
  
  // ==================== BEVERAGES (~15 items) ====================
  juice: 'Beverage',
  soda: 'Beverage',
  cola: 'Beverage',
  coke: 'Beverage',
  pepsi: 'Beverage',
  sprite: 'Beverage',
  water: 'Beverage',
  tea: 'Beverage',
  coffee: 'Beverage',
  latte: 'Beverage',
  espresso: 'Beverage',
  smoothie: 'Beverage',
  shake: 'Beverage',
  beer: 'Beverage',
  wine: 'Beverage',
  whiskey: 'Beverage',
  vodka: 'Beverage',
  
  // ==================== CONDIMENTS (~15 items) ====================
  ketchup: 'Condiment',
  mustard: 'Condiment',
  mayo: 'Condiment',
  mayonnaise: 'Condiment',
  relish: 'Condiment',
  salsa: 'Condiment',
  guacamole: 'Condiment',
  hummus: 'Condiment',
  dressing: 'Condiment',
  sauce: 'Condiment',
  'soy sauce': 'Condiment',
  'hot sauce': 'Condiment',
  sriracha: 'Condiment',
  teriyaki: 'Condiment',
  bbq: 'Condiment',
  ranch: 'Condiment',
  
  // ==================== FROZEN (~10 items) ====================
  'ice cream': 'Frozen',
  icecream: 'Frozen',
  gelato: 'Frozen',
  sorbet: 'Frozen',
  popsicle: 'Frozen',
  'frozen pizza': 'Frozen',
  'frozen vegetable': 'Frozen',
  'frozen fruit': 'Frozen',
  'frozen dinner': 'Frozen',
  'tv dinner': 'Frozen',
}

/**
 * Categorize a food item based on its name
 * Uses keyword matching against a comprehensive database
 */
export function categorizeFood(name: string): FoodCategory {
  const lower = name.toLowerCase().trim()
  
  // Check for exact or partial matches
  for (const [keyword, category] of Object.entries(FOOD_DATABASE)) {
    if (lower.includes(keyword)) {
      return category
    }
  }
  
  return 'Other'
}

/**
 * Category colors for UI display (Tailwind classes)
 */
export const CATEGORY_COLORS: Record<FoodCategory, string> = {
  Protein: 'bg-red-500',
  Produce: 'bg-green-500',
  Dairy: 'bg-blue-400',
  Grain: 'bg-amber-500',
  Pantry: 'bg-purple-500',
  Beverage: 'bg-cyan-500',
  Condiment: 'bg-orange-500',
  Frozen: 'bg-sky-400',
  Other: 'bg-gray-400',
}

/**
 * Get the Tailwind color class for a category
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as FoodCategory] || CATEGORY_COLORS.Other
}

/**
 * All available food categories
 */
export const FOOD_CATEGORIES: FoodCategory[] = [
  'Protein',
  'Produce', 
  'Dairy',
  'Grain',
  'Pantry',
  'Beverage',
  'Condiment',
  'Frozen',
  'Other',
]
