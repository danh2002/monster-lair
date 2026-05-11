# 🚀 Quick Start Guide

Welcome to **Đảo Khủng Long** (Monster Lair) - a production-ready gaming platform built with Next.js 14, TypeScript, and styled-components.

## 📋 Prerequisites

- **Node.js** 18+ or higher
- **npm** 9+ or **yarn** 3.6+
- Basic knowledge of React and TypeScript

## 🎯 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd monster-lair
npm install
# or
yarn install
```

### Step 2: Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page auto-updates as you edit files.

### Step 3: Explore Pages

- **Home**: [http://localhost:3000](http://localhost:3000) - Landing page with battle showcases
- **Arena**: [http://localhost:3000/arena](http://localhost:3000/arena) - Battle arena with rankings
- **Top-Up**: [http://localhost:3000/topup](http://localhost:3000/topup) - Game package pricing
- **Orders**: [http://localhost:3000/orders](http://localhost:3000/orders) - Purchase history

## 🎨 Using the BattleCard Component

The **BattleCard** is the main component for displaying faction battles. Here's how to use it:

### Basic Usage

```tsx
import { BattleCard } from '@/components/game/BattleCard';

export default function Arena() {
  return (
    <BattleCard
      faction1={{
        name: 'HỐA LONG',        // Faction name
        players: 150,             // Number of players
        score: 85,                // Current score
        maxScore: 100,            // Max score
        color: 'red',             // Color: 'red' | 'blue'
      }}
      faction2={{
        name: 'TỪ TIÊN',
        players: 145,
        score: 70,
        maxScore: 100,
        color: 'blue',
      }}
      animated={true}            // Enable animations
      onViewDetails={() => console.log('View battle')}
    />
  );
}
```

### Component Features

✅ **Animated Progress Bars** - Smooth transitions with faction colors
✅ **Dual Faction Display** - Red vs Blue faction comparison
✅ **Responsive Layout** - Works on mobile, tablet, desktop
✅ **Hover Effects** - Interactive glow and scale animations
✅ **Battle Stats** - Shows attack power and win percentage
✅ **VS Badge** - Central badge with gradient colors

### Props Explanation

```typescript
interface BattleCardProps {
  faction1: {
    name: string;           // Display name (e.g., "HỐA LONG")
    players: number;        // Active players in faction
    score: number;          // Current battle score
    maxScore?: number;      // Max possible score (default: 100)
    color: 'red' | 'blue';  // Faction color
  };
  faction2: {
    // Same as faction1
  };
  animated?: boolean;       // Enable progress bar animations (default: true)
  onViewDetails?: () => void; // Callback when card is clicked
}
```

## 🎯 Creating a New Page

### Step 1: Create the Page File

```tsx
// app/(public)/newpage/page.tsx
'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing['2xl']};
`;

export default function NewPage() {
  return (
    <PageContainer>
      <h1>Your Content Here</h1>
    </PageContainer>
  );
}
```

### Step 2: Add Navigation Link

Edit `components/layout/Navbar.tsx`:

```tsx
<NavLinks>
  <Link href="/newpage">New Page</Link>
</NavLinks>
```

## 🎨 Using Styled Components

### Creating a Styled Component

```tsx
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const Container = styled.div`
  background: ${theme.colors.background.card};
  border: 1px solid ${theme.colors.ui.border};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  
  &:hover {
    border-color: ${theme.colors.primary.main};
    box-shadow: ${theme.shadows.glow};
  }
`;

export function MyComponent() {
  return <Container>Content</Container>;
}
```

### Available Design Tokens

```typescript
// Colors
theme.colors.primary.main        // #FF6A00
theme.colors.factions.hoaLong   // #DC143C (red)
theme.colors.factions.tuTien    // #0066CC (blue)
theme.colors.background.dark    // Dark background
theme.colors.text.primary       // White text

// Spacing (units like rem)
theme.spacing.sm   // 0.5rem
theme.spacing.md   // 1rem
theme.spacing.lg   // 1.5rem
theme.spacing.xl   // 2rem

// Border Radius
theme.borderRadius.lg     // 0.75rem
theme.borderRadius.xl     // 1rem
theme.borderRadius.full   // 9999px (circle)

// Shadows
theme.shadows.glow        // Orange glow
theme.shadows.glowHeavy   // Strong glow

// Transitions
theme.transitions.normal  // 300ms ease-in-out
```

