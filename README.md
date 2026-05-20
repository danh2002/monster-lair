# 🦖 Đảo Khủng Long - Monster Lair Gaming Platform

A production-ready gaming landing website built with **Next.js 14**, **styled-components**, **TypeScript**, and inspired by dark fantasy dinosaur themes.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![styled-components](https://img.shields.io/badge/styled--components-6.1-DB7093?logo=styledcomponents)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd monster-lair

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
monster-lair/
├── app/                              # Next.js App Router
│   ├── (public)/                     # Public pages layout
│   │   ├── page.tsx                  # Landing page
│   │   └── layout.tsx
│   ├── (dashboard)/                  # Dashboard pages
│   │   ├── arena/page.tsx            # Battle arena page
│   │   ├── topup/page.tsx            # Top-up / Pricing page
│   │   ├── orders/page.tsx           # Order history page
│   │   └── layout.tsx
│   ├── api/                          # API routes (future)
│   ├── layout.tsx                    # Root layout
│   └── globals.ts
│
├── components/                       # Reusable components
│   ├── ui/
│   │   ├── Button.tsx               # Button variants
│   │   ├── Input.tsx                # Input fields
│   │   ├── Card.tsx                 # Card component
│   │   ├── Modal.tsx                # Modal dialog
│   │   └── ProgressBar.tsx          # Progress bars
│   ├── game/
│   │   ├── BattleCard.tsx           # ⭐ Main battle card component
│   │   ├── PricingCard.tsx          # Pricing cards
│   │   └── RankingList.tsx          # Ranking list
│   └── layout/
│       ├── Navbar.tsx               # Navigation bar
│       └── Footer.tsx               # Footer
│
├── styles/
│   ├── theme.ts                     # Design tokens & theme
│   └── globalStyles.ts              # Global CSS
│
├── lib/
│   └── registry.tsx                 # styled-components registry
│
├── types/
│   └── index.ts                     # TypeScript interfaces
│
├── hooks/
│   └── useMediaQuery.ts             # Custom React hooks
│
├── public/                          # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local
```

## 🎨 Design System

### Color Palette

```typescript
// Primary Colors
Primary Main: #FF6A00 (Orange)
Primary Light: #FF8533
Primary Dark: #E55A00

// Factions
Fire Dragon (HỐA LONG): #DC143C (Red)
Fairy (TỪ TIÊN): #0066CC (Blue)

// Background
Dark: #0A0E27
Darker: #050812
```

### Typography

- **Primary Font**: Poppins (weights: 400, 500, 600, 700, 800)
- **Secondary Font**: Space Mono (monospace)
- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl

### Spacing

- **Units**: xs (0.25rem), sm (0.5rem), md (1rem), lg (1.5rem), xl (2rem), 2xl (3rem), 3xl (4rem), 4xl (6rem)

### Shadows & Effects

- **Glow**: `0 0 20px rgba(255, 106, 0, 0.4)`
- **Heavy Glow**: `0 0 40px rgba(255, 106, 0, 0.6)`
- **Glassmorphism**: `backdrop-filter: blur(10px)`

## 🎯 Component Documentation

### BattleCard (⭐ Featured Component)

The main component for displaying faction battles with progress bars and animated values.

**Props:**
```typescript
interface BattleCardProps {
  faction1: FactionData;
  faction2: FactionData;
  animated?: boolean;
  onViewDetails?: () => void;
}

interface FactionData {
  name: string;
  players: number;
  score: number;
  maxScore?: number;
  color: 'red' | 'blue';
}
```

**Usage:**
```tsx
import { BattleCard } from '@/components/game/BattleCard';

export default function ArenaPage() {
  return (
    <BattleCard
      faction1={{
        name: 'HỐA LONG',
        players: 150,
        score: 85,
        maxScore: 100,
        color: 'red',
      }}
      faction2={{
        name: 'TỪ TIÊN',
        players: 145,
        score: 70,
        maxScore: 100,
        color: 'blue',
      }}
      animated={true}
      onViewDetails={() => console.log('View details')}
    />
  );
}
```

**Features:**
- ✅ Dual progress bars (red vs blue)
- ✅ Animated stat counters
- ✅ Faction color coding
- ✅ Responsive design
- ✅ Hover effects with glow
- ✅ VS badge with gradient

---

### Button Component

Multiple button variants with consistent styling.

```tsx
import { Button } from '@/components/ui/Button';

// Variants: primary, secondary, success, outline
<Button variant="primary" size="lg" fullWidth>
  Click Me
</Button>

<Button variant="secondary" size="sm" disabled>
  Disabled
</Button>

<Button variant="success" onClick={handleClick}>
  Success Action
</Button>
```

---

### ProgressBar Component

Animated progress bars with faction colors.

```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar
  value={75}
  maxValue={100}
  variant="red"
  animated={true}
  label="Attack Power"
  valueLabel="75/100"
/>
```

---

### PricingCard Component

Cards for game top-up packages.

```tsx
import { PricingCard } from '@/components/game/PricingCard';

<PricingCard
  icon="💎"
  title="CHIẾN BINH"
  price="250,000"
  currency="VND"
  gems={100}
  discount={5}
  badge="POPULAR"
  onClick={handlePurchase}
/>
```

---

### RankingList Component

Display ranked players with gems and badges.

```tsx
import { RankingList } from '@/components/game/RankingList';

const items = [
  { rank: 1, name: 'ThiênAnh', points: 500000, badge: '👑' },
  { rank: 2, name: 'PhoenixLord', points: 450000, badge: '⭐' },
];

<RankingList items={items} maxItems={10} />
```

---

### Modal Component

Flexible modal for dialogs and forms.

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  title="Confirm Purchase"
  onClose={handleClose}
  width="600px"
>
  {/* Modal content */}
</Modal>
```

---

## 📱 Responsive Design

The project is **mobile-first** with breakpoints:

- **sm**: 640px
- **md**: 768px  
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

Example:
```tsx
const Container = styled.div`
  padding: ${theme.spacing['2xl']};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.lg};
  }
