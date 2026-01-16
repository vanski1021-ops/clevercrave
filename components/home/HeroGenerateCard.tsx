'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useUserStore, CREDIT_COSTS } from '@/stores/userStore'
import { usePantryStore } from '@/stores/pantryStore'
import OutOfCreditsModal from '@/components/OutOfCreditsModal'
import { getMealContext } from '@/lib/mealTime'

export default function HeroGenerateCard() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  
  const deductCredits = useUserStore(state => state.deductCredits)
  const addCredits = useUserStore(state => state.addCredits)
  const incrementGenerated = useUserStore(state => state.incrementGenerated)
  const pantryItemsRaw = usePantryStore(state => state.items)
  const pantryItems = useMemo(
    () => pantryItemsRaw.filter(i => i.status === 'fresh'),
    [pantryItemsRaw]
  )

  const handleGenerate = async () => {
    // Check if pantry has items
    if (pantryItems.length === 0) {
      alert('Add items first!')
      router.push('/scan')
      return
    }
    
    // Check credits
    if (!deductCredits(CREDIT_COSTS.GENERATE)) {
      setShowCreditsModal(true)
      return
    }
    
    // Show loading state
    setIsGenerating(true)
    window.dispatchEvent(new Event('recipesGenerating'))
    
    try {
      // Get pantry item names
      const itemNames = pantryItems.map(item => item.name)
      const mealContext = getMealContext()
      
      // Call API route
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pantryItems: itemNames,
          mealType: mealContext.mealType,
          dietaryPreferences: []
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipes')
      }

      const data = await response.json()
      const recipes = data.recipes
      
      // Increment counter
      incrementGenerated()
      
      // Store recipes in localStorage for home page to display
      localStorage.setItem('generatedRecipes', JSON.stringify(recipes))
      
      // Trigger re-render of home page
      window.dispatchEvent(new Event('recipesGenerated'))
      window.dispatchEvent(new Event('recipesGeneratedComplete'))
      
      setIsGenerating(false)
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 50, 10])
      }
      
    } catch (error) {
      console.error('Generation error:', error)
      setIsGenerating(false)
      window.dispatchEvent(new Event('recipesGeneratedComplete'))
      alert('Failed to generate recipes. Please try again.')
      
      // Refund credit on error
      addCredits(CREDIT_COSTS.GENERATE)
    }
  }

  return (
    <>
      <div className="px-5 mb-6">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || pantryItems.length === 0}
          className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-3xl p-8 shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✨</span>
              <span className="text-2xl font-black">
                {isGenerating ? 'Generating...' : getMealContext().cta}
              </span>
            </div>
            <p className="text-white/80 text-sm font-medium">
              {isGenerating 
                ? 'Creating your personalized menu'
                : pantryItems.length === 0 
                  ? 'Add items first'
                  : `Tap to remix ${pantryItems.length} ingredients`
              }
            </p>
          </div>
        </button>
      </div>

      <OutOfCreditsModal 
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        action="generate"
      />
    </>
  )
}
