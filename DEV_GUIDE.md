# CleverCrave Development Guide

**Version:** 0.3.0 (Phases 1-4 Complete)  
**Last Updated:** January 15, 2026  
**Status:** Active Development

---

## Latest Changes

### January 15, 2026 - Type Safety & Docs Refresh

- ✅ Added explicit typing for recipes loaded from localStorage
- ✅ Updated README/DEV_GUIDE to reflect current scan overlay + review behavior

### January 15, 2026 - Home Page Lock

- ✅ Home page layout and copy locked for polish
- ✅ Time-aware heading + CTA copy
- ✅ Premium loading skeletons with rotating thinking copy

### January 8, 2026 - UI Polish & Icon Upgrade

**Navigation Improvements:**
- ✅ Upgraded bottom navigation to use Lucide React icons
  - Replaced custom SVG icons with clean, modern Lucide icons
  - Home: `<Home />`, Inventory: `<Package />`, List: `<ClipboardList />`, Profile: `<Menu />`
- ✅ Enhanced navigation styling with premium effects
  - Translucent background with backdrop blur (`bg-white/95 backdrop-blur-lg`)
  - Active state with scale, glow effect, and bold text
  - Improved shadow and safe area padding for notched phones
- ✅ Renamed "Pantry" to "Inventory" throughout the app
  - Updated navigation label and all page references

**Page Updates:**
- ✅ **Inventory Page** (`/pantry`)
  - Changed header from "My Pantry" to "My Inventory"
  - Clean list layout with status dot, name, and location
  - Maintained tap-to-cycle and hold-to-delete functionality
  
- ✅ **Review Page** (`/scan/review`)
  - Simplified UI by removing name editing functionality
  - Updated subtitle to "Select location • Tap delete to remove"
  - Cleaner item display focused on location selection
  
- ✅ **Shopping List** (`/list`)
  - Fixed input field styling with white background and dark text
  - Improved placeholder visibility with gray text
  - Streamlined empty state with single "Browse Recipes" button
  - Updated subtitle to "Type items above or browse recipes"
  
- ✅ **Profile Page** (`/profile`) - NEW!
  - Created polished profile page with production-quality UI
  - Sections: Account, Premium, Features, Support, About
  - Premium upsell card with gradient and pricing ($4.99/month)
  - All features marked as "Coming Soon" (UI-only, no functionality)
  - Clean, intentional design ready for future implementation

**Technical:**
- ✅ Installed `lucide-react` package for modern icon system
- ✅ All pages verified with no linting errors
- ✅ Maintained existing functionality while improving visual design

---

## 1. Project Overview

### Mission Statement

CleverCrave is a **mobile-first web application** that eliminates kitchen decision fatigue and reduces food waste. We transform the daily "What's for dinner?" struggle into a fast, rewarding experience.

### Value Proposition

**Snap groceries → Confirm items → Get 3 ultra-short recipes → Build grocery list → Share**

This is not a prototype—we're building toward a production-ready product with proper development practices.

### Target User

- Busy professionals (25-45 years old)
- Small households (1-4 people)
- Wants to reduce food waste
- Suffers from decision fatigue
- Values convenience over perfection

### Core Product Loop

1. **SNAP** — Take photos of fridge/pantry groceries (AI vision)
2. **CONFIRM** — Quick edit/merge/rename detected items (low friction)
3. **GENERATE** — Get 3 ultra-short recipes (confidence-building, clear)
4. **LIST** — Add missing ingredients to grocery list (one tap)
5. **SHARE** — Share recipe cards (viral growth driver)

### Current Status

**Phase 1-4: Core Features** ✅ **COMPLETE**
- Fixed-layout AppShell (no layout shift)
- Home page with hero CTA and recipe carousel
- Complete scan flow (camera, review, pantry integration)
- Pantry management with status cycling
- Grocery list with sharing
- Credit system with modals
- Zustand state management with persistence
- Real-time waste saved tracking

**Next:** Phase 5 (Profile, Settings & Preferences) and Phase 6 (AI Integration)
**Note:** Home page locked (UI/UX frozen for polish)

---

## 2. Technical Architecture

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | App Router framework |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.4.19 | Styling (v3 locked) |
| **Zustand** | Latest | State management |
| **Node.js** | 20+ | Runtime |

**Hosting:** Vercel  
**Package Manager:** npm

### Architecture Patterns

