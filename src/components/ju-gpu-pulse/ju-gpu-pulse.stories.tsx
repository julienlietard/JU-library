import type { Meta, StoryObj } from '@storybook/react';
import { JUGPUPulse } from './ju-gpu-pulse';
import type { JUGPUPulseMetrics } from './ju-gpu-pulse';
import { useEffect } from 'react';

const meta: Meta<typeof JUGPUPulse> = {
  title: 'Widgets/JUGPUPulse',
  component: JUGPUPulse,
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
type Story = StoryObj<typeof JUGPUPulse>;

/** Décorateur helper qui simule les métriques GPU via un mock fetch */
function withMockMetrics(metrics: JUGPUPulseMetrics) {
  return (Story: React.ComponentType) => {
    useEffect(() => {
      const original = window.fetch;
      window.fetch = (async () =>
        new Response(JSON.stringify(metrics), {
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

export const Normal: Story = {
  args: {
    endpoint: '/metrics/gpu',
    title: 'Pouls GPU',
    interval: 2000,
  },
  decorators: [
    withMockMetrics({
      vramPercent: 45,
      vramUsed: 3686,
      vramTotal: 8192,
      tempCelsius: 62,
    }),
  ],
};

export const HighTemperature: Story = {
  args: {
    endpoint: '/metrics/gpu',
    title: 'Pouls GPU',
  },
  decorators: [
    withMockMetrics({
      vramPercent: 87,
      vramUsed: 7127,
      vramTotal: 8192,
      tempCelsius: 89,
    }),
  ],
};

export const LowUsage: Story = {
  args: {
    endpoint: '/metrics/gpu',
    title: 'RTX 4070',
  },
  decorators: [
    withMockMetrics({
      vramPercent: 12,
      vramUsed: 983,
      vramTotal: 8192,
      tempCelsius: 38,
    }),
  ],
};
