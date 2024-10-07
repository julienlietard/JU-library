import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import JUModal from './JUModal';

const meta: Meta = {
  title: 'Components/JUModal',
  tags: ['autodocs'],
  component: JUModal,
};

export default meta;

const Template: StoryFn<{ isOpen: boolean; title: string; theme?: 'light' | 'dark' }> = (args) => (
  <JUModal {...args} onClose={() => console.log('Modal closed')}>
    <p>Ceci est le contenu du modal.</p>
  </JUModal>
);

export const LightTheme = Template.bind({});
LightTheme.args = {
  isOpen: true,
  title: 'Light Theme Modal',
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  isOpen: true,
  title: 'Dark Theme Modal',
  theme: 'dark', // Utilisation du thème noir
};
