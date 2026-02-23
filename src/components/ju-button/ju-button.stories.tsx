import type { Meta, StoryObj } from '@storybook/react';
import { JUButton } from './ju-button';

const meta: Meta<typeof JUButton> = {
  title: 'Components/JUButton',
  component: JUButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'info', 'warning', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof JUButton>;

export const Primary: Story = {
  args: { label: 'Primary', variant: 'primary' },
};

export const Secondary: Story = {
  args: { label: 'Secondary', variant: 'secondary' },
};

export const Danger: Story = {
  args: { label: 'Danger', variant: 'danger' },
};

export const Info: Story = {
  args: { label: 'Info', variant: 'info' },
};

export const Warning: Story = {
  args: { label: 'Warning', variant: 'warning' },
};

export const Ghost: Story = {
  args: { label: 'Ghost', variant: 'ghost' },
};

export const Small: Story = {
  args: { label: 'Small', size: 's' },
};

export const Large: Story = {
  args: { label: 'Large', size: 'l' },
};

export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '24px' }}>
      <JUButton label="Primary" variant="primary" />
      <JUButton label="Secondary" variant="secondary" />
      <JUButton label="Danger" variant="danger" />
      <JUButton label="Info" variant="info" />
      <JUButton label="Warning" variant="warning" />
      <JUButton label="Ghost" variant="ghost" />
      <JUButton label="Disabled" disabled />
    </div>
  ),
};
