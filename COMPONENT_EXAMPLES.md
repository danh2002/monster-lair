/**
 * COMPONENT EXAMPLES & USAGE GUIDE
 * 
 * This file demonstrates how to use all components in the Monster Lair project.
 * Copy and adapt these examples for your pages.
 */

import React from 'react';
import { BattleCard } from '@/components/game/BattleCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PricingCard } from '@/components/game/PricingCard';
import { RankingList } from '@/components/game/RankingList';

// ============================================================
// BUTTON EXAMPLES
// ============================================================

export function ButtonExamples() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {/* Primary Button */}
      <Button variant="primary" size="lg">
        Primary Button
      </Button>

      {/* Secondary Button */}
      <Button variant="secondary" size="md">
        Secondary Button
      </Button>

      {/* Success Button */}
      <Button variant="success" size="sm">
        Success Button
      </Button>

      {/* Outline Button */}
      <Button variant="outline">
        Outline Button
      </Button>

      {/* Disabled Button */}
      <Button variant="primary" disabled>
        Disabled
      </Button>

      {/* Full Width */}
      <Button variant="primary" fullWidth>
        Full Width Button
      </Button>
    </div>
  );
}

// ============================================================
// INPUT EXAMPLES
// ============================================================

export function InputExamples() {
  const [values, setValues] = React.useState({
    email: '',
    password: '',
    username: '',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      {/* Basic Input */}
      <Input
        placeholder="Enter your email"
        type="email"
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
      />

      {/* Input with Label */}
      <Input
        label="Username"
        placeholder="Enter username"
        value={values.username}
        onChange={(e) => setValues({ ...values, username: e.target.value })}
      />

      {/* Password Input */}
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={values.password}
        onChange={(e) => setValues({ ...values, password: e.target.value })}
      />

      {/* Disabled Input */}
      <Input label="Disabled Field" placeholder="Can't edit" disabled />
    </div>
  );
}

// ============================================================
// PROGRESS BAR EXAMPLES
// ============================================================

export function ProgressBarExamples() {
  const [progress, setProgress] = React.useState(65);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px' }}>
      {/* Red Progress Bar */}
      <div>
        <h4>Red Faction Progress</h4>
        <ProgressBar
          value={75}
          maxValue={100}
          variant="red"
          animated
          label="HỐA LONG Attack"
          valueLabel="75/100"
        />
      </div>

      {/* Blue Progress Bar */}
      <div>
        <h4>Blue Faction Progress</h4>
        <ProgressBar
          value={60}
          maxValue={100}
          variant="blue"
          animated
          label="TỪ TIÊN Defense"
          valueLabel="60/100"
        />
      </div>

      {/* Primary Progress Bar */}
      <div>
        <h4>Primary Progress</h4>
        <ProgressBar
          value={progress}
          maxValue={100}
          variant="primary"
          animated
          label={`Progress: ${progress}%`}
        />
        <button onClick={() => setProgress((p) => (p + 10) % 110)}> Increment </button>
      </div>
    </div>
  );
}

// ============================================================
// BATTLE CARD EXAMPLES
// ============================================================

