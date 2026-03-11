import type { Meta, StoryObj } from '@storybook/react';
import { JUPriorityHorizon } from './ju-priority-horizon';
import type { JUPriorityEmail } from './ju-priority-horizon';

const sampleEmails: JUPriorityEmail[] = [
  {
    id: '1',
    sender: 'Marie Dupont',
    subject: 'Proposition de collaboration pour le projet design system Q3',
    aiSummary:
      'Marie propose une collaboration sur le design system du Q3. Elle demande une réunion cette semaine pour aligner les composants avec la nouvelle charte.',
  },
  {
    id: '2',
    sender: 'Thomas Lefèvre',
    subject: 'Urgence : déploiement bloqué en production depuis ce matin',
    aiSummary:
      'Le pipeline CI/CD est bloqué par un test flaky sur le module auth. Thomas demande une intervention rapide pour débloquer la release 2.4.1.',
  },
  {
    id: '3',
    sender: 'Stripe Notifications',
    subject: 'Action requise : mise à jour de votre clé API avant le 15 mars',
    aiSummary:
      'Stripe impose une migration vers l\'API v2024-12. La clé actuelle expire le 15 mars. Action : régénérer la clé dans le dashboard et mettre à jour les variables d\'environnement.',
  },
];

const meta: Meta<typeof JUPriorityHorizon> = {
  title: 'Widgets/JUPriorityHorizon',
  component: JUPriorityHorizon,
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
type Story = StoryObj<typeof JUPriorityHorizon>;

export const Default: Story = {
  args: {
    emails: sampleEmails,
    webhookUrl: 'https://your-n8n.example.com/webhook/archive',
    title: 'Priority Horizon',
  },
};

export const SingleEmail: Story = {
  args: {
    emails: [sampleEmails[1]],
    webhookUrl: 'https://your-n8n.example.com/webhook/archive',
    title: 'Inbox prioritaire',
  },
};

export const Empty: Story = {
  args: {
    emails: [],
    webhookUrl: 'https://your-n8n.example.com/webhook/archive',
  },
};
