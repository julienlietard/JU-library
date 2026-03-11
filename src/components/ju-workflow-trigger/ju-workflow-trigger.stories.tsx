import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUWorkflowTrigger } from './ju-workflow-trigger';
import type { JUWorkflowAction } from './ju-workflow-trigger';

/* ── Sample icons ── */

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const BackupIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const DeployIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const SyncIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const CleanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ReportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const sampleActions: JUWorkflowAction[] = [
  { label: 'Emails', icon: <MailIcon />, webhookUrl: 'https://n8n.example.com/webhook/emails' },
  { label: 'Backup', icon: <BackupIcon />, webhookUrl: 'https://n8n.example.com/webhook/backup' },
  { label: 'Deploy', icon: <DeployIcon />, webhookUrl: 'https://n8n.example.com/webhook/deploy' },
  { label: 'Sync', icon: <SyncIcon />, webhookUrl: 'https://n8n.example.com/webhook/sync' },
  { label: 'Clean', icon: <CleanIcon />, webhookUrl: 'https://n8n.example.com/webhook/clean' },
  { label: 'Report', icon: <ReportIcon />, webhookUrl: 'https://n8n.example.com/webhook/report' },
];

const meta: Meta<typeof JUWorkflowTrigger> = {
  title: 'Widgets/JUWorkflowTrigger',
  component: JUWorkflowTrigger,
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
type Story = StoryObj<typeof JUWorkflowTrigger>;

export const Default: Story = {
  args: {
    actions: sampleActions,
    title: 'Workflows',
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    actions: sampleActions.slice(0, 4),
    title: 'Quick Actions',
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    actions: sampleActions,
    title: 'Command Center',
    columns: 4,
  },
};