#### Route-First Architecture
- Pages live in `app/` directory
- Each route is self-contained
- Shared layout in `app/layout.tsx`
- No centralized routing configuration

#### Client/Server Boundaries
- `"use client"` directive for components with hooks
- Server components by default (Next.js 13+)
- Keep data fetching server-side when possible

#### Path Aliases
- `@/*` maps to project root
- Example: `import HomeHeader from "@/components/home/HomeHeader"`

#### State Management
- **Zustand** stores in `stores/` directory
- All stores use `persist` middleware for localStorage
- Stores: `userStore`, `pantryStore`, `listStore`

### File Structure

```
clevercrave/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with AppShell ✅
│   ├── page.tsx                 # Home route ✅
│   ├── globals.css              # Global styles ✅
│   ├── scan/
│   │   ├── page.tsx            # Scan overlay entry ✅
│   │   ├── camera/
│   │   │   └── page.tsx        # Camera capture ✅
│   │   └── review/
│   │       └── page.tsx         # Confirm items ✅
│   ├── pantry/
│   │   └── page.tsx            # Pantry management ✅
│   ├── list/
│   │   └── page.tsx            # Grocery list ✅
│   └── profile/
│       └── page.tsx            # User profile ✅ (UI-only)
│
├── components/
│   ├── layout/                  # AppShell chrome
│   │   ├── AppShell.tsx        # Main layout container ✅
│   │   ├── TopAdSlot.tsx       # Fixed 64px top bar ✅
│   │   └── BottomNav.tsx        # Fixed 80px bottom nav ✅
│   ├── home/                    # Home route components
│   │   ├── HomeHeader.tsx      # Page title + credits ✅
│   │   ├── HeroGenerateCard.tsx # Primary CTA ✅
│   │   ├── HomeFilters.tsx     # Diet/meal chips ✅
│   │   └── RecommendedHeader.tsx # Section header ✅
│   ├── RecipeCard.tsx          # Shared recipe card ✅
│   ├── ScanOverlay.tsx         # Scan entry overlay ✅
│   └── OutOfCreditsModal.tsx   # Credit modal ✅
│
├── stores/                      # Zustand state management
│   ├── userStore.ts            # Credits, stats ✅
│   ├── pantryStore.ts          # Pantry items ✅
│   └── listStore.ts            # Grocery list ✅
│
├── prototype/                   # Reference only (NEVER IMPORT)
│   ├── App.tsx
│   ├── Layout.tsx
│   ├── RecipeCard.tsx
│   └── Scanner.tsx
│
├── public/                      # Static assets
├── types.ts                     # TypeScript interfaces ✅
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── package.json                # Dependencies
├── README.md                   # Project README
└── DEV_GUIDE.md               # This file

Legend: ✅ Complete | 🚧 In Progress | 📋 Planned
```

---

## 3. Design System

### Color Palette

| Color | Hex/Tailwind | Usage |
|-------|--------------|-------|
| **Background Cream** | `#FFF7ED` | Main app background |
| **Cards** | `#FFFFFF` | Recipe cards, pills |
| **Primary Gradient** | `from-orange-500 via-orange-400 to-red-500` | Hero CTA, FAB |
| **Accent Active** | `orange-600` | Active nav, buttons |
| **Success** | `green-700`, `green-500` | Waste saved, positive feedback |
| **Borders Light** | `orange-100` | Subtle dividers |
| **Borders Medium** | `gray-100`, `gray-200` | Card borders |
| **Text Primary** | `gray-900` | Headings |
| **Text Secondary** | `gray-600` | Body text |
| **Text Tertiary** | `gray-400` | Inactive states |

### Typography Scale

| Level | Tailwind Classes | Usage |
|-------|------------------|-------|
| **Hero** | `text-4xl font-extrabold tracking-tight` | "Tonight's Vibe" |
| **Section** | `text-xl font-extrabold` | "Recommended for You" |
| **Body** | `text-base font-medium` | Descriptive text |
| **Chips/Pills** | `text-xs font-bold` | Filter chips |
| **Tiny Labels** | `text-[10px] font-semibold uppercase tracking-wide` | "WASTE SAVED" |

### Spacing System

**Container Padding:** `px-5` (20px horizontal)

**Vertical Rhythm:**
- Small: `mt-2` (8px)
- Medium: `mt-5` (20px)
- Large: `mt-8` (32px)