export function BattleCardExamples() {
  const [selectedBattle, setSelectedBattle] = React.useState<number | null>(null);

  const battles = [
    {
      faction1: {
        name: 'HỐA LONG',
        players: 150,
        score: 85,
        maxScore: 100,
        color: 'red' as const,
      },
      faction2: {
        name: 'TỪ TIÊN',
        players: 145,
        score: 70,
        maxScore: 100,
        color: 'blue' as const,
      },
    },
    {
      faction1: {
        name: 'HỐA LONG',
        players: 120,
        score: 65,
        maxScore: 100,
        color: 'red' as const,
      },
      faction2: {
        name: 'TỪ TIÊN',
        players: 135,
        score: 80,
        maxScore: 100,
        color: 'blue' as const,
      },
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
      {battles.map((battle, idx) => (
        <BattleCard
          key={idx}
          faction1={battle.faction1}
          faction2={battle.faction2}
          animated
          onViewDetails={() => setSelectedBattle(idx)}
        />
      ))}
      {selectedBattle !== null && <p>Selected battle: {selectedBattle}</p>}
    </div>
  );
}

// ============================================================
// PRICING CARD EXAMPLES
// ============================================================

export function PricingCardExamples() {
  const [selectedPackage, setSelectedPackage] = React.useState<string | null>(null);

  const packages = [
    {
      title: 'KHỞI ĐẦU',
      price: '130,000',
      currency: 'VND',
      gems: 50,
      discount: 0,
      badge: '',
    },
    {
      title: 'CHIẾN BINH',
      price: '250,000',
      currency: 'VND',
      gems: 100,
      discount: 5,
      badge: '',
    },
    {
      title: 'HÙNG HỔ',
      price: '2,200,000',
      currency: 'VND',
      gems: 1000,
      discount: 12,
      badge: 'BESTSELLER',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {packages.map((pkg, idx) => (
        <PricingCard
          key={idx}
          icon="💎"
          title={pkg.title}
          price={pkg.price}
          currency={pkg.currency}
          gems={pkg.gems}
          discount={pkg.discount}
          badge={pkg.badge}
          onClick={() => setSelectedPackage(pkg.title)}
        />
      ))}
      {selectedPackage && <p>Selected: {selectedPackage}</p>}
    </div>
  );
}

// ============================================================
// RANKING LIST EXAMPLES
// ============================================================

export function RankingListExamples() {
  const mockRanking = [
    { rank: 1, name: 'ThiênAnh', points: 500000, badge: '👑' },
    { rank: 2, name: 'PhoenixLord', points: 450000, badge: '⭐' },
    { rank: 3, name: 'DragonSlayer', points: 420000, badge: '🐉' },
    { rank: 4, name: 'ShadowHunter', points: 380000 },
    { rank: 5, name: 'MysticMage', points: 350000 },
    { rank: 6, name: 'IceWizard', points: 320000 },
    { rank: 7, name: 'FireBlade', points: 290000 },
    { rank: 8, name: 'LunarNight', points: 270000 },
  ];

  return (
    <div style={{ maxWidth: '600px' }}>
      <h3>Top 10 Players</h3>
      <RankingList items={mockRanking} maxItems={10} />
    </div>
  );
}

// ============================================================
// MODAL EXAMPLES
// ============================================================

export function ModalExamples() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        title="Purchase Confirmation"
        onClose={() => setIsOpen(false)}
        width="600px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>Are you sure you want to purchase this package?</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" fullWidth onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" fullWidth onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ============================================================
// CARD EXAMPLES
// ============================================================

export function CardExamples() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      <Card>
        <h3>Card Title</h3>
        <p>This is a card component with glassmorphism effect.</p>
        <Button variant="primary" size="sm">
          Action
        </Button>
      </Card>

      <Card>
        <h3>Another Card</h3>
        <p>Cards are reusable containers for content grouping.</p>
        <Button variant="secondary" size="sm">
          Learn More
        </Button>
      </Card>
    </div>
  );
}

// ============================================================
// COMPLETE PAGE EXAMPLE
// ============================================================

export default function ComponentExamples() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <section>
        <h2>Button Components</h2>
        <ButtonExamples />
      </section>

      <section>
        <h2>Input Components</h2>
        <InputExamples />
      </section>

      <section>
        <h2>Progress Bar Components</h2>
        <ProgressBarExamples />
      </section>

      <section>
        <h2>Battle Card Components</h2>
        <BattleCardExamples />
      </section>

      <section>
        <h2>Pricing Card Components</h2>
        <PricingCardExamples />
      </section>

      <section>
        <h2>Ranking List Components</h2>
        <RankingListExamples />
      </section>

      <section>
        <h2>Modal Components</h2>
        <ModalExamples />
      </section>

      <section>
        <h2>Card Components</h2>
        <CardExamples />
      </section>
    </div>
  );
}
