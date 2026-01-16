import React, { useState } from 'react';
import { Recipe } from '@/types';
import { useListStore } from '@/stores/listStore';
import { ChevronDown, ChevronUp, ChefHat } from 'lucide-react';
import PremiumGradient from '@/components/home/PremiumGradient';

interface RecipeCardProps {
  recipe: Recipe;
  cardIndex: number;
  onCook: (recipe: Recipe) => void;
  onAddMissing: (ingredients: string[]) => void;
  onShare: (recipe: Recipe) => void;
  className?: string; // Optional custom sizing
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, cardIndex, onCook, onAddMissing, onShare, className }) => {
  const addMultiple = useListStore((state) => state.addMultiple);
  const [showAdded, setShowAdded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const primaryTag = recipe.tags[0] || 'Tasty';
  const tagLabel = cardIndex === 0 ? "Fast" : cardIndex === 1 ? "Comfort" : primaryTag;
  const usedIng = recipe.ingredientsUsed.length;
  const totalIng = recipe.ingredientsUsed.length + recipe.missingIngredients.length;
  const missingCount = recipe.missingIngredients.length;

  const getTagStyle = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('fast')) return 'bg-amber-400 text-amber-900';
    if (t.includes('healthy')) return 'bg-green-400 text-green-900';
    if (t.includes('comfort')) return 'bg-red-400 text-red-900';
    return 'bg-white text-gray-800';
  }

  // Status badge based on card position
  const getStatusBadge = () => {
    if (cardIndex === 0) {
      // Card 1: Show pantry match
      return (
        <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
          {usedIng}/{totalIng} IN KITCHEN
        </span>
      );
    } else if (cardIndex === 1) {
      // Card 2: Ready to cook
      return (
        <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
          READY TO COOK
        </span>
      );
    } else if (cardIndex === 2) {
      // Card 3: Chef's Pick
      return (
        <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
          <ChefHat className="w-4 h-4" />
          CHEF&apos;S PICK
        </span>
      );
    }
    return null;
  };

  // Card 1 should never show missing ingredients
  const shouldShowMissing = cardIndex !== 0 && recipe.missingIngredients.length > 0;

  return (
    <div 
      className={className || "relative w-72 h-[500px] snap-center rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/10 bg-white cursor-pointer active:scale-[0.98] transition-all duration-200"}
      onClick={() => onCook(recipe)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCook(recipe);
        }
      }}
    >
      {/* Success Toast */}
      {showAdded && (
        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-in slide-in-from-top duration-300 z-20">
          ✓ Added to list
        </div>
      )}

      {/* Background - Premium Gradient for Cards 1 & 2, Image for Card 3 */}
      {cardIndex < 2 ? (
        <PremiumGradient type={cardIndex === 0 ? 'ready' : 'almost'} />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url(${recipe.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90"></div>
        </div>
      )}

      {/* Badge and Share Button - positioned over image */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        <div className="flex flex-col gap-2">
          {getStatusBadge()}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onShare(recipe); }}
          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 active:scale-75 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>
      </div>

      {/* Content overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-2xl font-heading font-black text-white leading-tight mb-3 tracking-tight drop-shadow-2xl">
          {recipe.title}
        </h3>
        
        <div className="flex items-center gap-3 text-white/90 text-[9px] font-black uppercase tracking-widest mb-4">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {recipe.totalTime}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${getTagStyle(tagLabel)}`}>
              {tagLabel}
            </span>
          </div>
        </div>

        {shouldShowMissing && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="w-full flex items-center justify-between p-3 active:bg-white/5 transition-all duration-200 cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }
              }}
            >
              <p className="text-white text-[10px] font-black uppercase tracking-widest">
                NEEDS: {missingCount} {missingCount === 1 ? 'ITEM' : 'ITEMS'}
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addMultiple(recipe.missingIngredients);
                    onAddMissing(recipe.missingIngredients);
                    setShowAdded(true);
                    setTimeout(() => setShowAdded(false), 2000);
                    if ('vibrate' in navigator) navigator.vibrate(10);
                  }}
                  className="bg-white text-gray-900 text-[9px] font-black px-3 py-1.5 rounded-full shrink-0 active:scale-90 transition-all duration-200"
                >
                  + {missingCount}
                </button>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-white" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-3 pb-3 space-y-1 animate-in slide-in-from-top duration-200">
                {recipe.missingIngredients.map((item, idx) => (
                  <p key={idx} className="text-white/80 text-[10px] font-medium">
                    • {item}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
