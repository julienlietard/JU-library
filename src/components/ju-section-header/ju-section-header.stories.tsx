import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSectionHeader } from './ju-section-header';

const meta: Meta<typeof JUSectionHeader> = {
  title: 'Components/JUSectionHeader', component: JUSectionHeader, tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: '2rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUSectionHeader>;

export const Default: Story = { args: { subtitle: 'Découvrez mon', title: 'Workspace' } };
export const LeftAligned: Story = { args: { subtitle: 'Découvrez mon', title: 'Parcours', align: 'left' } };
export const TitleOnly: Story = { args: { title: 'Mes Compétences' } };

export const PortfolioSections: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <JUSectionHeader subtitle="Découvrez mon" title="Workspace" />
      <JUSectionHeader subtitle="Découvrez mon" title="Parcours" />
      <JUSectionHeader title="Mes Compétences" />
      <JUSectionHeader subtitle="On en discute ?" title="Contact" />
    </div>
  ),
};
