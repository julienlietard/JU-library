import type { Meta, StoryObj } from '@storybook/react';
import { JUNerveCenter } from './ju-nerve-center';

const meta: Meta<typeof JUNerveCenter> = {
  title: 'Widgets/JUNerveCenter',
  component: JUNerveCenter,
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
type Story = StoryObj<typeof JUNerveCenter>;

export const Default: Story = {
  args: {
    webhookUrl: 'https://your-n8n.example.com/webhook/chat',
    title: 'Centre Nerveux',
    placeholder: 'Envoyer un message...',
  },
};

export const WithHistory: Story = {
  args: {
    webhookUrl: 'https://your-n8n.example.com/webhook/chat',
    title: 'Julien IA',
    initialMessages: [
      { role: 'ai', content: 'Salut ! Comment puis-je t\'aider ?' },
      { role: 'user', content: 'Je cherche un designer système expérimenté.' },
      { role: 'ai', content: 'Tu es au bon endroit. Julien est spécialisé en React, TypeScript et design systems.' },
    ],
  },
};

export const CustomTitle: Story = {
  args: {
    webhookUrl: 'https://your-n8n.example.com/webhook/chat',
    title: 'Demander à JU',
    placeholder: 'Pose ta question...',
  },
};
