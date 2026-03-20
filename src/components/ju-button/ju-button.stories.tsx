import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUButton } from './ju-button';

const meta: Meta<typeof JUButton> = {
  title: 'Atoms/JUButton',
  component: JUButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'dark', 'ghost', 'outline', 'ai', 'danger'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    effect: { control: 'select', options: ['none', 'glass', 'aurora', 'glow'] },
    borderStyle: { control: 'select', options: ['none', 'subtle', 'bold', 'raised', 'accent'] },
  },
};

export default meta;
type Story = StoryObj<typeof JUButton>;

/* ══════════════════════════════════════════════
   1. LES QUATRE THÈMES PRINCIPAUX
   ══════════════════════════════════════════════ */

export const Primary: Story = {
  args: { label: 'Primaire', variant: 'primary' },
};

export const Secondary: Story = {
  args: { label: 'Secondaire', variant: 'secondary' },
};

export const Dark: Story = {
  args: { label: 'Sombre', variant: 'dark' },
};

export const AskAI: Story = {
  args: { label: 'Demander à l\'IA', variant: 'ai' },
};

export const FourThemes: Story = {
  name: 'The Four Themes',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Primaire" variant="primary" />
      <JUButton label="Secondaire" variant="secondary" />
      <JUButton label="Sombre" variant="dark" />
      <JUButton label="Demander à l'IA" variant="ai" />
    </div>
  ),
};

/* ══════════════════════════════════════════════
   2. TOUTES LES VARIANTES
   ══════════════════════════════════════════════ */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <JUButton label="Primaire" variant="primary" />
        <JUButton label="Secondaire" variant="secondary" />
        <JUButton label="Sombre" variant="dark" />
        <JUButton label="Contour" variant="outline" />
        <JUButton label="Fantôme" variant="ghost" />
        <JUButton label="Danger" variant="danger" />
        <JUButton label="Demander à l'IA" variant="ai" />
      </div>
    </div>
  ),
};

/* ══════════════════════════════════════════════
   3. TAILLES
   ══════════════════════════════════════════════ */

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Petit" variant="primary" size="sm" />
      <JUButton label="Moyen" variant="primary" size="md" />
      <JUButton label="Grand" variant="primary" size="lg" />
    </div>
  ),
};

export const SizesAllVariants: Story = {
  name: 'Sizes x Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '2rem' }}>
      {(['primary', 'secondary', 'dark', 'ai'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <JUButton label="Sm" variant={v} size="sm" />
          <JUButton label="Md" variant={v} size="md" />
          <JUButton label="Lg" variant={v} size="lg" />
          <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: 4 }}>{v}</span>
        </div>
      ))}
    </div>
  ),
};

/* ══════════════════════════════════════════════
   4. EFFETS
   ══════════════════════════════════════════════ */

export const GlassEffect: Story = {
  args: { label: 'Bouton vitré', variant: 'ghost', effect: 'glass' },
};

export const GlowEffect: Story = {
  args: {
    label: 'Lueur',
    variant: 'primary',
    effect: 'glow',
    customColors: { glow: 'rgba(27, 130, 255, 0.5)' },
  },
};

export const AuroraEffect: Story = {
  args: { label: 'Aurora IA', variant: 'ai', effect: 'aurora' },
};

export const AllEffects: Story = {
  name: 'All Effects',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Aucun" variant="primary" effect="none" />
      <JUButton label="Lueur" variant="primary" effect="glow" customColors={{ glow: 'rgba(27, 130, 255, 0.5)' }} />
      <JUButton label="Vitré" variant="ghost" effect="glass" />
      <JUButton label="Aurora" variant="ai" effect="aurora" />
    </div>
  ),
};

/* ══════════════════════════════════════════════
   5. AVEC ICÔNES
   ══════════════════════════════════════════════ */

const PlusIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="3" x2="8" y2="13" /><line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const ArrowIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="8" x2="13" y2="8" /><polyline points="9,4 13,8 9,12" />
  </svg>
);

const HeartIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SendIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <JUButton label="Ajouter un élément" variant="primary" icon={PlusIcon} />
        <JUButton label="Continuer" variant="dark" icon={ArrowIcon} iconPlacement="right" />
        <JUButton label="Favori" variant="danger" icon={HeartIcon} />
        <JUButton label="Envoyer" variant="ai" icon={SendIcon} iconPlacement="right" />
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <JUButton label="Ajouter" variant="secondary" icon={PlusIcon} size="sm" />
        <JUButton label="Ajouter" variant="secondary" icon={PlusIcon} size="md" />
        <JUButton label="Ajouter" variant="secondary" icon={PlusIcon} size="lg" />
      </div>
    </div>
  ),
};

/* ══════════════════════════════════════════════
   6. ICÔNE SEULE
   ══════════════════════════════════════════════ */

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Ajouter" variant="primary" icon={PlusIcon} iconOnly />
      <JUButton label="Envoyer" variant="dark" icon={SendIcon} iconOnly />
      <JUButton label="Favori" variant="danger" icon={HeartIcon} iconOnly />
      <JUButton label="Demander à l'IA" variant="ai" iconOnly />
      <JUButton label="Ajouter" variant="secondary" icon={PlusIcon} iconOnly />
      <JUButton label="Ajouter" variant="outline" icon={PlusIcon} iconOnly />
      <JUButton label="Ajouter" variant="ghost" icon={PlusIcon} iconOnly />
    </div>
  ),
};

