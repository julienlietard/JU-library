import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUAvatar } from './ju-avatar';

const meta: Meta<typeof JUAvatar> = {
  title: 'Components/JUAvatar',
  component: JUAvatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: [undefined, 'online', 'busy', 'offline', 'away'] },
  },
};
export default meta;
type Story = StoryObj<typeof JUAvatar>;

const DEMO_IMG = 'https://i.pravatar.cc/200?img=11';

export const WithImage: Story = {
  args: { src: DEMO_IMG, alt: 'Julien Lietard', size: 'lg', status: 'online' },
};

export const Initials: Story = {
  args: { initials: 'JL', size: 'lg' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <JUAvatar src={DEMO_IMG} size="xs" alt="" />
      <JUAvatar src={DEMO_IMG} size="sm" alt="" />
      <JUAvatar src={DEMO_IMG} size="md" alt="" />
      <JUAvatar src={DEMO_IMG} size="lg" alt="" />
      <JUAvatar src={DEMO_IMG} size="xl" alt="" />
    </div>
  ),
};

export const StatusVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
      <JUAvatar src={DEMO_IMG} size="lg" status="online" alt="Online" />
      <JUAvatar src={DEMO_IMG} size="lg" status="busy" alt="Busy" />
      <JUAvatar src={DEMO_IMG} size="lg" status="away" alt="Away" />
      <JUAvatar src={DEMO_IMG} size="lg" status="offline" alt="Offline" />
    </div>
  ),
};

export const GlassOnDark: Story = {
  render: () => (
    <div style={{
      padding: '3rem', borderRadius: '24px',
      background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <JUAvatar src={DEMO_IMG} size="xl" glass status="online" alt="" />
      <div style={{ color: 'white' }}>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Julien Lietard</div>
        <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>Web Engineer @ Orléans</div>
      </div>
    </div>
  ),
};

export const InitialsFallback: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <JUAvatar initials="JL" size="md" />
      <JUAvatar initials="AB" size="md" />
      <JUAvatar initials="?" size="md" />
    </div>
  ),
};
