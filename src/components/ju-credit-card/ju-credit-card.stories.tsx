import type { Meta, StoryObj } from '@storybook/react';
import { JUCreditCard } from './ju-credit-card';

const meta: Meta<typeof JUCreditCard> = {
  title: 'Components/JUCreditCard',
  component: JUCreditCard,
  parameters: { layout: 'centered' },
};
export default meta;

export const DefaultAurora: StoryObj<typeof JUCreditCard> = {
  args: {
    cardNumber: '1234 5678 9000 0000',
    cardholderName: 'JULIEN LIETARD',
    expiryDate: '12/24',
    bgType: 'aurora',
  },
};

export const WithUserPill: StoryObj<typeof JUCreditCard> = {
  args: {
    ...DefaultAurora.args,
    cardholderName: 'Camille D.',
    variant: 'user',
    userAvatarUrl: 'https://i.pravatar.cc/150?u=camille',
    onUserDismiss: () => console.log('Retirer l\'utilisateur de la carte'),
  },
};

export const SolidDark: StoryObj<typeof JUCreditCard> = {
  args: {
    ...DefaultAurora.args,
    bgType: 'solid',
    bgColor: '#1c1c1e',
  },
};
