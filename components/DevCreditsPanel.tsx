'use client'

import { useUserStore } from '@/stores/userStore'
import { useState } from 'react'

export default function DevCreditsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  
  const credits = useUserStore(state => state.credits)
  const addCredits = useUserStore(state => state.addCredits)
  const resetCredits = useUserStore(state => state.resetCredits)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-24 left-4 z-50">
      {isOpen ? (
        <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Dev Tools</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Current Credits</div>
              <div className="text-2xl font-bold">🪙 {credits}</div>
            </div>
            
            <button
              onClick={() => addCredits(10)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm"
            >
              + Add 10 Credits
            </button>
            
            <button
              onClick={() => resetCredits()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-bold text-sm"
            >
              Reset to 25
            </button>
            
            <button
              onClick={() => {
                localStorage.clear()
                location.reload()
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold text-sm"
            >
              Clear All Data
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-gray-800"
        >
          🔧 Dev
        </button>
      )}
    </div>
  )
}
