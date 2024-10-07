import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import JUAcordion from './JUAccordion';

const meta: Meta = {
  title: 'Components/JUAcordion',
  tags: ['autodocs'],
  component: JUAcordion,
};

export default meta;

const Template: StoryFn<{ title: string; theme?: 'light' | 'dark' }> = (args) => (
  <JUAcordion {...args}>
    <p>Ceci est le contenu de l'accordéon.</p>
  </JUAcordion>
);

export const LightTheme = Template.bind({});
LightTheme.args = {
  title: 'Light Theme Accordion',
  theme: 'light', // Utilisation du thème clair
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  title: 'Dark Theme Accordion',
  theme: 'dark', // Utilisation du thème sombre
};
