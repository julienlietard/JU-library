import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSkeleton } from './ju-skeleton';

const meta: Meta<typeof JUSkeleton> = {
  title: 'Atoms/JUSkeleton',
  component: JUSkeleton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUSkeleton>;

export const Text: Story = { args: { variant: 'text', width: 300 } };
export const MultiLine: Story = { args: { variant: 'text', lines: 4, width: 400 } };
export const Circular: Story = { args: { variant: 'circular', width: 56, height: 56 } };
export const Rectangular: Story = { args: { variant: 'rectangular', width: 300, height: 180 } };
export const Rounded: Story = { args: { variant: 'rounded', width: 300, height: 180 } };
export const Pulse: Story = { args: { variant: 'rounded', width: 300, height: 120, animation: 'pulse' } };

export const ArticleCard: Story = {
  name: 'Carte de composant',
  render: () => (
    <div style={{ display: 'flex', gap: 16, padding: 20, background: 'white', borderRadius: 16, maxWidth: 500 }}>
      <JUSkeleton variant="rounded" width={120} height={120} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <JUSkeleton variant="text" width="80%" height={20} />
        <JUSkeleton variant="text" lines={3} />
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <JUSkeleton variant="circular" width={24} height={24} />
          <JUSkeleton variant="text" width={100} />
        </div>
      </div>
    </div>
  ),
};
