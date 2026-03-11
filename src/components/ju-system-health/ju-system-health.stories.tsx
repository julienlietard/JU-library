import type { Meta, StoryObj } from '@storybook/react';
import { JUSystemHealth } from './ju-system-health';
import type { JUServiceStatus } from './ju-system-health';
import { useEffect } from 'react';

const meta: Meta<typeof JUSystemHealth> = {
  title: 'Widgets/JUSystemHealth',
  component: JUSystemHealth,
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
type Story = StoryObj<typeof JUSystemHealth>;

/** Mock fetch to simulate service statuses */
function withMockStatuses(results: Record<string, boolean>) {
  return (Story: React.ComponentType) => {
    useEffect(() => {
      const original = window.fetch;
      window.fetch = ((url: string) => {
        const match = Object.entries(results).find(([key]) => url.includes(key));
        if (match && match[1]) {
          return Promise.resolve(new Response('ok', { status: 200 }));
        }
        return Promise.reject(new Error('offline'));
      }) as typeof fetch;
      return () => {
        window.fetch = original;
      };
    }, []);
    return <Story />;
  };
}

export const AllOnline: Story = {
  args: {
    title: 'System Health',
    services: [
      { name: 'n8n', url: 'http://localhost:5678/healthz' },
      { name: 'Ollama', url: 'http://localhost:11434/api/version' },
      { name: 'Tailscale', url: 'http://localhost:41112/localapi/v0/status' },
    ],
    interval: 0,
  },
  decorators: [
    withMockStatuses({ '5678': true, '11434': true, '41112': true }),
  ],
};

export const PartialOutage: Story = {
  args: {
    title: 'System Health',
    services: [
      { name: 'n8n', url: 'http://localhost:5678/healthz' },
      { name: 'Ollama', url: 'http://localhost:11434/api/version' },
      { name: 'Tailscale', url: 'http://localhost:41112/localapi/v0/status' },
    ],
    interval: 0,
  },
  decorators: [
    withMockStatuses({ '5678': true, '11434': false, '41112': true }),
  ],
};

export const AllDown: Story = {
  args: {
    title: 'System Health',
    services: [
      { name: 'n8n', url: 'http://localhost:5678/healthz' },
      { name: 'Ollama', url: 'http://localhost:11434/api/version' },
      { name: 'Tailscale', url: 'http://localhost:41112/localapi/v0/status' },
    ],
    interval: 0,
  },
  decorators: [
    withMockStatuses({ '5678': false, '11434': false, '41112': false }),
  ],
};

export const CustomServices: Story = {
  args: {
    title: 'Infra',
    services: [
      { name: 'API', url: 'http://localhost:3000/health' },
      { name: 'Redis', url: 'http://localhost:6379' },
    ],
    interval: 0,
  },
  decorators: [
    withMockStatuses({ '3000': true, '6379': true }),
  ],
};
