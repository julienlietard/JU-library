import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUAskBar } from './ju-ask-bar';

const meta: Meta<typeof JUAskBar> = {
  title: 'Forms/JUAskBar',
  component: JUAskBar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['raised', 'flat', 'outline'] },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUAskBar>;

/* ══════════════════════════════════════════════
   1. PAR DÉFAUT
   ══════════════════════════════════════════════ */

export const Default: Story = {
  args: { placeholder: 'Posez une question..' },
};

/* ══════════════════════════════════════════════
   2. TAILLES
   ══════════════════════════════════════════════ */

export const Small: Story = {
  args: { placeholder: 'Question rapide...', size: 'sm' },
};

export const Medium: Story = {
  args: { placeholder: 'Posez une question..', size: 'md' },
};

export const Large: Story = {
  args: { placeholder: 'Que souhaitez-vous savoir sur le design system ?', size: 'lg' },
};

export const AllSizes: Story = {
  name: 'Toutes les tailles',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
      <JUAskBar placeholder="Petit" size="sm" />
      <JUAskBar placeholder="Moyen" size="md" />
      <JUAskBar placeholder="Grand" size="lg" />
    </div>
  ),
  decorators: [],
};

/* ══════════════════════════════════════════════
   3. VARIANTES
   ══════════════════════════════════════════════ */

export const Raised: Story = {
  args: { placeholder: 'Surélevé (par défaut)', variant: 'raised' },
};

export const Flat: Story = {
  args: { placeholder: 'Surface plate', variant: 'flat' },
};

export const Outline: Story = {
  args: { placeholder: 'Contour bordure', variant: 'outline' },
};

export const AllVariants: Story = {
  name: 'Toutes les variantes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
      <JUAskBar placeholder="Surélevé" variant="raised" />
      <JUAskBar placeholder="Plat" variant="flat" />
      <JUAskBar placeholder="Contour" variant="outline" />
    </div>
  ),
  decorators: [],
};

/* ══════════════════════════════════════════════
   4. RACCOURCI CLAVIER
   ══════════════════════════════════════════════ */

export const WithShortcut: Story = {
  name: 'Avec raccourci',
  args: { placeholder: 'Posez une question..', shortcut: '\u2318 + K' },
};

export const CustomShortcut: Story = {
  name: 'Raccourci personnalisé',
  args: { placeholder: 'Appuyez sur Entrée pour envoyer', shortcut: 'Enter' },
};

export const NoShortcut: Story = {
  name: 'Sans raccourci',
  args: { placeholder: 'Posez une question..', shortcut: false },
};

/* ══════════════════════════════════════════════
   5. CHARGEMENT
   ══════════════════════════════════════════════ */

export const Loading: Story = {
  args: { placeholder: 'Génération en cours...', loading: true, value: 'Qu\u2019est-ce qu\u2019une grille typographique ?' },
};

export const LoadingSmall: Story = {
  name: 'Chargement (Petit)',
  args: { placeholder: 'Réflexion...', loading: true, value: 'palette', size: 'sm' },
};

/* ══════════════════════════════════════════════
   6. LONGUEUR MAXIMALE
   ══════════════════════════════════════════════ */

export const WithMaxLength: Story = {
  name: 'Avec longueur max',
  args: { placeholder: '100 caractères maximum...', maxLength: 100 },
};

export const MaxLengthSmall: Story = {
  name: 'Longueur max (Petit)',
  args: { placeholder: 'Prompt court...', maxLength: 50, size: 'sm' },
};

/* ══════════════════════════════════════════════
   7. ICÔNE PERSONNALISÉE
   ══════════════════════════════════════════════ */

const SparkleIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

const SendIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export const CustomIcon: Story = {
  name: 'Icône personnalisée (Étincelle)',
  args: { placeholder: 'Demandez n\u2019importe quoi à l\u2019IA...', icon: SparkleIcon },
};

export const SendIconStory: Story = {
  name: 'Icône personnalisée (Envoyer)',
  args: { placeholder: 'Envoyer un message...', icon: SendIcon },
};

/* ══════════════════════════════════════════════
   8. DÉSACTIVÉ
   ══════════════════════════════════════════════ */

export const Disabled: Story = {
  args: { placeholder: 'Posez une question..', disabled: true },
};

/* ══════════════════════════════════════════════
   9. COMBINAISONS
   ══════════════════════════════════════════════ */

export const FullFeatured: Story = {
  name: 'Toutes les options',
  args: {
    placeholder: 'Demandez n\u2019importe quoi...',
    size: 'lg',
    variant: 'raised',
    shortcut: '\u2318 + K',
    maxLength: 200,
    icon: SparkleIcon,
  },
};

export const MinimalFlat: Story = {
  name: 'Plat minimaliste',
  args: {
    placeholder: 'Saisissez ici...',
    size: 'sm',
    variant: 'flat',
    shortcut: false,
  },
};

export const OutlineWithCounter: Story = {
  name: 'Contour + Compteur',
  args: {
    placeholder: 'Rédigez votre prompt...',
    variant: 'outline',
    maxLength: 150,
    shortcut: 'Enter',
  },
};

/* ══════════════════════════════════════════════
   10. MATRICE TAILLES x VARIANTES
   ══════════════════════════════════════════════ */

export const SizesVariantsMatrix: Story = {
  name: 'Tailles x Variantes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', padding: '2rem' }}>
      {(['raised', 'flat', 'outline'] as const).map((v) => (
        <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{v}</span>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <JUAskBar placeholder="Petit" variant={v} size="sm" shortcut={false} />
          </div>
        </div>
      ))}
    </div>
  ),
  decorators: [],
};
