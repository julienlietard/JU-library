import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSearchBar } from './ju-search-bar';

const meta: Meta<typeof JUSearchBar> = {
  title: 'Molecules/JUSearchBar',
  component: JUSearchBar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['glass', 'solid', 'dark'] },
    platform: { control: 'select', options: ['mac', 'win', 'none'] },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUSearchBar>;

/* --- Glass (par défaut) --- */

export const Glass: Story = {
  args: {
    variant: 'glass',
    placeholder: 'Rechercher un composant...',
    platform: 'mac',
  },
};

/* --- Solid --- */

export const Solid: Story = {
  args: {
    variant: 'solid',
    placeholder: 'Rechercher maquettes, grilles...',
    platform: 'mac',
  },
};

/* --- Dark --- */

export const Dark: Story = {
  args: {
    variant: 'dark',
    placeholder: 'Rechercher...',
    platform: 'mac',
  },
};

/* --- Tailles --- */

export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'solid',
    placeholder: 'Recherche rapide...',
    platform: 'mac',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'solid',
    placeholder: 'Rechercher typographies, palettes, icônes...',
    platform: 'mac',
  },
};

/* --- Raccourci Windows --- */

export const WindowsPlatform: Story = {
  args: {
    variant: 'solid',
    platform: 'win',
    placeholder: 'Rechercher...',
  },
};

/* --- Sans raccourci --- */

export const NoShortcut: Story = {
  args: {
    variant: 'solid',
    platform: 'none',
    placeholder: 'Saisissez votre recherche...',
  },
};

/* --- Désactivé --- */

export const Disabled: Story = {
  args: {
    variant: 'solid',
    placeholder: 'Rechercher...',
    disabled: true,
  },
};
