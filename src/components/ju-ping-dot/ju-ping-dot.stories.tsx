import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUPingDot } from './ju-ping-dot';

const meta: Meta<typeof JUPingDot> = {
  title: 'Components/JUPingDot',
  component: JUPingDot,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['green', 'orange', 'red', 'gray', 'blue'] },
    size: { control: { type: 'range', min: 6, max: 24, step: 2 } },
  },
};
export default meta;
type Story = StoryObj<typeof JUPingDot>;

export const Default: Story = { args: { color: 'green', pulse: true } };

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="green" pulse /> Disponible
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="orange" pulse /> Occupe
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="red" pulse /> Hors ligne
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="gray" pulse={false} /> Absent
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="blue" pulse /> En diffusion
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '1rem', fontWeight: 500 }}>
      <JUPingDot color="green" pulse size={10} />
      Disponible pour de nouvelles opportunites
    </div>
  ),
};
