import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ListItem {
  id: string
  name: string
  checked: boolean
  addedAt: Date
}

interface ListStore {
  items: ListItem[]
  addItem: (name: string) => void
  addMultiple: (names: string[]) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  clearChecked: () => void
  clearAll: () => void
}

export const useListStore = create<ListStore>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (name) => set((state) => {
        // Check if item already exists (case-insensitive)
        const exists = state.items.some(
          item => item.name.toLowerCase() === name.toLowerCase()
        )
        if (exists) return state
        
        return {
          items: [...state.items, {
            id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            checked: false,
            addedAt: new Date()
          }]
        }
      }),
      
      addMultiple: (names) => set((state) => {
        const newItems = names
          .filter(name => {
            // Only add if not already in list
            return !state.items.some(
              item => item.name.toLowerCase() === name.toLowerCase()
            )
          })
          .map(name => ({
            id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            checked: false,
            addedAt: new Date()
          }))
        
        return { items: [...state.items, ...newItems] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      toggleItem: (id) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      })),
      
      clearChecked: () => set((state) => ({
        items: state.items.filter(item => !item.checked)
      })),
      
      clearAll: () => set({ items: [] })
    }),
    {
      name: 'list-storage'
    }
  )
)
