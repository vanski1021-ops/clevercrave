import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Ingredient {
  id: string
  name: string
  category: string
  location: 'Fridge' | 'Freezer' | 'Pantry'
  status: 'fresh' | 'low' | 'out'
  quantity?: number
  addedAt: Date
}

interface PantryStore {
  items: Ingredient[]
  addItems: (items: Omit<Ingredient, 'id' | 'status' | 'addedAt'>[]) => void
  removeItem: (id: string) => void
  updateStatus: (id: string, status: Ingredient['status']) => void
  clearAll: () => void
}

export const usePantryStore = create<PantryStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItems: (newItems) => set((state) => {
        const itemsWithMeta = newItems.map(item => ({
          ...item,
          id: `pantry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'fresh' as const,
          addedAt: new Date()
        }))
        return { items: [...state.items, ...itemsWithMeta] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      updateStatus: (id, status) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, status } : item
        )
      })),
      
      clearAll: () => set({ items: [] })
    }),
    {
      name: 'pantry-storage'
    }
  )
)