`;
```

## 🎬 Pages Overview

### 🏠 Home Page (`/`)
- Hero section with gradient background
- Featured battle cards
- Call-to-action section
- Responsive layout

### ⚔️ Arena Page (`/arena`)
- Current battles display
- Top ranking leaderboard
- Battle card showcase
- Real-time faction information

### 💰 Top-Up Page (`/topup`)
- Pricing card grid
- Package selection
- Payment modal
- Discount information

### 📋 Orders Page (`/orders`)
- Order history table
- Status indicators
- Order details
- Search/filter ready

## 🔧 Configuration

### Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GAME_NAME=Đảo Khủng Long
```

### TypeScript Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 📦 Dependencies

### Production
- **Next.js** 14.1 - React framework
- **React** 18.3 - UI library
- **styled-components** 6.1 - CSS-in-JS
- **framer-motion** 10.16 - Animation library
- **@react-icons** - Icon library

### Development
- **TypeScript** 5.3 - Type safety
- **Prettier** 3.1 - Code formatter

## 🚀 Performance Features

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ CSS-in-JS optimization
- ✅ Font optimization (Google Fonts)

## 🔐 Security

- ✅ Content Security Policy ready
- ✅ XSS protection via React
- ✅ CSRF token ready
- ✅ Input sanitization hooks available

## 📝 Code Quality

```bash
# Type checking
npm run type-check

# Format code
npm run format

# Lint (ready to configure)
npm run lint
```

## 🎓 Best Practices Implemented

1. **Component Structure**: Atomic design with clear separation
2. **State Management**: React hooks with custom hooks
3. **Styling**: styled-components with design tokens
4. **Type Safety**: Full TypeScript coverage
5. **Accessibility**: Semantic HTML, ARIA labels ready
6. **Performance**: Code splitting, lazy loading
7. **Responsive**: Mobile-first approach
8. **Maintainability**: Clear naming, documentation

## 🎨 Customization

### Adding a New Page

```tsx
// app/(public)/newpage/page.tsx
'use client';

import styled from 'styled-components';
import { theme } from '@/styles/theme';

export default function NewPage() {
  return <div>Your content here</div>;
}
```

### Creating a New Component

```tsx
// components/ui/NewComponent.tsx
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const Container = styled.div`
  /* Your styles */
`;

export const NewComponent = () => {
  return <Container>Component</Container>;
};
```

### Extending the Theme

```typescript
// styles/theme.ts
export const theme = {
  colors: {
    // Add custom colors
    custom: '#YOURCOLOR',
  },
  // Add new properties
};
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use styled-components for styling
3. Maintain TypeScript types
4. Test on mobile/tablet
5. Document new components

## 📄 License

© 2026 Đảo Khủng Long. All rights reserved.

## 🆘 Support

For issues or questions:
- Check existing documentation
- Review component examples
- Consult design tokens in `styles/theme.ts`

---

**Built with ❤️ for gamers** 🦖⚔️

/*
  Connect DBeaver to this database:
  1. New Connection -> PostgreSQL
  2. Host: localhost  Port: 5432
  3. Database: dinoisland_db
  4. Username/Password: same as DATABASE_URL in .env
  5. Test Connection -> Finish
  You will see the "User" table under: dinoisland_db -> Schemas -> public -> Tables
*/
