"use client";

import Link from 'next/link';

export default function ScanPage() {
  return (
    <div className="bg-[#FFF7ED] min-h-screen p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-md mx-auto pt-8 pb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2 text-center">
          Add Items
        </h1>
        <p className="text-gray-600 text-center font-medium">
          Choose how you&apos;d like to add items to your inventory
        </p>
      </div>
      
      {/* Options */}
      <div className="max-w-md mx-auto space-y-4">
        {/* Manual Entry */}
        <Link 
          href="/scan/manual"
          className="block w-full bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg active:scale-95 transition-all hover:border-orange-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">✏️</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Manual Entry
              </h2>
              <p className="text-sm text-gray-600">
                Type in items one by one
              </p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
        
        {/* Camera Scan */}
        <Link 
          href="/scan/camera"
          className="block w-full bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 shadow-2xl active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">📸</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                Scan with Camera
              </h2>
              <p className="text-sm text-white/80">
                AI-powered ingredient detection
              </p>
            </div>
            <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Quick tip */}
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-sm text-blue-800 text-center">
            💡 <span className="font-bold">Tip:</span> Camera scan uses AI to detect multiple items at once!
          </p>
        </div>
      </div>
    </div>
  );
}
