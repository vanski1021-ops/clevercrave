import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Credit costs for different actions
export const CREDIT_COSTS = {
  SCAN: 5,
  GENERATE: 1
}

// Initial credits for new users
export const INITIAL_CREDITS = 25

interface UserStore {
  credits: number
  totalGenerated: number
  totalScanned: number
  wasteItemsSaved: number
  favoriteRecipes: string[] // Array of recipe IDs
  monthlyGenerations: number // How many AI generations this month (max 10)
  lastResetDate: string // When credits last reset
  totalGenerationsAllTime: number // Track lifetime usage
  deductCredits: (amount: number) => boolean
  addCredits: (amount: number) => void
  incrementGenerated: () => void
  incrementScanned: () => void
  incrementWasteSaved: (count: number) => void
  toggleFavorite: (recipeId: string) => void
  isFavorite: (recipeId: string) => boolean
  checkAndResetMonthly: () => void
  canGenerate: () => boolean
  resetCredits: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      credits: INITIAL_CREDITS,
      totalGenerated: 0,
      totalScanned: 0,
      wasteItemsSaved: 0,
      favoriteRecipes: [],
      monthlyGenerations: 10, // Premium gets 10 per month
      lastResetDate: new Date().toISOString(),
      totalGenerationsAllTime: 0,
      
      checkAndResetMonthly: () => {
        const state = get()
        const lastReset = new Date(state.lastResetDate)
        const now = new Date()
        
        // Check if it's a new month
        const isNewMonth = 
          lastReset.getMonth() !== now.getMonth() ||
          lastReset.getFullYear() !== now.getFullYear()
        
        if (isNewMonth) {
          set({
            monthlyGenerations: 10, // Reset to 10
            lastResetDate: now.toISOString()
          })
        }
      },
      
      canGenerate: () => {
        const state = get()
        state.checkAndResetMonthly()
        return state.credits > 0 || state.monthlyGenerations > 0
      },
      
      deductCredits: (amount) => {
        get().checkAndResetMonthly() // Check for reset first
        
        const state = get()
        
        // For free tier, use regular credits
        if (state.credits > 0 && state.credits >= amount) {
          set({ 
            credits: state.credits - amount,
            totalScanned: state.totalScanned + 1
          })
          return true
        }
        
        // For premium tier, use monthly generations
        if (state.monthlyGenerations > 0) {
          set({
            monthlyGenerations: Math.max(0, state.monthlyGenerations - 1),
            totalGenerationsAllTime: state.totalGenerationsAllTime + 1
          })
          return true
        }
        
        return false // No credits left
      },
      
      addCredits: (amount) => set((state) => ({
        credits: state.credits + amount
      })),
      
      incrementGenerated: () => set((state) => ({
        totalGenerated: state.totalGenerated + 1
      })),
      
      incrementScanned: () => set((state) => ({
        totalScanned: state.totalScanned + 1
      })),
      
      incrementWasteSaved: (count) => set((state) => ({
        wasteItemsSaved: state.wasteItemsSaved + count
      })),
      
      toggleFavorite: (recipeId: string) => {
        set((state) => {
          const isFavorited = state.favoriteRecipes.includes(recipeId)
          return {
            favoriteRecipes: isFavorited
              ? state.favoriteRecipes.filter(id => id !== recipeId)
              : [...state.favoriteRecipes, recipeId]
          }
        })
      },
      
      isFavorite: (recipeId: string) => {
        return get().favoriteRecipes.includes(recipeId)
      },
      
      resetCredits: () => set({
        credits: INITIAL_CREDITS,
        totalGenerated: 0,
        totalScanned: 0,
        wasteItemsSaved: 0,
        favoriteRecipes: [],
        monthlyGenerations: 10,
        lastResetDate: new Date().toISOString(),
        totalGenerationsAllTime: 0
      })
    }),
    {
      name: 'user-storage'
    }
  )
)
