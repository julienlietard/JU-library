import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUBreadcrumbs } from './ju-breadcrumbs';

const meta: Meta<typeof JUBreadcrumbs> = {
  title: 'Navigation/JUBreadcrumbs',
  component: JUBreadcrumbs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUBreadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Composants', href: '/composants' },
      { label: 'Boutons' },
    ],
  },
};

export const Long: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Système de Design', href: '/design-system' },
      { label: 'Composants', href: '/design-system/composants' },
      { label: 'Formulaires', href: '/design-system/composants/formulaires' },
      { label: 'Champs de texte', href: '/design-system/composants/formulaires/champs' },
      { label: 'Variantes' },
    ],
    maxItems: 4,
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Maquettes', href: '/maquettes' },
      { label: 'Grille responsive' },
    ],
    separator: '/',
  },
};
