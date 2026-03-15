import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTagInput } from './ju-tag-input';

const meta: Meta<typeof JUTagInput> = {
  title: 'Molecules/JUTagInput',
  component: JUTagInput,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 450, margin: '0 auto', padding: 40 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof JUTagInput>;

export const Default: Story = { args: { label: 'Tags', placeholder: 'Type and press Enter…' } };
export const WithDefaults: Story = { args: { label: 'Technologies', defaultValue: ['React', 'TypeScript', 'Storybook'], max: 6 } };
export const MaxTags: Story = { args: { label: 'Categories', defaultValue: ['Design', 'Code', 'UX'], max: 3 } };
export const WithError: Story = { args: { label: 'Keywords', error: 'At least one tag is required' } };
export const Disabled: Story = { args: { label: 'Locked', defaultValue: ['Frozen'], disabled: true } };