**Gap Between Items:**
- Tight: `gap-3` (12px)
- Standard: `gap-4` (16px)
- Loose: `gap-5` (20px)

### Border Radius

- **Large Surfaces:** `rounded-[32px]` to `rounded-[40px]` (hero CTA, recipe cards)
- **Pills/Chips:** `rounded-full` (filter chips, credits pill)
- **Standard Cards:** `rounded-2xl` (16px)

### Shadows

- **Soft Cards:** `shadow-xl shadow-orange-200` (warm, premium feel)
- **Standard:** `shadow-sm`, `shadow-lg`
- **Heavy:** `shadow-2xl shadow-orange-900/10` (recipe cards)

**Avoid:** Harsh black shadows—use orange tints for warmth.

### Icon Language

| Emoji | Meaning |
|-------|---------|
| 🪙 | Credits/currency |
| 🌱 | Waste saved (growth) |
| ✨ | Generate/magic |
| 🔥 | Hot/trending |
| 🎲 | Chef's pick (randomness) |
| 🥑 | Keto diet |
| 💪 | High protein |
| 🍝 | Comfort food |
| 🥗 | Healthy option |

---

## 4. Layout Rules (Non-Negotiable)

### AppShell Contract

**Fixed Dimensions:**
- Top bar: **64px** (never collapses)
- Bottom nav: **80px** (never collapses)
- Middle content: **fills remaining space, scrollable**

**Hard Rules:**
- ✅ NO layout shift allowed
- ✅ AppShell handles layout only (no business logic)
- ✅ FAB positioned at `fixed bottom-24 right-6`

### Implementation Pattern

```typescript
// ✅ CORRECT: app/layout.tsx (shared across all routes)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

// ✅ CORRECT: app/page.tsx (individual page)
export default function HomePage() {
  return (
    <div className="bg-[#FFF7ED] min-h-full">
      {/* Page content */}
    </div>
  );
}

// ❌ WRONG: Don't wrap pages with AppShell again
export default function HomePage() {
  return (
    <AppShell>  {/* ❌ Creates duplicate layout */}
      <div>...</div>
    </AppShell>
  );
}
```

### Scrolling Behavior

- AppShell uses `overflow-hidden` on outer container
- Middle section uses `overflow-y-auto` with `overscroll-contain`
- Pages use `min-h-full` to ensure proper scroll area
- Horizontal scrolling for carousels: `overflow-x-auto` with `no-scrollbar` utility

---

## 5. State Management

### Zustand Stores

All stores use `persist` middleware to save state to `localStorage`.

#### User Store (`stores/userStore.ts`)

**State:**
- `credits: number` - Current credit balance (initial: 25)
- `totalGenerated: number` - Total recipes generated
- `totalScanned: number` - Total scans performed
- `wasteItemsSaved: number` - Total items saved from waste

**Actions:**
- `deductCredits(amount)` - Deduct credits, returns `true` if successful
- `addCredits(amount)` - Add credits
- `incrementGenerated()` - Increment generation counter
- `incrementScanned()` - Increment scan counter
- `incrementWasteSaved(count)` - Increment waste saved counter
- `resetCredits()` - Reset all stats to initial state

**Constants:**
- `CREDIT_COSTS.SCAN = 5`
- `CREDIT_COSTS.GENERATE = 1`
- `INITIAL_CREDITS = 25`

**Storage Key:** `user-storage`

#### Pantry Store (`stores/pantryStore.ts`)

**State:**
- `items: Ingredient[]` - Array of pantry items

**Ingredient Interface:**
```typescript
interface Ingredient {
  id: string
  name: string
  category: string
  location: 'Fridge' | 'Freezer' | 'Pantry'
  status: 'fresh' | 'low' | 'out'
  quantity?: number
  addedAt: Date
}
```

**Actions:**
- `addItems(items)` - Add multiple items (auto-generates IDs and timestamps)
- `removeItem(id)` - Remove item by ID
- `updateStatus(id, status)` - Update item status
- `clearAll()` - Clear all items

**Storage Key:** `pantry-storage`

#### List Store (`stores/listStore.ts`)

**State:**
- `items: ListItem[]` - Array of grocery list items

**ListItem Interface:**
```typescript
interface ListItem {
  id: string
  name: string
  checked: boolean
  addedAt: Date
}
```

