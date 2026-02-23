import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUBadge } from './ju-badge';
const meta: Meta<typeof JUBadge> = { title: 'Components/JUBadge', component: JUBadge, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof JUBadge>;
export const Default: Story = { args: { label: 'Technologies', color: 'green', icon: <span>💻</span> } };
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '2rem' }}>
      <JUBadge label="Technologies" color="green" icon={<span>💻</span>} />
      <JUBadge label="Aerospace" color="blue" icon={<span>✈</span>} />
      <JUBadge label="Astronomie" color="purple" icon={<span>🔭</span>} />
      <JUBadge label="Recherche" color="orange" icon={<span>🔬</span>} />
      <JUBadge label="Design" color="pink" icon={<span>🎨</span>} />
      <JUBadge label="DevOps" color="red" icon={<span>⚙</span>} />
    </div>
  ),
};
export const GlassVariant: Story = {
  render: () => (
    <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <JUBadge label="React" glass />
        <JUBadge label="TypeScript" glass />
        <JUBadge label="Azure" glass />
        <JUBadge label="Docker" glass />
      </div>
    </div>
  ),
};
