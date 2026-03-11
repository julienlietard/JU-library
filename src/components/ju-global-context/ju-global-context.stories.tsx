import type { Meta, StoryObj } from '@storybook/react';
import { JUGlobalContext } from './ju-global-context';

const meta: Meta<typeof JUGlobalContext> = {
  title: 'Widgets/JUGlobalContext',
  component: JUGlobalContext,
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
type Story = StoryObj<typeof JUGlobalContext>;

export const ClearGoodAir: Story = {
  args: {
    weather: {
      temperature: 22,
      condition: 'clear',
      humidity: 45,
      location: 'Paris, FR',
    },
    airQuality: {
      index: 32,
      level: 'good',
    },
  },
};

export const CloudyModerateAir: Story = {
  args: {
    weather: {
      temperature: 16,
      condition: 'partly-cloudy',
      humidity: 68,
      location: 'Lyon, FR',
    },
    airQuality: {
      index: 78,
      level: 'moderate',
    },
  },
};

export const RainUnhealthyAir: Story = {
  args: {
    weather: {
      temperature: 11,
      condition: 'rain',
      humidity: 89,
      location: 'Marseille, FR',
    },
    airQuality: {
      index: 162,
      level: 'unhealthy',
      label: 'PM2.5 élevé',
    },
  },
};

export const StormHazardous: Story = {
  args: {
    weather: {
      temperature: 8,
      condition: 'storm',
      humidity: 95,
    },
    airQuality: {
      index: 310,
      level: 'hazardous',
    },
  },
};

export const SnowDay: Story = {
  args: {
    weather: {
      temperature: -3,
      condition: 'snow',
      location: 'Chamonix, FR',
    },
    airQuality: {
      index: 18,
      level: 'good',
    },
  },
};

export const FoggyMorning: Story = {
  args: {
    weather: {
      temperature: 5,
      condition: 'fog',
      humidity: 97,
      location: 'Bordeaux, FR',
    },
    airQuality: {
      index: 55,
      level: 'moderate',
    },
  },
};