**Actions:**
- `addItem(name)` - Add single item (prevents duplicates, case-insensitive)
- `addMultiple(names)` - Add multiple items (batch operation)
- `removeItem(id)` - Remove item by ID
- `toggleItem(id)` - Toggle checked state
- `clearChecked()` - Remove all checked items
- `clearAll()` - Clear all items

**Storage Key:** `list-storage`

### Store Usage Pattern

```typescript
// ✅ CORRECT: Select raw data, memoize derived values
const pantryItems = usePantryStore((state) => state.items);
const freshItems = useMemo(
  () => pantryItems.filter((i) => i.status === "fresh"),
  [pantryItems]
);

// ❌ WRONG: Don't filter in selector (causes infinite loops)
const freshItems = usePantryStore((state) =>
  state.items.filter((i) => i.status === "fresh")
);
```

---

## 6. Component Catalog

### Layout Components

#### 1. AppShell
**File:** `components/layout/AppShell.tsx`  
**Export:** Named `{ AppShell }`

**Props:**
```typescript
interface AppShellProps {
  children: ReactNode;
  showFab?: boolean;      // Default: true
  onFabClick?: () => void;
}
```

**Features:**
- FAB tooltip animation ("ADD ITEMS" bounces for 5 seconds on load)
- Conditional FAB visibility based on route

**Responsibilities:**
- Render fixed top bar (TopAdSlot)
- Render fixed bottom nav (BottomNav)
- Render scrollable content area
- Render optional FAB

**Must NOT:**
- Fetch data
- Manage inventory/state
- Know about credits, AI, or user data

---

#### 2. TopAdSlot
**File:** `components/layout/TopAdSlot.tsx`  
**Export:** Named `{ TopAdSlot }`

**Features:**
- Fixed 64px height
- Shows waste saved stats from `useUserStore`
- Dynamic message: "{count} items saved this week" or "Start saving food waste today!"
- Orange-tinted background (`bg-orange-50`)

---

#### 3. BottomNav
**File:** `components/layout/BottomNav.tsx`  
**Export:** Named `{ BottomNav }`

**Features:**
- Fixed 80px height
- 4 navigation tabs: Home, Inventory, List, Profile
- Active state via `usePathname()`
- Uses Next.js `<Link>` for routing
- Orange accent for active tab
- Badge count on List tab (unchecked items)

**Routes:**
- `/` → Home
- `/pantry` → Inventory
- `/list` → Grocery List
- `/profile` → Profile

---

### Home Components

#### 4. HomeHeader
**File:** `components/home/HomeHeader.tsx`  
**Export:** Default

**Features:**
- "Tonight's Vibe" heading (hero typography)
- Dynamic subtext: "Using {count} items from your pantry" (from `usePantryStore`)
- Credits pill (🪙 {credits}) from `useUserStore`
- Smooth transitions on credit updates

---

#### 5. HeroGenerateCard
**File:** `components/home/HeroGenerateCard.tsx`  
**Export:** Default

**Features:**
- Large orange gradient CTA button
- Credit cost badge (🪙 1)
- Dynamic text based on pantry items count
- Loading state ("🤔 Thinking...")
- Credit deduction and validation
- OutOfCreditsModal integration
- Disabled when no pantry items or insufficient credits

---

#### Deleted feature. #### 6. HomeFilters
**Deleted File:** `components/home/HomeFilters.tsx`  
**Export:** Default

**Deleted Features:**
- Horizontal scrolling chip row
- Dropdown: "Dinner ⌄"
- Filter chips: 🥑 Keto, 💪 High Protein, 🍝 Comfort, 🥗 Healthy
- Hover states (orange border)

---

#### 7. RecommendedHeader
**File:** `components/home/RecommendedHeader.tsx`  
**Export:** Default

**Features:**
- Section title: "Recommended for You"
- # Deleted Button: "🎲 Chef's Pick" (right-aligned)
- # Deleted Active scale animation on button

---

### Shared Components

#### 8. RecipeCard
**File:** `components/RecipeCard.tsx`  
**Export:** Default

**Props:**
```typescript
interface RecipeCardProps {
  recipe: Recipe;
  onCook: (recipe: Recipe) => void;
  onAddMissing: (ingredients: string[]) => void;
  onShare: (recipe: Recipe) => void;
}
```