## 📦 Using UI Components

### Button

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg" fullWidth>
  Click Me
</Button>

// Variants: primary, secondary, success, outline
// Sizes: sm, md, lg
// Props: fullWidth, disabled, onClick
```

### Input

```tsx
import { Input } from '@/components/ui/Input';

<Input 
  label="Username"
  placeholder="Enter username"
  type="text"
  onChange={(e) => setUsername(e.target.value)}
/>
```

### ProgressBar

```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar
  value={75}
  maxValue={100}
  variant="red"        // red, blue, primary
  animated={true}
  label="Attack"
  valueLabel="75/100"
/>
```

### Modal

```tsx
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

export function MyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <Modal
        isOpen={isOpen}
        title="Modal Title"
        onClose={() => setIsOpen(false)}
      >
        <p>Modal content here</p>
      </Modal>
    </>
  );
}
```

### PricingCard

```tsx
import { PricingCard } from '@/components/game/PricingCard';

<PricingCard
  icon="💎"
  title="PREMIUM"
  price="250,000"
  currency="VND"
  gems={100}
  discount={5}
  badge="POPULAR"
  onClick={handlePurchase}
/>
```

### RankingList

```tsx
import { RankingList } from '@/components/game/RankingList';

const items = [
  { rank: 1, name: 'Player1', points: 500000, badge: '👑' },
  { rank: 2, name: 'Player2', points: 450000 },
];

<RankingList items={items} maxItems={10} />
```

## 🔧 Project Structure

```
monster-lair/
├── app/                 # Next.js pages
│   ├── (public)/       # Public pages
│   └── (dashboard)/    # Dashboard pages
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   ├── game/          # Game-specific components
│   └── layout/        # Layout components
├── styles/            # Styling system
├── lib/              # Utilities
├── types/            # TypeScript types
└── hooks/            # Custom React hooks
```

## 📱 Responsive Design

All components are mobile-first. Use media queries with theme breakpoints:

```tsx
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;
```

### Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🚀 Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GAME_NAME=Đảo Khủng Long
```

## 🐛 Troubleshooting

### Issue: Styled components not working

**Solution**: Make sure you're using `'use client'` directive in client components:

```tsx
'use client';

import styled from 'styled-components';
```

### Issue: Components not updating on save

**Solution**: Check that you're in development mode:

```bash
npm run dev
```

### Issue: TypeScript errors

**Solution**: Run type check:

```bash
npm run type-check
```

## 📚 More Resources

- **README.md** - Full project documentation
- **COMPONENT_EXAMPLES.md** - Component usage examples
- **[Next.js Docs](https://nextjs.org/docs)** - Next.js documentation
- **[styled-components Docs](https://styled-components.com/)** - Styling library
- **[TypeScript Docs](https://www.typescriptlang.org/)** - Type safety

## 💡 Tips & Best Practices

1. **Always use design tokens** - Access colors, spacing from `theme` object
2. **Keep components small** - Each component should have single responsibility
3. **Use TypeScript** - Define Props interfaces for all components
4. **Responsive by default** - Check mobile appearance early
5. **Test on different screens** - Use browser dev tools
6. **Follow naming conventions** - `ComponentName.tsx` in PascalCase
7. **Reuse components** - Don't duplicate code, extend or compose instead

## ❓ Common Questions

**Q: How do I add a new color to the theme?**
A: Edit `styles/theme.ts` and add it to `theme.colors`

**Q: Can I use regular CSS instead of styled-components?**
A: It's possible but not recommended. The project uses styled-components throughout.

**Q: How do I deploy this?**
A: Deploy to Vercel (recommended), Netlify, or any Node.js hosting.

**Q: Can I add dark/light mode?**
A: Yes! You'd need to create theme variants and use React Context.

---

**Happy coding!** 🚀

For support, check the README.md or explore the component examples in the codebase.
