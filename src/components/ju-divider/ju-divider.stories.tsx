import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUDivider } from './ju-divider';

const meta: Meta<typeof JUDivider> = {
  title: 'Components/JUDivider', component: JUDivider, tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUDivider>;

export const Solid: Story = { args: { variant: 'solid' } };
export const Dashed: Story = { args: { variant: 'dashed' } };
export const Gradient: Story = { args: { variant: 'gradient' } };
export const Dotted: Story = { args: { variant: 'dot' } };
export const WithLabel: Story = { args: { variant: 'solid', label: 'Formation' } };
export const GradientWithLabel: Story = { args: { variant: 'gradient', label: 'or' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <p>Content above</p>
      <JUDivider variant="solid" />
      <p>Solid divider</p>
      <JUDivider variant="dashed" />
      <p>Dashed divider</p>
      <JUDivider variant="gradient" />
      <p>Gradient divider</p>
      <JUDivider variant="gradient" label="Section" />
      <p>With label</p>
    </div>
  ),
};
