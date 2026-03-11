import type { Meta, StoryObj } from '@storybook/react';
import { JUFinancialFlow } from './ju-financial-flow';

const meta: Meta<typeof JUFinancialFlow> = {
  title: 'Widgets/JUFinancialFlow',
  component: JUFinancialFlow,
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
type Story = StoryObj<typeof JUFinancialFlow>;

export const HalfWay: Story = {
  args: {
    current: 2350,
    goal: 5000,
    title: 'Objectif Mensuel',
  },
};

export const AlmostThere: Story = {
  args: {
    current: 4800,
    goal: 5000,
    title: 'Objectif Mars',
  },
};

export const GoalExceeded: Story = {
  args: {
    current: 6200,
    goal: 5000,
    title: 'Revenu Freelance',
  },
};

export const JustStarted: Story = {
  args: {
    current: 300,
    goal: 8000,
    title: 'Épargne',
  },
};

export const ZeroProgress: Story = {
  args: {
    current: 0,
    goal: 3000,
    title: 'Nouveau Mois',
  },
};

export const DollarCurrency: Story = {
  args: {
    current: 1500,
    goal: 4000,
    currency: '$',
    title: 'Budget Design',
  },
};
