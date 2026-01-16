# CleverCrave — Master README

## What This App Is

CleverCrave is a **mobile-first web app (PWA-ready)** designed to eliminate kitchen decision fatigue and reduce food waste. It transforms the daily "What's for dinner?" moment into a fast, rewarding loop:

**Snap groceries → Confirm items → Get 3 ultra-short recipes → Build grocery list → Share**

This is not a toy prototype. We're building toward an **almost-finished product** while maintaining **proper dev practices**.

---

## Core Product Loop (North Star)

1. **Snap** fridge/pantry groceries (vision)
2. **Confirm** detected items (review, location, delete)
3. **Generate** 3 ultra-short recipes (clear, confidence-building, low cognitive load)
4. **Grocery list** for missing items (one-tap add)
5. **Share** recipe/cards to drive viral growth

---

## Current Status

**✅ Phases 1-4 Complete** (January 2026)

- ✅ Home screen with recipe carousel
- ✅ Complete scan flow (camera capture → review → pantry)
- ✅ Pantry management with status cycling
- ✅ Grocery list with sharing
- ✅ Credit system with modals
- ✅ State management (Zustand with persistence)
- ✅ Real-time waste saved tracking

**🚧 In Progress:**
- Settings & preferences (Profile UI is complete; features are placeholders)
- Real AI integration (Gemini Vision + GPT-4o-mini)
- Home page locked (UI/UX frozen for polish)

---

## UX Philosophy (Non-Negotiables)

### 1) 30-Second Wow

From opening the app to seeing 3 useful dinner options should feel instant and satisfying. The UI must bias toward "good enough now" rather than perfection.

### 2) No Layout Shift (Hard Rule)

The app must feel stable and premium. No jumpy UI.
- **Top bar** is fixed height **64px** (never collapses).
- **Bottom nav** is fixed height **80px**.
- **Only the middle content scrolls**.
- AppShell is responsible for layout stability.

### 3) Low Cognitive Overhead

We reduce decision fatigue by:
- presenting only **3** recipe choices by default
- using strong hierarchy (big CTA, clear labels, chips)
- keeping recipes "ultra-short" and confidence-building
- using gentle gamification (e.g., "Waste Warrior", credits, chef pick)

### 4) Emotional Design / Behavioral Psychology

