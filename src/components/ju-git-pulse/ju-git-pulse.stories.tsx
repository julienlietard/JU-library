import type { Meta, StoryObj } from '@storybook/react';
import { JUGitPulse } from './ju-git-pulse';
import type { JUGitPulseData } from './ju-git-pulse';
import React, { useEffect } from 'react';

/* ---- Mock data ---- */

function randomActivity(weeks: number): number[] {
  return Array.from({ length: weeks * 7 }, () => {
    const r = Math.random();
    if (r < 0.3) return 0;
    if (r < 0.55) return Math.ceil(Math.random() * 2);
    if (r < 0.8) return Math.ceil(Math.random() * 5);
    return Math.ceil(Math.random() * 12);
  });
}

const mockData: JUGitPulseData = {
  commits: [
    { hash: 'a3f12d8', message: 'feat: add JUAppAudit sparkline component', date: '2026-03-15T10:32:00Z', author: 'Julien' },
    { hash: 'e9c4b01', message: 'fix: tooltip z-index on mobile viewports', date: '2026-03-14T18:05:00Z', author: 'Julien' },
    { hash: '7b2fa66', message: 'refactor: extract card variants to CSS modules', date: '2026-03-14T09:12:00Z', author: 'Julien' },
    { hash: 'c01dd97', message: 'chore: bump storybook to 8.x', date: '2026-03-13T15:44:00Z', author: 'Julien' },
    { hash: '5af8e23', message: 'feat: JUCreditCard glassmorphism variant', date: '2026-03-12T11:20:00Z', author: 'Julien' },
  ],
  activity: randomActivity(12),
  streak: 14,
};

const emptyData: JUGitPulseData = {
  commits: [],
  activity: Array(84).fill(0),
  streak: 0,
};

/** Decorator: mock fetch so the component gets data */
function withMockData(payload: JUGitPulseData) {
  const originalFetch = window.fetch;
  return (Story: React.ComponentType) => {
    window.fetch = (async () =>
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof window.fetch;
    useEffect(() => {
      return () => {
        window.fetch = originalFetch;
      };
    }, []);
    return <Story />;
  };
}

const meta: Meta<typeof JUGitPulse> = {
  title: 'Widgets/JUGitPulse',
  component: JUGitPulse,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
    weeks: { control: { type: 'range', min: 4, max: 24 } },
  },
};

export default meta;
type Story = StoryObj<typeof JUGitPulse>;

export const Default: Story = {
  decorators: [withMockData(mockData)],
  args: {
    endpoint: '/api/git-pulse',
    title: 'Git Pulse',
    weeks: 12,
  },
};

export const LongStreak: Story = {
  decorators: [withMockData({ ...mockData, streak: 42 })],
  args: {
    endpoint: '/api/git-pulse',
    title: 'Git Pulse',
    weeks: 16,
  },
};

export const NoActivity: Story = {
  decorators: [withMockData(emptyData)],
  args: {
    endpoint: '/api/git-pulse',
    title: 'Git Pulse',
    weeks: 12,
  },
};
