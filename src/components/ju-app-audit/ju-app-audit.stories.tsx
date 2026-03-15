import type { Meta, StoryObj } from '@storybook/react';
import { JUAppAudit } from './ju-app-audit';
import type { JUAppAuditEntry } from './ju-app-audit';

/* ---- Helper: generate fake latency history ---- */
function fakeHistory(base: number, variance: number, count = 30): number[] {
  return Array.from({ length: count }, () =>
    Math.max(10, Math.round(base + (Math.random() - 0.5) * variance))
  );
}

const sampleApps: JUAppAuditEntry[] = [
  {
    name: 'JU Dashboard',
    url: 'dashboard.ju.app',
    status: 'up',
    latency: 42,
    history: fakeHistory(45, 30),
  },
  {
    name: 'API Gateway',
    url: 'api.ju.app',
    status: 'up',
    latency: 128,
    history: fakeHistory(130, 60),
  },
  {
    name: 'Auth Service',
    url: 'auth.ju.app',
    status: 'up',
    latency: 310,
    history: fakeHistory(300, 120),
  },
  {
    name: 'CDN Edge',
    url: 'cdn.ju.app',
    status: 'up',
    latency: 18,
    history: fakeHistory(20, 10),
  },
  {
    name: 'ML Pipeline',
    url: 'ml.ju.app',
    status: 'down',
    latency: 0,
    history: fakeHistory(600, 400),
  },
  {
    name: 'Analytics',
    url: 'analytics.ju.app',
    status: 'up',
    latency: 720,
    history: fakeHistory(700, 200),
  },
];

const meta: Meta<typeof JUAppAudit> = {
  title: 'Widgets/JUAppAudit',
  component: JUAppAudit,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof JUAppAudit>;

/* ---- Stories ---- */

export const Default: Story = {
  args: {
    title: 'App Audit',
    apps: sampleApps,
  },
};

export const AllHealthy: Story = {
  args: {
    title: 'Production Services',
    apps: sampleApps
      .filter((a) => a.status === 'up')
      .map((a) => ({ ...a, latency: Math.min(a.latency, 150) })),
  },
};

export const WithOutage: Story = {
  args: {
    title: 'Incident Monitor',
    apps: [
      sampleApps[0],
      { ...sampleApps[1], status: 'down' as const, latency: 0, history: fakeHistory(800, 500) },
      { ...sampleApps[2], status: 'down' as const, latency: 0, history: fakeHistory(900, 400) },
      sampleApps[3],
    ],
  },
};
