'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { categorizeFood } from '@/lib/foodCategories'

interface ManualItem {
  name: string
  category: string
  location: string
}

export default function ManualEntryPage() {
  const router = useRouter()
  const [items, setItems] = useState<ManualItem[]>([])
  const [currentItem, setCurrentItem] = useState('')

  const handleAddItem = () => {
    const trimmed = currentItem.trim()
    if (trimmed) {
      setItems([...items, {
        name: trimmed,
        category: categorizeFood(trimmed), // Auto-categorize based on name
        location: 'Fridge' // Default, user will choose on review page
      }])
      setCurrentItem('')
      
      if ('vibrate' in navigator) navigator.vibrate(10)
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    if (items.length === 0) {
      alert('Please add at least one item')
      return
    }

    localStorage.setItem('detectedItems', JSON.stringify(items))
    router.push('/scan/review')
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-40">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/scan"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Add Items</h1>
            <p className="text-sm text-gray-500">Quick and simple</p>
          </div>
        </div>

        {/* Simple input + add button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={currentItem}
            onChange={(e) => setCurrentItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="e.g., Peanut Butter"
            className="flex-1 px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg font-bold bg-white text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
            autoFocus
          />
          <button
            onClick={handleAddItem}
            disabled={!currentItem.trim()}
            className="px-8 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Items list */}
      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl opacity-30 mb-4 block">✏️</span>
            <p className="text-gray-400 font-bold">No items yet</p>
            <p className="text-gray-500 text-sm mt-2">Type item names above</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Added ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <span className="font-bold text-gray-900 text-lg">{item.name}</span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom action bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-5 pb-8 z-50">
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-200 active:scale-95 transition-transform"
          >
            Continue with {items.length} item{items.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  )
}