**Features:**
- Large card with background image
- Tag pills (COMFORT, FAST, HEALTHY)
- "Chef's Pick" badge (conditional)
- Time and ingredient stats
- Share button (top right)
- "Add to List" button with count (+ {missingIngredients.length})
- Success toast when items added
- Click to cook (full card)
- Parallax hover effect
- Integrates with `useListStore` for adding missing ingredients

---

#### 9. ScanOverlay
**File:** `components/ScanOverlay.tsx`  
**Export:** Default

**Features:**
- Full-screen translucent overlay with backdrop blur
- Two floating buttons (lower right):
  - 📸 Snap Groceries → routes to `/scan/camera`
  - ✏️ Manual → routes to `/scan/manual`
- Click outside to close

---

#### 10. OutOfCreditsModal
**File:** `components/OutOfCreditsModal.tsx`  
**Export:** Default

**Props:**
```typescript
interface OutOfCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  action: 'scan' | 'generate'
}
```

**Features:**
- Full-screen modal with backdrop blur
- Dynamic messaging based on action type
- Premium upsell section
- "Earn Free Credits" section
- Animated entry/exit

---

## 7. Type Definitions

### Current Types (`types.ts`)

```typescript
export interface Recipe {
  id: string;                    // Unique identifier
  title: string;                 // "Garlic Butter Shrimp Pasta"
  image: string;                 // Unsplash URL
  totalTime: string;             // "15 min"
  tags: string[];                // ["Comfort", "Fast"]
  ingredientsUsed: string[];     // ["Pasta", "Garlic", "Butter"]
  missingIngredients: string[];  // ["White Wine"]
}
```

### Store Types

See **State Management** section for `Ingredient` and `ListItem` interfaces.

---

## 8. Implementation Status

### ✅ Phase 1: Home Screen (COMPLETE)

- [x] AppShell with fixed layout
- [x] TopAdSlot with waste saved banner (real data)
- [x] BottomNav with routing and badge counts
- [x] HomeHeader with credits pill (real data)
- [x] HeroGenerateCard CTA with credit system
- [ ] HomeFilters diet chips (removed to reduce decision fatigue)
- [x] RecommendedHeader with Chef's Pick
- [x] RecipeCard carousel with list integration
- [x] Empty state until inventory exists
- [x] Home page locked (UI/UX frozen for polish)
- [x] No TypeScript errors
- [x] No layout shift
- [x] Default exports aligned
- [x] Path aliases working

**Completed:** January 2026

---

### ✅ Phase 2: Scan Flow (COMPLETE)

#### `/scan` Page - Entry Point
- [x] ScanOverlay component with backdrop blur
- [x] Two floating buttons (lower right):
  - [x] 📸 Snap Groceries → routes to `/scan/camera`
  - [x] ✏️ Manual → routes to `/scan/manual`
- [x] Click outside to close overlay
- [x] FAB integration (routes to `/scan`)

#### `/scan/camera` Page - Camera Capture
- [x] Full-screen camera interface
- [x] Fixed header with back button
- [x] Live camera feed
- [x] Capture button with loading state
- [x] Credit cost indicator
- [x] Credit deduction (5 credits)
- [x] OutOfCreditsModal integration
- [x] 2-second processing simulation
- [x] Navigation to `/scan/review` with mock data

#### `/scan/review` Page - Confirm Items
- [x] Sticky header with "Confirm Items" title
- [x] Location toggle (Fridge, Freezer, Pantry)
- [x] Delete button for each item
- [x] Empty state with "Try Again" button
- [x] Bottom action bar:
  - [x] "Scan More" button
  - [x] "Add Items" button (primary)
- [x] Success toast with item count
- [x] Integration with `usePantryStore`
- [x] Integration with `useUserStore` (waste saved tracking)
- [x] Navigation to `/pantry` after adding

**Completed:** January 2026

---

### ✅ Phase 3: Pantry Management (COMPLETE)

#### `/pantry` Page
- [x] List layout for pantry items
- [x] Status indicators:
  - [x] Green dot: Fresh
  - [x] Yellow dot: Running low
  - [x] Gray dot: Out
- [x] Dynamic borders based on status
- [x] Tap to cycle status (fresh → low → out → fresh)
- [x] Long-press to delete (800ms)
- [x] Delete confirmation modal
- [x] Category filter chips (All, Fresh, Running Low, Out)
- [ ] Sort options (name, date, status) — not implemented
- [ ] Food emoji helper function — not present in code
- [x] Low/Out items show + button to add to grocery list
- [x] Empty state: "Your pantry is empty"
- [x] Filtered empty state
- [x] Mobile touch feedback (`active:scale-95`)
- [x] Dismissible instruction tip
- [x] Haptic feedback on interactions