export const IconOnlySizes: Story = {
  name: 'Icon Only Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Ajouter" variant="dark" icon={PlusIcon} iconOnly size="sm" />
      <JUButton label="Ajouter" variant="dark" icon={PlusIcon} iconOnly size="md" />
      <JUButton label="Ajouter" variant="dark" icon={PlusIcon} iconOnly size="lg" />
    </div>
  ),
};

/* ══════════════════════════════════════════════
   7. LOADING STATES
   ══════════════════════════════════════════════ */

export const Loading: Story = {
  args: { label: 'Saving...', variant: 'primary', loading: true },
};

export const LoadingVariants: Story = {
  name: 'Loading States',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Saving" variant="primary" loading />
      <JUButton label="Loading" variant="secondary" loading />
      <JUButton label="Processing" variant="dark" loading />
      <JUButton label="Generating" variant="ai" loading />
      <JUButton label="Deleting" variant="danger" loading />
    </div>
  ),
};

export const LoadingIconOnly: Story = {
  name: 'Loading Icon Only',
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Send" variant="primary" icon={SendIcon} iconOnly loading />
      <JUButton label="Send" variant="dark" icon={SendIcon} iconOnly loading />
      <JUButton label="AI" variant="ai" iconOnly loading />
    </div>
  ),
};

/* ══════════════════════════════════════════════
   8. BORDER STYLES
   ══════════════════════════════════════════════ */

export const BorderSubtle: Story = {
  name: 'Border: Subtle',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Primary" variant="primary" borderStyle="subtle" />
      <JUButton label="Secondary" variant="secondary" borderStyle="subtle" />
      <JUButton label="Dark" variant="dark" borderStyle="subtle" />
      <JUButton label="AI" variant="ai" borderStyle="subtle" />
    </div>
  ),
};

export const BorderBold: Story = {
  name: 'Border: Bold',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Primary" variant="primary" borderStyle="bold" />
      <JUButton label="Secondary" variant="secondary" borderStyle="bold" />
      <JUButton label="Dark" variant="dark" borderStyle="bold" />
      <JUButton label="AI" variant="ai" borderStyle="bold" />
    </div>
  ),
};

export const BorderRaised: Story = {
  name: 'Border: Raised',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Primary" variant="primary" borderStyle="raised" />
      <JUButton label="Secondary" variant="secondary" borderStyle="raised" />
      <JUButton label="Dark" variant="dark" borderStyle="raised" />
      <JUButton label="Ghost" variant="ghost" borderStyle="raised" />
    </div>
  ),
};

export const BorderAccent: Story = {
  name: 'Border: Accent',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Primary" variant="primary" borderStyle="accent" />
      <JUButton label="Dark" variant="dark" borderStyle="accent" />
      <JUButton label="AI" variant="ai" borderStyle="accent" />
      <JUButton label="Danger" variant="danger" borderStyle="accent" />
    </div>
  ),
};

export const AllBorders: Story = {
  name: 'All Border Styles',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '2rem' }}>
      {(['none', 'subtle', 'bold', 'raised', 'accent'] as const).map((b) => (
        <div key={b} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <JUButton label="Primary" variant="primary" borderStyle={b} />
          <JUButton label="Secondary" variant="secondary" borderStyle={b} />
          <JUButton label="Dark" variant="dark" borderStyle={b} />
          <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: 4 }}>{b}</span>
        </div>
      ))}
    </div>
  ),
};

/* ══════════════════════════════════════════════
   9. DISABLED
   ══════════════════════════════════════════════ */

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton label="Primary" variant="primary" disabled />
      <JUButton label="Secondary" variant="secondary" disabled />
      <JUButton label="Dark" variant="dark" disabled />
      <JUButton label="AI" variant="ai" disabled />
    </div>
  ),
};

/* ══════════════════════════════════════════════
   9. FULL WIDTH
   ══════════════════════════════════════════════ */

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '2rem', maxWidth: 400 }}>
      <JUButton label="Sign in" variant="dark" isFullWidth />
      <JUButton label="Continue with Google" variant="secondary" isFullWidth icon={PlusIcon} />
      <JUButton label="Ask AI" variant="ai" isFullWidth />
    </div>
  ),
};

/* ══════════════════════════════════════════════
   10. CUSTOM COLORS
   ══════════════════════════════════════════════ */

export const CustomColors: Story = {
  name: 'Custom Colors',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', padding: '2rem' }}>
      <JUButton
        label="Spotify Green"
        customColors={{ bg: '#1DB954', text: '#fff' }}
      />
      <JUButton
        label="Notion"
        customColors={{ bg: '#000', text: '#fff' }}
      />
      <JUButton
        label="Figma"
        customColors={{ bg: '#a259ff', text: '#fff' }}
        effect="glow"
      />
      <JUButton
        label="Gradient"
        customColors={{ bg: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)', text: '#fff' }}
      />
    </div>
  ),
};
