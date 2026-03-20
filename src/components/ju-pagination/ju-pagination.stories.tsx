import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUPagination } from './ju-pagination';

const meta: Meta<typeof JUPagination> = {
  title: 'Molecules/JUPagination',
  component: JUPagination,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUPagination>;

export const Default: Story = { args: { page: 3, totalPages: 10, onPageChange: () => {} } };
export const FewPages: Story = { args: { page: 2, totalPages: 4, onPageChange: () => {} } };
export const ManyPages: Story = { args: { page: 15, totalPages: 50, onPageChange: () => {} } };
export const NoLabels: Story = { args: { page: 1, totalPages: 8, onPageChange: () => {}, showLabels: false } };

export const Interactive: Story = {
  render: () => {
    const [p, setP] = useState(1);
    return <JUPagination page={p} totalPages={12} onPageChange={setP} />;
  },
};
