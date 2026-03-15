import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUInput } from './ju-input';

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const meta: Meta<typeof JUInput> = {
  title: 'Molecules/JUInput',
  component: JUInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', maxWidth: '380px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUInput>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    fullWidth: true,
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: 'Email Address',
    icon: <MailIcon />,
    fullWidth: true,
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Email Address',
    icon: <MailIcon />,
    error: true,
    defaultValue: 'invalid-email',
    fullWidth: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    icon: <MailIcon />,
    disabled: true,
    fullWidth: true,
  },
};

const PasswordDemo = () => {
  const [visible, setVisible] = useState(false);
  return (
    <JUInput
      type={visible ? 'text' : 'password'}
      placeholder="Password"
      icon={<LockIcon />}
      trailingIcon={visible ? <EyeOffIcon /> : <EyeIcon />}
      onTrailingClick={() => setVisible((v) => !v)}
      fullWidth
    />
  );
};

export const Password: Story = {
  render: () => <PasswordDemo />,
};
