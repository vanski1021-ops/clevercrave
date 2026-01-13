'use client'

import { useEffect, useState } from 'react'

interface PremiumGradientProps {
  type: 'ready' | 'almost'
  className?: string
}

export default function PremiumGradient({ type, className = '' }: PremiumGradientProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Gradient colors based on card type
  const gradients = {
    ready: 'from-green-400 via-emerald-500 to-teal-600',
    almost: 'from-amber-400 via-orange-500 to-red-500'
  }
  
  // Icon for each type
  const icons = {
    ready: '🥗',
    almost: '🍜'
  }
  
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[type]} opacity-90 ${
        mounted ? 'animate-gradient' : ''
      }`} />
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Large decorative icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <span className="text-9xl animate-pulse" style={{ animationDuration: '3s' }}>
          {icons[type]}
        </span>
      </div>
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
    </div>
  )
}
