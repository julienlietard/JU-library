import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUStatus } from './ju-status';

const meta: Meta<typeof JUStatus> = {
  title: 'Components/JUStatus', component: JUStatus, tags: ['autodocs'],
  argTypes: { color: { control: 'select', options: ['orange','blue','purple','yellow','green','red','gray'] } },
};
export default meta;
type Story = StoryObj<typeof JUStatus>;
export const Default: Story = { args: { label: 'In Progress', color: 'blue', icon: <span>◐</span> } };
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '2rem' }}>
      <JUStatus label="Pending" color="orange" icon={<span>⚠</span>} />
      <JUStatus label="In progress" color="blue" icon={<span>◐</span>} />
      <JUStatus label="Submitted" color="purple" icon={<span>✈</span>} />
      <JUStatus label="In review" color="yellow" icon={<span>👁</span>} />
      <JUStatus label="Success" color="green" icon={<span>✓</span>} />
      <JUStatus label="Failed" color="red" icon={<span>✕</span>} />
      <JUStatus label="Expired" color="gray" icon={<span>◷</span>} />
    </div>
  ),
};
