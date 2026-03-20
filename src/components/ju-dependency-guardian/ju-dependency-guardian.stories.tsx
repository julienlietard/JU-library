import type { Meta, StoryObj } from '@storybook/react';
import { JUDependencyGuardian } from './ju-dependency-guardian';
import type { JUDepPackage } from './ju-dependency-guardian';

const criticalPackages: JUDepPackage[] = [
  {
    name: 'lodash',
    currentVersion: '4.17.19',
    latestVersion: '4.17.21',
    severity: 'vulnerability',
    reason: 'Prototype pollution (CVE-2021-23337)',
  },
  {
    name: 'webpack',
    currentVersion: '4.46.0',
    latestVersion: '5.91.0',
    severity: 'outdated',
    reason: '2 versions majeures de retard',
  },
  {
    name: 'jsonwebtoken',
    currentVersion: '8.5.1',
    latestVersion: '9.0.2',
    severity: 'vulnerability',
    reason: 'Insecure default algorithm (CVE-2022-23529)',
  },
  {
    name: 'axios',
    currentVersion: '0.21.1',
    latestVersion: '1.7.2',
    severity: 'outdated',
    reason: 'Version majeure obsolète',
  },
];

const meta: Meta<typeof JUDependencyGuardian> = {
  title: 'Widgets/JUDependencyGuardian',
  component: JUDependencyGuardian,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    score: { control: { type: 'range', min: 0, max: 100 } },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof JUDependencyGuardian>;

export const Default: Story = {
  args: {
    score: 42,
    title: 'Dependency Guardian',
    packages: criticalPackages,
  },
};

export const Healthy: Story = {
  args: {
    score: 96,
    title: 'Dependency Guardian',
    packages: [
      {
        name: 'typescript',
        currentVersion: '5.4.3',
        latestVersion: '5.4.5',
        severity: 'outdated',
        reason: 'Patch mineur disponible',
      },
    ],
  },
};

export const Critical: Story = {
  args: {
    score: 12,
    title: 'Audit Critique',
    packages: criticalPackages.map((p) => ({
      ...p,
      severity: 'vulnerability' as const,
    })),
  },
};

export const AllClear: Story = {
  args: {
    score: 100,
    title: 'Dependency Guardian',
    packages: [],
  },
};
