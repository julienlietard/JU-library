import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import JUCard, { JUCardProps } from './JUCard';
import JUButton from '../JUButton/JUButton';

const meta: Meta<JUCardProps> = {
  title: 'Components/JUCard',
  tags: ['autodocs'],
  component: JUCard,
  argTypes: {
    imageUrl: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
    darkTheme: { control: 'boolean' },
  },
};

export default meta;

// Template de base pour les stories
const Template: StoryFn<JUCardProps> = (args) => <JUCard {...args} />;

// Définition des variations de la carte
export const Default = Template.bind({});
Default.args = {
  title: 'Default Card',
  description: 'This is a default card with a simple description.',
  actionLabel: 'Learn More',
  onActionClick: () => alert('Button Clicked!'),
};

export const WithImage = Template.bind({});
WithImage.args = {
  imageUrl: 'https://via.placeholder.com/400x150',
  title: 'Card with Image',
  description: 'This card includes an image on the top to showcase content visually.',
  actionLabel: 'View More',
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  imageUrl: 'https://via.placeholder.com/400x150',
  title: 'Dark Themed Card',
  description: 'This card uses a dark theme for a sleek, modern look.',
  actionLabel: 'Explore',
  darkTheme: true,
};
