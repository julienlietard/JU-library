import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUWelcomeCard } from './ju-welcome-card';

const meta: Meta<typeof JUWelcomeCard> = {
  title: 'Molecules/JUWelcomeCard',
  component: JUWelcomeCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '700px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#e8e8ec',
          borderRadius: '24px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUWelcomeCard>;

export const Default: Story = {
  args: {
    heroImage: 'https://picsum.photos/800/600',
    title: 'Welcome to Genesis,\nYour first journey here!',
    subtitle: 'Add your Photo and Pick a username',
  },
};

export const NoHero: Story = {
  args: {
    title: 'Set up your profile',
    subtitle: 'Choose a photo and a display name',
  },
};

export const CustomLabels: Story = {
  args: {
    heroImage: 'https://picsum.photos/seed/welcome/800/600',
    title: 'Bienvenue !',
    subtitle: 'Personnalisez votre profil pour commencer',
    uploadLabel: 'Votre Photo',
    uploadHint: 'PNG ou JPEG, max 5MB',
    nameLabel: 'Nom d\'utilisateur',
    namePlaceholder: 'pseudo',
    buttonLabel: 'Commencer',
  },
};
