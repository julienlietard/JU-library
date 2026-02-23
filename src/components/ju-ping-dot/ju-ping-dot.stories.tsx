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
        <JUPingDot color="green" pulse /> Available
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="orange" pulse /> Busy
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="red" pulse /> Offline
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="gray" pulse={false} /> Away
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <JUPingDot color="blue" pulse /> Streaming
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '1rem', fontWeight: 500 }}>
      <JUPingDot color="green" pulse size={10} />
      Disponible pour de nouvelles opportunités
    </div>
  ),
};
