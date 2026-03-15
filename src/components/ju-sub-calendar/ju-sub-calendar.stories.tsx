import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSubCalendar } from './ju-sub-calendar';
import type { JUSubscription } from './ju-sub-calendar';
import { MOCK_SUBSCRIPTIONS } from './ju-sub-calendar.mock';

const meta: Meta<typeof JUSubCalendar> = {
  title: 'Widgets/JUSubCalendar',
  component: JUSubCalendar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: '#ebebef' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#111111' },
      ],
    },
    docs: {
      description: {
        component:
          'Subscription calendar — click a day cell to see renewal details with spring animations.',
      },
    },
  },
  argTypes: {
    year: { control: { type: 'number', min: 2020, max: 2035 } },
    month: {
      control: { type: 'number', min: 0, max: 11 },
      description: '0 = January … 11 = December',
    },
    maxIconsPerCell: { control: { type: 'number', min: 1, max: 5 } },
    locale: { control: 'text' },
    currency: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof JUSubCalendar>;

export const Default: Story = {
  name: 'Default',
  args: {
    year: 2025,
    month: 11,
    subscriptions: MOCK_SUBSCRIPTIONS,
    maxIconsPerCell: 2,
  },
};

export const MonthlyOnly: Story = {
  name: 'Monthly Only',
  args: {
    year: 2025,
    month: 11,
    subscriptions: MOCK_SUBSCRIPTIONS.filter((s) => s.billing === 'monthly'),
  },
};

export const YearlyOnly: Story = {
  name: 'Yearly Only',
  args: {
    year: 2025,
    month: 11,
    subscriptions: MOCK_SUBSCRIPTIONS.filter((s) => s.billing === 'yearly'),
  },
};

export const Empty: Story = {
  name: 'Empty Calendar',
  args: { year: 2025, month: 11, subscriptions: [] },
};

export const HeavyOverflow: Story = {
  name: 'Heavy Overflow (+3 same day)',
  args: {
    year: 2025,
    month: 11,
    subscriptions: [
      ...MOCK_SUBSCRIPTIONS,
      {
        id: 'dropbox',
        name: 'Dropbox',
        logoUrl: null,
        iconBg: '#0061FE',
        price: 11.99,
        billing: 'monthly',
        dayOfMonth: 4,
      } satisfies JUSubscription,
      {
        id: 'slack',
        name: 'Slack',
        logoUrl: null,
        iconBg: '#4A154B',
        price: 7.25,
        billing: 'monthly',
        dayOfMonth: 4,
      } satisfies JUSubscription,
    ],
  },
};

export const MaxIconsThree: Story = {
  name: 'Max 3 icons per cell',
  args: {
    year: 2025,
    month: 11,
    subscriptions: MOCK_SUBSCRIPTIONS,
    maxIconsPerCell: 3,
  },
};

export const DenseMonth: Story = {
  name: 'Dense Month (stress test)',
  args: {
    year: 2025,
    month: 11,
    subscriptions: Array.from<unknown, JUSubscription>(
      { length: 20 },
      (_, i) => ({
        id: `sub-${i + 1}`,
        name: `Service ${i + 1}`,
        logoUrl: null,
        iconBg: `hsl(${(i * 37) % 360}, 65%, 50%)`,
        price: parseFloat((4.99 + i * 2.5).toFixed(2)),
        billing: i % 3 === 0 ? 'yearly' : 'monthly',
        dayOfMonth: i + 1,
      }),
    ),
  },
};

export const WithNavigation: Story = {
  name: 'With Month Navigation',
  args: {
    year: 2025,
    month: 11,
    subscriptions: MOCK_SUBSCRIPTIONS,
  },
  render: (args) => {
    const [date, setDate] = React.useState({ year: args.year, month: args.month });
    return (
      <JUSubCalendar
        {...args}
        year={date.year}
        month={date.month}
        onMonthChange={(y, m) => setDate({ year: y, month: m })}
      />
    );
  },
};
