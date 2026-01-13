import { NextRequest, NextResponse } from 'next/server'
import { generateRecipes } from '@/lib/openai'

export async function POST(request: NextRequest) {
  // Validate API key exists
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { pantryItems, mealType, dietaryPreferences } = body
    
    // Validate input
    if (!pantryItems || !Array.isArray(pantryItems) || pantryItems.length === 0) {
      return NextResponse.json(
        { error: 'No pantry items provided' },
        { status: 400 }
      )
    }
    
    // Call OpenAI
    const recipes = await generateRecipes(
      pantryItems,
      mealType || 'Dinner',
      dietaryPreferences || []
    )
    
    return NextResponse.json({ recipes })
    
  } catch (error: any) {
    console.error('Recipe generation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recipes' },
      { status: 500 }
    )
  }
}