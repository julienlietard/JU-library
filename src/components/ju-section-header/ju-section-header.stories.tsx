import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSectionHeader } from './ju-section-header';

const meta: Meta<typeof JUSectionHeader> = {
  title: 'Components/JUSectionHeader', component: JUSectionHeader, tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: '2rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUSectionHeader>;

export const Default: Story = { args: { subtitle: 'Explorez nos', title: 'Composants' } };
export const LeftAligned: Story = { args: { subtitle: 'Découvrez les', title: 'Maquettes', align: 'left' } };
export const TitleOnly: Story = { args: { title: 'Système Typographique' } };

export const PortfolioSections: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <JUSectionHeader subtitle="Explorez nos" title="Composants" />
      <JUSectionHeader subtitle="Découvrez les" title="Maquettes" />
      <JUSectionHeader title="Palette de Couleurs" />
      <JUSectionHeader subtitle="Consultez la" title="Grille & Espacements" />
    </div>
  ),
};
