import type { Meta, StoryObj } from '@storybook/react';
import { JUTaskCard } from './ju-task-card';

const meta: Meta<typeof JUTaskCard> = {
  title: 'Widgets/JUTaskCard',
  component: JUTaskCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    status: { control: 'select', options: ['active', 'paused', 'completed', 'archived'] },
    completedTasks: { control: { type: 'range', min: 0, max: 20 } },
    totalTasks: { control: { type: 'range', min: 1, max: 20 } },
  },
};

export default meta;
type Story = StoryObj<typeof JUTaskCard>;

export const Default: Story = {
  args: {
    name: 'Mobile App',
    status: 'active',
    completedTasks: 3,
    totalTasks: 8,
    category: 'Tasks',
    avatarSrc: 'https://i.pravatar.cc/64?img=12',
    avatarAlt: 'Julien',
    updatedLabel: 'Updated today',
    onSettingsClick: () => {},
    onCategoryClick: () => {},
  },
};

export const Paused: Story = {
  args: {
    name: 'Design System',
    status: 'paused',
    completedTasks: 5,
    totalTasks: 12,
    category: 'Sprints',
    avatarSrc: 'https://i.pravatar.cc/64?img=32',
    updatedLabel: 'Updated 2d ago',
    onSettingsClick: () => {},
  },
};

export const Completed: Story = {
  args: {
    name: 'API Migration',
    status: 'completed',
    completedTasks: 6,
    totalTasks: 6,
    category: 'Backend',
    avatarSrc: 'https://i.pravatar.cc/64?img=5',
    updatedLabel: 'Completed',
    onSettingsClick: () => {},
  },
};

export const Archived: Story = {
  args: {
    name: 'Legacy Dashboard',
    status: 'archived',
    completedTasks: 14,
    totalTasks: 14,
    category: 'Archive',
    onSettingsClick: () => {},
  },
};

export const ManyTasks: Story = {
  args: {
    name: 'Platform Redesign',
    status: 'active',
    completedTasks: 7,
    totalTasks: 16,
    category: 'Milestones',
    avatarSrc: 'https://i.pravatar.cc/64?img=20',
    updatedLabel: 'Updated 1h ago',
    onSettingsClick: () => {},
    onCategoryClick: () => {},
  },
};
