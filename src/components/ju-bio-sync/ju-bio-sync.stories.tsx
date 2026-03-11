import type { Meta, StoryObj } from '@storybook/react';
import { JUBioSync } from './ju-bio-sync';
import type { JUBioSyncData } from './ju-bio-sync';
import { useEffect } from 'react';

const meta: Meta<typeof JUBioSync> = {
  title: 'Widgets/JUBioSync',
  component: JUBioSync,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUBioSync>;

function withMockData(data: JUBioSyncData) {
  return (Story: React.ComponentType) => {
    useEffect(() => {
      const original = window.fetch;
      window.fetch = (async () =>
        new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })) as typeof fetch;
      return () => {
        window.fetch = original;
      };
    }, []);
    return <Story />;
  };
}

export const GoodDay: Story = {
  args: {
    endpoint: '/api/health',
    title: 'BioSync',
  },
  decorators: [
    withMockData({
      sleepHours: 7.5,
      steps: 12340,
      tip: 'Belle nuit et bonne activité ! Continue comme ça, ton rythme créatif est optimal.',
    }),
  ],
};

export const LowSleep: Story = {
  args: {
    endpoint: '/api/health',
    title: 'BioSync',
  },
  decorators: [
    withMockData({
      sleepHours: 4.25,
      steps: 8200,
      tip: 'Tu as peu dormi cette nuit. Essaie de te coucher plus tôt pour garder ta concentration en design.',
    }),
  ],
};

export const LowSteps: Story = {
  args: {
    endpoint: '/api/health',
    title: 'BioSync',
  },
  decorators: [
    withMockData({
      sleepHours: 8,
      steps: 3100,
      tip: 'Bonne nuit de sommeil, mais pense à bouger un peu aujourd\'hui entre deux itérations.',
    }),
  ],
};

export const MinimalActivity: Story = {
  args: {
    endpoint: '/api/health',
    title: 'Santé Créative',
    stepGoal: 8000,
    sleepThreshold: 7,
  },
  decorators: [
    withMockData({
      sleepHours: 5.5,
      steps: 1200,
      tip: 'Journée difficile. Priorise le repos et une courte marche pour relancer l\'inspiration.',
    }),
  ],
};