We aim for:
- **Relief** ("I don't have to think.")
- **Momentum** (one big CTA to move forward)
- **Reward** (visual delight + "waste saved" feedback)
- **Control without complexity** (confirm items quickly, chips as lightweight preferences)
- **Variable reward** (Chef's Pick roulette, rotating recipe tags)

---

## Theme & Visual Vibe

This app's feel is warm, playful, premium, and food-forward.

### Palette (MVP normalized)

- Background cream: `#FFF7ED` (warm, friendly)
- Cards: `#FFFFFF`
- Dividers: orange-100 / subtle borders
- Primary CTA gradient: `from-orange-500 via-orange-400 to-red-500`
- Accent active: `orange-600`
- Positive/success: `green-700` text with soft greens

### Typography

- Headlines: bold, tight tracking, high contrast (`text-4xl font-extrabold tracking-tight`)
- Section headings: strong but smaller (`text-xl font-extrabold`)
- Chips/pills: confident and compact (`text-xs font-bold`, sometimes uppercase)

### Shape Language

- Big surfaces: rounded **32–40px** (premium softness)
- Pills/chips: rounded-full
- Shadows: soft, warm (avoid harsh black)

---

## Tech Stack (Locked for MVP)

- **Next.js 16.1.1** (App Router)
- **React 19.2.3**
- **TypeScript 5.x**
- **Tailwind CSS v3.4.19** (do not introduce v4)
- **Zustand** (state management)
- Local dev via Cursor + npm
- Hosting target: Vercel

**Future (not MVP):**
- Supabase Auth
- Stripe payments (USD only at launch)
- AI: Gemini Vision API + GPT-4o-mini

---

## Repo Structure

### Key folders

- `app/` — Next.js App Router pages (route-first architecture)
- `components/layout/` — AppShell chrome only (TopAdSlot, BottomNav, AppShell)
- `components/home/` — Home route building blocks (header, hero CTA, filters, section header)
- `components/` — Shared components (RecipeCard, ScanOverlay, OutOfCreditsModal)
- `stores/` — Zustand state management (userStore, pantryStore, listStore)
- `prototype/` — Frozen reference UI (never imported)

### Prototype folder rule

`/prototype` exists to preserve original UX intent. It is **reference only**.
**Never import from /prototype.**

---

## Current Implementation

### Routes

- `/` — Tonight's Options (Home) ✅
- `/scan` — Scan entry overlay (3 options) ✅
- `/scan/camera` — Camera capture interface ✅
- `/scan/review` — Confirm items before adding to pantry ✅
- `/pantry` — Pantry list + status cycling ✅
- `/list` — Grocery list ✅
- `/profile` — Preferences / upsell / household 📋

### State Management

**Zustand Stores:**
- `userStore` — Credits, stats (persisted to `user-storage`)
- `pantryStore` — Pantry items (persisted to `pantry-storage`)
- `listStore` — Grocery list (persisted to `list-storage`)

All stores use `persist` middleware for localStorage persistence.

### Credit System

- **Initial Credits:** 25 (new users)
- **Scan Cost:** 5 credits
- **Generate Cost:** 1 credit
- **Earn Credits:** +1 per item saved from waste
- **Out of Credits Modal:** Shows premium pitch and ways to earn credits

### Features Implemented

**Scan Flow:**
- Camera capture interface with loading state
- Item review page with inline editing
- Category and location selection
- Integration with pantry store
- Waste saved tracking

**Pantry Management:**
- Grid layout (2 columns)
- Status cycling (fresh → low → out)
- Long-press to delete
- Filter chips (All, Fresh, Running Low, Out)
- Sort options (name, date, status)
- Empty states

**Grocery List:**
- Add items manually
- Custom checkboxes
- Long-press to delete
- Clear checked items
- Share list (native Share API)
- Badge count on navigation
- Integration with RecipeCard

**Home Screen:**
- Dynamic credits display
- Dynamic pantry count
- Generate button with credit validation
- Recipe carousel with "Add to List" integration
- Waste saved banner (real data)

---

## AppShell Contract (Hard Requirements)

AppShell responsibilities:
- fixed top + bottom chrome
- enforce scroll container rules
- optional FAB (layout-only)
- FAB tooltip animation

AppShell must NOT:
- fetch data
- manage inventory
- know about credits, AI, or user state
- use tab state

---

## Development Standards (No Compromise)

- Keep architecture route-first.
- Keep Tailwind v3.
- Avoid layout shift, collapsing bars, or reflowing chrome.
- Prefer default exports for components to reduce import mismatch.
- Ensure casing matches file names exactly.
- Keep client/server boundaries correct:
  - Any component using hooks must include `"use client"`.
- Use Zustand selectors correctly:
  - Select raw data, memoize derived values with `useMemo`
  - Avoid filtering/transforming in selectors (causes infinite loops)

---

## Common Build Issues & Fixes

### "Cannot find module '@/components/RecipeCard'"

- Ensure file exists at: `components/RecipeCard.tsx`
- Ensure import matches: `import RecipeCard from "@/components/RecipeCard"`
- Ensure casing matches exactly.

### Path alias not resolving ("@/")

Verify `tsconfig.json` contains:
- `"baseUrl": "."`
- `"paths": { "@/*": ["./*"] }`

Restart dev server after changes:
- `npm run dev`

### React getSnapshot Infinite Loop Warning

**Problem:** "The result of getSnapshot should be cached to avoid an infinite loop"

**Fix:** Select raw data from Zustand store, then memoize derived values:

```typescript
// ✅ CORRECT
const pantryItems = usePantryStore((state) => state.items);
const freshItems = useMemo(
  () => pantryItems.filter((i) => i.status === "fresh"),
  [pantryItems]
);

// ❌ WRONG
const freshItems = usePantryStore((state) =>
  state.items.filter((i) => i.status === "fresh")
);
```

### Credits Showing Wrong Value on Refresh

**Problem:** Credits show 25 briefly, then revert to 20

**Cause:** Old localStorage data persists

**Fix:** Clear localStorage or implement migration logic in `userStore.ts`

---

## Definition of Done for Core Features

### Home Screen ✅
- Home route renders inside AppShell
- Warm cream background
- "Tonight's Vibe" header + credits pill (real data)
- Large orange gradient CTA with credit validation
- Chips row
- "Recommended for You" header + chef pick pill
- Horizontal recipe carousel using RecipeCard
- "Add to List" integration
- No module errors
- No layout shift

### Scan Flow ✅
- FAB routes to `/scan` overlay
- Three scan options (camera, barcode, manual)
- Camera capture interface
- Credit deduction (5 credits)
- Out of credits modal
- Review page with inline editing
- Integration with pantry store
- Waste saved tracking

### Pantry Management ✅
- Grid layout with status indicators
- Tap to cycle status
- Long-press to delete
- Filter and sort options
- Empty states
- Mobile touch feedback
- Haptic feedback

### Grocery List ✅
- Add items manually
- Custom checkboxes
- Long-press to delete
- Clear checked items
- Share list functionality
- Badge count on navigation
- Integration with RecipeCard

---

## Next Work

1. **Fix Credits Hydration Issue** — Resolve localStorage flicker
2. **Profile Page** — User settings and preferences
3. **Real AI Integration** — Gemini Vision + GPT-4o-mini
4. **Premium Purchase Flow** — Stripe integration
5. **Barcode Scanner** — Implement barcode scanning
6. **Manual Entry** — Full manual item entry flow

---

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Documentation

- **[DEV_GUIDE.md](./DEV_GUIDE.md)** — Comprehensive development guide
- **[types.ts](./types.ts)** — TypeScript type definitions
- **[stores/](./stores/)** — Zustand store implementations

---

## Contributing

1. Follow the development standards above
2. Keep components focused and reusable
3. Use TypeScript strictly (no `any` without justification)
4. Test on mobile devices
5. Ensure no layout shift
6. Update DEV_GUIDE.md when adding features

---

**Last Updated:** January 15, 2026  
**Version:** 0.3.0 (Phases 1-4 Complete)
