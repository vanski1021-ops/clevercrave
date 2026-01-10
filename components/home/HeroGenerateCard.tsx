'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useUserStore, CREDIT_COSTS } from '@/stores/userStore'
import { usePantryStore } from '@/stores/pantryStore'
import OutOfCreditsModal from '@/components/OutOfCreditsModal'

export default function HeroGenerateCard() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  
  const credits = useUserStore(state => state.credits)
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
      alert('Add items to your pantry first!')
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
    
    try {
      // Get pantry item names
      const itemNames = pantryItems.map(item => item.name)
      
      // Call API route
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pantryItems: itemNames,
          mealType: 'Dinner',
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
      
      setIsGenerating(false)
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 50, 10])
      }
      
    } catch (error) {
      console.error('Generation error:', error)
      setIsGenerating(false)
      alert('Failed to generate recipes. Please try again.')
      
      // Refund credit on error
      addCredits(CREDIT_COSTS.GENERATE)
    }
  }

  return (
    <>
      <button 
        onClick={handleGenerate}
        disabled={isGenerating || pantryItems.length === 0}
        className="w-full bg-gradient-to-br from-red-500 via-orange-500 to-orange-400 text-white rounded-[32px] p-7 shadow-xl shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-between group relative overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Credit cost badge */}
        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
          🪙 {CREDIT_COSTS.GENERATE}
        </div>
        
        <div className="flex flex-col items-start relative z-10">
          <span className="font-heading font-bold text-2xl mb-1">
            {isGenerating ? '🤔 Thinking...' : '✨ Generate Dinner Ideas'}
          </span>
          <span className="text-orange-50 font-medium text-sm">
            {isGenerating 
              ? 'Creating your menu' 
              : pantryItems.length === 0 
                ? 'Add pantry items first'
                : `Tap to remix ${pantryItems.length} ingredients`
            }
          </span>
        </div>
        
        <div className="bg-white/20 p-3 rounded-full relative z-10 group-hover:rotate-12 transition-transform">
          <span className="text-3xl">
            {isGenerating ? '⏳' : '🔥'}
          </span>
        </div>
      </button>

      <OutOfCreditsModal 
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        action="generate"
      />
    </>
  )
}
