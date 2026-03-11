import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUReferralCard } from './ju-referral-card';

const meta: Meta<typeof JUReferralCard> = {
  title: 'Components/JUReferralCard',
  component: JUReferralCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '600px',
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
type Story = StoryObj<typeof JUReferralCard>;

export const Default: Story = {
  args: {
    heroImage: 'https://picsum.photos/seed/referral/800/400',
    title: 'Invite & Profit',
    steps: [
      {
        icon: '🔗',
        text: 'Share a link',
      },
      {
        icon: '🎁',
        text: <span>Your friend gets <strong>30 credits</strong> when they subscribe</span>,
      },
      {
        icon: '💎',
        text: <span>You receive <strong>30 credits</strong> for each referral</span>,
      },
    ],
    inviteLink: 'https://wimt/alexsmith',
  },
};

export const CustomLink: Story = {
  args: {
    heroImage: 'https://picsum.photos/seed/invite/800/400',
    title: 'Parrainez vos amis',
    stepsLabel: 'Comment ça marche :',
    steps: [
      {
        icon: '📤',
        text: 'Partagez votre lien',
      },
      {
        icon: '🎉',
        text: <span>Votre ami reçoit <strong>50 crédits</strong> à l'inscription</span>,
      },
      {
        icon: '💰',
        text: <span>Vous gagnez <strong>50 crédits</strong> par parrainage</span>,
      },
    ],
    linkLabel: 'Votre lien de parrainage :',
    inviteLink: 'https://app.example.com/ref/julien42',
    copyLabel: 'Copier',
    copiedLabel: 'Copié !',
  },
};

export const NoHero: Story = {
  args: {
    title: 'Refer a friend',
    steps: [
      {
        icon: '🔗',
        text: 'Share your unique link',
      },
      {
        icon: '✅',
        text: <span>They sign up and get <strong>10 free credits</strong></span>,
      },
      {
        icon: '🏆',
        text: <span>You earn <strong>10 credits</strong> per referral</span>,
      },
    ],
    inviteLink: 'https://myapp.co/ref/user123',
  },
};
