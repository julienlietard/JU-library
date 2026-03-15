import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTextField } from './ju-text-field';

const meta: Meta<typeof JUTextField> = {
  title: 'Molecules/JUTextField',
  component: JUTextField,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 400, margin: '0 auto', padding: 40, display: 'flex', flexDirection: 'column', gap: 24 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof JUTextField>;

export const Default: Story = { args: { label: 'Article title', hint: 'A catchy title for your article' } };
export const WithIcon: Story = {
  args: {
    label: 'Search',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
};
export const Error: Story = { args: { label: 'Email', error: 'Please enter a valid email', defaultValue: 'bad-email' } };
export const Disabled: Story = { args: { label: 'Read only', defaultValue: 'Cannot edit', disabled: true } };
export const Multiline: Story = { args: { label: 'Description', multiline: true, rows: 5, hint: 'Markdown supported' } };
export const FullWidth: Story = { args: { label: 'Full-width field', fullWidth: true } };