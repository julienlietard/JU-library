import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useCallback } from 'react';
import { JUFeedLayout } from './ju-feed-layout';
import { JUCard } from '../ju-card/ju-card';

/* ---- Fake card content ---- */

const colors = [
  'rgba(255, 78, 107, 0.08)',
  'rgba(99, 102, 241, 0.08)',
  'rgba(34, 197, 94, 0.08)',
  'rgba(245, 158, 11, 0.08)',
  'rgba(14, 165, 233, 0.08)',
  'rgba(168, 85, 247, 0.08)',
];

const titles = [
  'Refactor auth module',
  'Design new landing page',
  'Fix search indexing',
  'Migrate to PostgreSQL 16',
  'Update CI/CD pipeline',
  'Write API documentation',
  'Implement dark mode',
  'Add WebSocket support',
  'Optimize image loading',
  'Setup monitoring alerts',
  'Review security audit',
  'Deploy staging env',
];

function FakeCard({ index }: { index: number }) {
  const color = colors[index % colors.length];
  const title = titles[index % titles.length];
  const lines = 1 + (index % 3);

  return (
    <JUCard variant="glass" padding="md">
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: color,
          marginBottom: 10,
        }}
      />
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: '0.78rem', opacity: 0.5, lineHeight: 1.5 }}>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i}>
            Lorem ipsum dolor sit amet consectetur.{' '}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: '0.7rem',
          opacity: 0.35,
          fontFamily: 'monospace',
        }}
      >
        #{(index + 1).toString().padStart(3, '0')}
      </div>
    </JUCard>
  );
}

/* ---- Interactive wrapper ---- */

function FeedDemo({
  columns,
  gap,
}: {
  columns: 1 | 2 | 3 | 4;
  gap: 'sm' | 'md' | 'lg';
}) {
  const BATCH = 6;
  const MAX = 30;
  const [count, setCount] = useState(BATCH);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setCount((c) => Math.min(c + BATCH, MAX));
    setLoading(false);
  }, []);

  return (
    <JUFeedLayout
      columns={columns}
      gap={gap}
      hasMore={count < MAX}
      onLoadMore={handleLoadMore}
      loading={loading}
      header={
        <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>
          {count} / {MAX} items
        </div>
      }
    >
      {Array.from({ length: count }, (_, i) => (
        <FakeCard key={i} index={i} />
      ))}
    </JUFeedLayout>
  );
}

/* ---- Meta ---- */

const meta: Meta<typeof JUFeedLayout> = {
  title: 'Layouts/JUFeedLayout',
  component: JUFeedLayout,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    columns: { control: 'select', options: [1, 2, 3, 4] },
    gap: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof JUFeedLayout>;

export const TwoColumns: Story = {
  render: () => <FeedDemo columns={2} gap="md" />,
};

export const ThreeColumns: Story = {
  render: () => <FeedDemo columns={3} gap="md" />,
};

export const SingleColumn: Story = {
  render: () => <FeedDemo columns={1} gap="lg" />,
};

export const FourColumnsCompact: Story = {
  render: () => <FeedDemo columns={4} gap="sm" />,
};
