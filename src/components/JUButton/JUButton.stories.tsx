import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import JUButton, { JUButtonProps } from './JUButton'; // Assure-toi que le chemin est correct

// Définition de la configuration par défaut de l'histoire
const meta: Meta<JUButtonProps> = {
  title: 'Components/JUButton',
  tags: ['autodocs'],
  component: JUButton,
  argTypes: {
    label: { control: 'text' },
    size: { control: { type: 'select', options: ['s', 'm', 'l'] } },
    type: { control: { type: 'select', options: ['primary', 'secondary', 'info', 'warning', 'danger'] } },
    disabled: { control: 'boolean' },
  },
};

export default meta;

// Template de base pour créer chaque story
const Template: StoryFn<JUButtonProps> = (args) => <JUButton {...args} />;

// Définition de plusieurs variations du bouton
export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Button',
  size: 'm',
  type: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Secondary Button',
  size: 'm',
  type: 'secondary',
};

export const Info = Template.bind({});
Info.args = {
  label: 'Info Button',
  size: 'm',
  type: 'info',
};

export const Warning = Template.bind({});
Warning.args = {
  label: 'Warning Button',
  size: 'm',
  type: 'warning',
};

export const Danger = Template.bind({});
Danger.args = {
  label: 'Danger Button',
  size: 'm',
  type: 'danger',
};

export const Small = Template.bind({});
Small.args = {
  label: 'Small Button',
  size: 's',
  type: 'primary',
};

export const Medium = Template.bind({});
Medium.args = {
  label: 'Medium Button',
  size: 'm',
  type: 'primary',
};

export const Large = Template.bind({});
Large.args = {
  label: 'Large Button',
  size: 'l',
  type: 'primary',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Button',
  size: 'm',
  type: 'secondary',
  disabled: true,
};
