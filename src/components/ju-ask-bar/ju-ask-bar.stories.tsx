import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUAskBar } from './ju-ask-bar';

const meta: Meta<typeof JUAskBar> = {
  title: 'Organisms/JUAskBar',
  component: JUAskBar,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'radio', options: ['auto', 'light', 'dark'] },
    currentModel: { control: 'text' },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.args.theme === 'dark';
      return (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '4rem 2rem', 
            backgroundColor: isDark ? '#030712' : '#f3f4f6',
            transition: 'background-color 0.3s ease'
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof JUAskBar>;

/* ══════════════════════════════════════════════
   1. ÉTAT PAR DÉFAUT (Outils visibles)
   ══════════════════════════════════════════════ */
export const Default: Story = {
  args: { 
    placeholder: 'Posez une question...',
    theme: 'auto',
    currentModel: 'Claude Sonnet 3.5'
  },
};

/* ══════════════════════════════════════════════
   2. ÉTAT SAISIE (Bouton d'envoi visible)
   ══════════════════════════════════════════════ */
export const WithText: Story = {
  name: 'En cours de frappe',
  args: { 
    placeholder: 'Posez une question...', 
    value: 'Peux-tu me générer un composant React pour une modale ?',
  },
};

/* ══════════════════════════════════════════════
   3. ÉTAT CHARGEMENT (Skeleton)
   ══════════════════════════════════════════════ */
export const Loading: Story = {
  name: 'Chargement (Skeleton)',
  args: { 
    placeholder: 'Réflexion en cours...', 
    loading: true, 
    value: 'Peux-tu me générer un composant React pour une modale ?' 
  },
};

/* ══════════════════════════════════════════════
   4. THÈME SOMBRE
   ══════════════════════════════════════════════ */
export const DarkTheme: Story = {
  name: 'Thème Sombre',
  args: { 
    placeholder: 'Tapez @ pour afficher les connecteurs et sources...', 
    theme: 'dark',
    currentModel: 'GPT-4o'
  },
};

/* ══════════════════════════════════════════════
   5. DÉSACTIVÉ
   ══════════════════════════════════════════════ */
export const Disabled: Story = {
  name: 'Désactivé',
  args: { 
    placeholder: 'Chat indisponible pour le moment.', 
    disabled: true 
  },
};