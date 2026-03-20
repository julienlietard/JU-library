import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUDivider } from './ju-divider';

const meta: Meta<typeof JUDivider> = {
  title: 'Atoms/JUDivider', component: JUDivider, tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUDivider>;

export const Solid: Story = { args: { variant: 'solid' } };
export const Dashed: Story = { args: { variant: 'dashed' } };
export const Gradient: Story = { args: { variant: 'gradient' } };
export const Dotted: Story = { args: { variant: 'dot' } };
export const WithLabel: Story = { args: { variant: 'solid', label: 'Typographie' } };
export const GradientWithLabel: Story = { args: { variant: 'gradient', label: 'ou' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p>Contenu au-dessus</p>
      <JUDivider variant="solid" />
      <p>Séparateur plein</p>
      <JUDivider variant="dashed" />
      <p>Séparateur en tirets</p>
      <JUDivider variant="gradient" />
      <p>Séparateur dégradé</p>
      <JUDivider variant="gradient" label="Section" />
      <p>Avec libellé</p>
    </div>
  ),
};