#### State Management
- [x] Zustand store (`stores/pantryStore.ts`)
- [x] Actions: addItems, removeItem, updateStatus, clearAll
- [x] Persist to localStorage (`pantry-storage`)
- [x] Integration with scan flow

**Completed:** January 2026

---

### ✅ Phase 4: Grocery List (COMPLETE)

#### `/list` Page
- [x] Header with item counts
- [x] Sticky add item input (Enter key support)
- [x] Custom checkbox component
- [x] Sort items (unchecked first)
- [x] Long-press to delete (same pattern as pantry)
- [x] Dismissible instruction tip (tap to check off, hold to delete)
- [x] Input length capped (40 chars)
- [x] Delete confirmation modal
- [x] "Clear Checked" button (conditional)
- [x] "Share List" button (native Share API with clipboard fallback)
- [x] Empty state with action buttons
- [x] Mobile touch feedback
- [x] Haptic feedback

#### Integration
- [x] "Add Missing" from RecipeCard adds to list
- [x] List state management (Zustand)
- [x] Badge count on BottomNav (unchecked items)
- [x] Duplicate prevention (case-insensitive)
- [x] Persist to localStorage (`list-storage`)

**Completed:** January 2026

---

### 🚧 Phase 5: Profile & Settings (IN PROGRESS)

#### `/profile` Page
- [x] Section scaffolding (Account, Premium, Features, Support, About)
- [x] Premium upsell card (UI-only)
- [ ] User avatar (placeholder)
- [ ] Credits display (large)
- [ ] Household size picker
- [ ] Dietary preferences (multi-select)
- [ ] Vegetarian, Vegan, Gluten-free, Dairy-free, Keto
- [ ] Cuisine preferences
- [ ] Difficulty level (Easy/Medium/Hard)
- [ ] Sign out button (future)

**Target Completion:** Month 2

---

### 🤖 Phase 6: AI Integration (FUTURE)

#### Gemini Vision API
- [ ] Camera capture → upload to Gemini
- [ ] Parse response → extract ingredients
- [ ] Map to ingredient categories
- [ ] Handle errors gracefully

#### GPT-4o-mini Recipe Generation
- [ ] Build prompt with pantry items
- [ ] Request 3 recipes (constraint: ultra-short)
- [ ] Parse response → Recipe objects
- [ ] Cache recipes for 24 hours

#### Credits System
- [x] Deduct credits per action (scan: 5, generate: 1)
- [x] Display credit cost before actions
- [x] "Out of credits" modal with premium pitch
- [ ] Track usage analytics
- [ ] Purchase credits flow (Stripe integration)

**Target Completion:** Month 3+

---

## 9. Development Guidelines

### Code Standards

#### TypeScript
- ✅ Use TypeScript strictly (no `any` without justification)
- ✅ Define interfaces for all props
- ✅ Use `export interface` for shared types in `types.ts`
- ✅ Prefer type inference where obvious

#### Components
- ✅ Prefer **default exports** for page/feature components
- ✅ Use **named exports** for layout/utility components
- ✅ Add `"use client"` directive if using hooks
- ✅ Keep components focused (single responsibility)
- ✅ Extract logic into custom hooks when needed

#### File Naming
- ✅ Match file names exactly (case-sensitive)
- ✅ Use PascalCase for component files: `HomeHeader.tsx`
- ✅ Use camelCase for utility files: `formatTime.ts`
- ✅ Use kebab-case for route folders: `scan/review/`

---

### Import Rules

```typescript
// ✅ CORRECT: Use path alias
import HomeHeader from "@/components/home/HomeHeader";
import { Recipe } from "@/types";
import { usePantryStore } from "@/stores/pantryStore";

// ❌ WRONG: Relative paths from root
import HomeHeader from "../../components/home/HomeHeader";

// ✅ CORRECT: Named import for layout components
import { AppShell } from "@/components/layout/AppShell";

// ✅ CORRECT: Default import for page components
import HomeHeader from "@/components/home/HomeHeader";

// ❌ FORBIDDEN: Never import from prototype
import { Scanner } from "@/prototype/Scanner"; // ❌ NO!
```

**Why avoid prototype imports?**
- Prototype is reference only (frozen UI snapshot)
- Prevents circular dependencies
- Keeps production code clean

