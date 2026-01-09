export default function HeroGenerateCard() {
    return (
      <div className="px-5">
        <button
          className="w-full rounded-[32px] p-7 text-left text-white
                     bg-gradient-to-br from-orange-500 via-orange-400 to-red-500
                     shadow-xl shadow-orange-200
                     active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold mb-1">
                ✨ Generate Dinner Ideas
              </div>
              <div className="text-orange-100 font-medium">
                Tap to remix your ingredients
              </div>
            </div>
  
            <div className="bg-white/20 rounded-full p-4">
              <span className="text-3xl">🔥</span>
            </div>
          </div>
        </button>
      </div>
    );
  }
  