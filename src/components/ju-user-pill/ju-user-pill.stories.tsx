import type { Meta, StoryObj } from '@storybook/react';
import { JUUserPill } from './ju-user-pill';

const meta: Meta<typeof JUUserPill> = {
  title: 'Molecules/JUUserPill',
  component: JUUserPill,
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj<typeof JUUserPill> = {
  args: {
    name: 'Camille D.',
    avatarUrl: 'https://i.pravatar.cc/150?u=camille',
    onDismiss: () => alert('Fermer clique'),
  },
};

export const FallbackAvatar: StoryObj<typeof JUUserPill> = {
  args: {
    name: 'Antoine',
  },
};