---

### Styling Guidelines

#### Tailwind CSS
- ✅ Use Tailwind v3 utilities (v4 forbidden)
- ✅ Follow spacing system (`px-5`, `gap-3`, `mt-5`)
- ✅ Use warm colors consistently (orange, cream)
- ✅ Avoid harsh shadows (use orange tints)
- ✅ Use `rounded-[32px]` for premium surfaces

#### Custom CSS
- ⚠️ Avoid custom CSS unless necessary
- ✅ Use `globals.css` for utility classes only
- ✅ Example: `.no-scrollbar` utility, `@keyframes slideDown`

```css
/* globals.css */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

---

### Git Workflow

#### Branches
- `main` — Production-ready code
- `feature/scan-flow` — Feature branches
- `fix/layout-shift` — Bug fixes

#### Commits
- ✅ Descriptive messages: "Add HomeHeader component with credits pill"
- ✅ Reference issues: "Fix #12: Duplicate waste banner"
- ❌ Avoid: "wip", "fix stuff", "update"

#### Pull Requests
- Write clear description
- Include screenshots for UI changes
- Test locally before pushing
- No prototype files in commits

---

## 10. Feature Roadmap (Prioritized)

### 🔥 HIGH PRIORITY (Next 2 Weeks)

1. **Fix Credits Hydration Issue** — Resolve localStorage flicker (25 → 20)
2. **Profile Page** — Basic user settings and preferences
3. **Recipe Generation Mock** — Improve mock generation flow

**Success Criteria:**
- Credits display correctly on first load
- User can access profile page
- Generate flow feels complete (even with mock data)

---

### 📅 MEDIUM PRIORITY (Month 1)

4. **Real AI Integration** — Gemini Vision + GPT-4o-mini
5. **Premium Purchase Flow** — Stripe integration
6. **Recipe Sharing** — Social media integration
7. **Barcode Scanner** — Implement barcode scanning
8. **Manual Entry** — Full manual item entry flow

**Success Criteria:**
- AI generates real recipes from photos
- Users can purchase credits
- Recipes can be shared to social media

---

### 🗓️ LOW PRIORITY (Month 2+)

9. **User Authentication** — Supabase Auth
10. **Household Management** — Shared pantry
11. **Recipe Favorites** — Save for later
12. **Meal Planning** — Weekly calendar
13. **Nutritional Info** — Calories, macros

**Success Criteria:**
- Multi-user households supported
- Users can save favorite recipes
- Meal planning features available

---

### 💡 NICE-TO-HAVE (Future)

14. **Voice Input** — Say ingredient names
15. **Confetti Animations** — Celebrate milestones
16. **Pantry Health Score** — Visual gauge
17. **Streak Tracking** — Daily usage streaks
18. **Badges System** — Achievement badges
19. **Community Recipes** — User-submitted recipes

---

## 11. Known Issues & Gotchas

### ✅ Resolved Issues

#### Duplicate "Waste Saved" Banner
**Problem:** Two banners appeared at top of screen.  
**Cause:** Nested AppShells (one in `app/layout.tsx`, one in `app/page.tsx`).  
**Fix:** Removed AppShell from individual pages. Only `app/layout.tsx` wraps children.  
**Resolved:** January 2026

#### Import/Export Mismatches
**Problem:** TypeScript errors: "Module has no default export"  
**Cause:** Home components used named exports but were imported as default.  
**Fix:** Changed all home components to use default exports.  
**Resolved:** January 2026

#### Missing `id` Property in Recipe Mock Data
**Problem:** TypeScript error: "Property 'id' is missing"  
**Cause:** Recipe interface requires `id`, but mock data omitted it.  
**Fix:** Added unique string IDs ("1", "2", "3") to mock recipes.  
**Resolved:** January 2026

#### React getSnapshot Infinite Loop Warning
**Problem:** "The result of getSnapshot should be cached to avoid an infinite loop"  
**Cause:** Zustand selectors returning new arrays on every render.  
**Fix:** Select raw data from store, memoize derived values with `useMemo`.  
**Resolved:** January 2026

---

### ⚠️ Active Issues

#### Credits Hydration Flicker
**Status:** Credits show 25 briefly, then revert to 20 on refresh  
**Cause:** Old localStorage data with 20 credits persists, overwriting initial 25  
**Impact:** Confusing UX, incorrect initial credits  
**Priority:** HIGH  
**Fix Needed:** Migration logic in `userStore.ts` to detect and update old data, or clear localStorage for new users

#### Recipe Generation Still Mock
**Status:** HeroGenerateCard shows alert instead of real recipes  
**Impact:** Core feature incomplete  
**Priority:** MEDIUM (Phase 6)  
**Timeline:** Month 3+

#### Barcode/Manual Entry Not Implemented
**Status:** Placeholder alerts only  
**Impact:** Limited scan options  
**Priority:** MEDIUM  
**Timeline:** Month 1

---

### 🤔 Future Considerations

**Route Groups for Full-Screen Layouts**
- Camera view should be full-screen (no AppShell)
- Solution: Use Next.js route groups: `app/(fullscreen)/scan/camera/page.tsx`

**Image Optimization**
- Recipe photos from Unsplash are large
- Solution: Use Next.js `<Image>` component with blur placeholder

**Lazy Loading for Recipe Carousel**
- Loading all images at once is expensive
- Solution: Intersection Observer for lazy load

**Infinite Scroll vs Pagination**
- Decision needed for pantry/list pages
- Infinite scroll better for mobile UX

**Offline Support (PWA)**
- Cache recipe data for offline viewing
- Queue pantry updates when offline
- Sync when back online

---

## 12. Testing & Quality

### Pre-Launch Checklist

#### Functionality
- [x] All routes render without errors
- [ ] No console errors in production build
- [x] All links and buttons work
- [x] Forms validate correctly
- [x] State persists across page refreshes

#### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.0s
- [ ] Largest Contentful Paint < 2.5s
- [x] Cumulative Layout Shift = 0 (hard requirement)

#### Responsiveness
- [x] Mobile (320px to 768px)
- [ ] Tablet (768px to 1024px)
- [ ] Desktop (1024px+)
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome

#### Accessibility
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA

#### TypeScript
- [x] Strict mode enabled
- [x] No `any` types without justification
- [x] All props typed
- [x] No TypeScript errors

#### PWA
- [ ] Manifest configured
- [ ] Service worker registered
- [ ] Offline fallback page
- [ ] Add to home screen prompt
- [ ] Icons (192x192, 512x512)

#### SEO
- [ ] Meta tags (title, description)
- [ ] Open Graph tags (social sharing)
- [ ] Favicon configured
- [ ] Sitemap generated
- [ ] robots.txt configured

---

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | TBD |
| Time to Interactive | < 3.0s | TBD |
| Largest Contentful Paint | < 2.5s | TBD |
| **Cumulative Layout Shift** | **0** | **0** ✅ |
| Total Bundle Size | < 200KB | TBD |

**Critical:** CLS must remain 0 (no layout shift).

---

## 13. Resources & References

### Design Inspiration

**Prototype Files** (Reference Only)
- `prototype/App.tsx` — Original full app
- `prototype/Layout.tsx` — Original layout structure
- `prototype/RecipeCard.tsx` — Original card design
- `prototype/Scanner.tsx` — Original scan flow

---

### Documentation

**Framework & Libraries**
- [Next.js App Router](https://nextjs.org/docs/app) — Official docs
- [React 19](https://react.dev) — Latest features
- [Tailwind CSS v3](https://tailwindcss.com/docs) — Utility-first CSS
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) — Type system
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) — State management

**Deployment**
- [Vercel](https://vercel.com/docs) — Next.js hosting

---

### APIs (Future Integration)

**AI Services**
- [Gemini Vision API](https://ai.google.dev/gemini-api/docs/vision) — Image recognition
- [OpenAI GPT-4o-mini](https://platform.openai.com/docs/models) — Recipe generation

**Authentication**
- [Supabase Auth](https://supabase.com/docs/guides/auth) — User management

**Payments**
- [Stripe](https://stripe.com/docs) — Credit card processing

---

## Living Documentation

This guide is **actively maintained** and should be updated when:

- ✅ New features are implemented
- ✅ Architecture decisions change
- ✅ Design system evolves
- ✅ New patterns emerge
- ✅ Issues are discovered and resolved
- ✅ Dependencies are updated

**Keep it concise but comprehensive.** New developers should understand the entire project by reading this file.

---

**Last Updated:** January 15, 2026  
**Maintained By:** Development Team  
**Version:** 0.3.0 (Phases 1-4 Complete)
