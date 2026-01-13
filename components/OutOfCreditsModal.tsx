'use client'

import { useUserStore } from '@/stores/userStore'
import { X } from 'lucide-react'

interface OutOfCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  action?: string  // "scan" or "generate" - kept for backwards compatibility
}

export default function OutOfCreditsModal({ isOpen, onClose }: OutOfCreditsModalProps) {
  const credits = useUserStore(state => state.credits)
  const monthlyGenerations = useUserStore(state => state.monthlyGenerations)
  const lastResetDate = useUserStore(state => state.lastResetDate)
  
  if (!isOpen) return null
  
  // Calculate days until reset
  const lastReset = new Date(lastResetDate)
  const nextReset = new Date(lastReset.getFullYear(), lastReset.getMonth() + 1, 1)
  const daysUntilReset = Math.ceil((nextReset.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  const isFreeUser = credits === 0 && monthlyGenerations === 0
  
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {isFreeUser ? (
          // Free user upgrade prompt
          <>
            <div className="text-6xl text-center mb-4">✨</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">
              Upgrade to Premium
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Get 10 AI-generated recipe sets with stunning food photography every month!
            </p>
            
            <div className="bg-orange-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">Premium</span>
                <span className="text-2xl font-black text-orange-600">$4.99</span>
              </div>
              <p className="text-sm text-gray-600">per month</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">10 AI photo recipe sets/month</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Unlimited gradient recipes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">Premium themes</span>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform mb-3">
              Upgrade Now
            </button>
            <button 
              onClick={onClose}
              className="w-full text-gray-600 font-medium py-2"
            >
              Maybe Later
            </button>
          </>
        ) : (
          // Premium user - out of monthly generations
          <>
            <div className="text-6xl text-center mb-4">🎉</div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">
              You&apos;ve Used All 10 AI Photo Sets!
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              You&apos;re cooking up a storm! Need more AI-generated recipe photos this month?
            </p>
            
            <div className="space-y-3 mb-6">
              <button className="w-full bg-white border-2 border-gray-200 text-gray-900 font-bold py-4 rounded-2xl hover:border-orange-500 transition-colors">
                ⚡ 1 Extra Set - $0.50
              </button>
              <button className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform">
                📦 10-Pack - $4.00 <span className="text-orange-100 text-sm ml-2">(Save 20%)</span>
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-500 mb-4">
              Or wait until next month!<br/>
              Credits reset in <span className="font-bold text-orange-600">{daysUntilReset} days</span>
            </div>
            
            <button 
              onClick={onClose}
              className="w-full text-gray-600 font-medium py-2"
            >
              I&apos;ll Wait
            </button>
          </>
        )}
      </div>
    </div>
  )
}
