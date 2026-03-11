import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUAuthPanel } from './ju-auth-panel';

const meta: Meta<typeof JUAuthPanel> = {
  title: 'Forms/JUAuthPanel',
  component: JUAuthPanel,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'select', options: ['signin', 'signup'] },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(145deg, #f0f0f3 0%, #e8eaf0 100%)',
          borderRadius: '24px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUAuthPanel>;

export const SignIn: Story = {
  args: {
    mode: 'signin',
  },
};

export const SignUp: Story = {
  args: {
    mode: 'signup',
  },
};

export const WithError: Story = {
  args: {
    mode: 'signin',
    error: 'Invalid email or password. Please try again.',
  },
};

export const Loading: Story = {
  args: {
    mode: 'signin',
    loading: true,
  },
};
