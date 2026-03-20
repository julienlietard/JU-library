import type { Meta, StoryObj } from '@storybook/react';
import { JUCommentThread } from './ju-comment-thread';
import type { JUComment } from './ju-comment-thread';

const now = new Date();
const ago = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

const sampleComments: JUComment[] = [
  {
    id: '1',
    author: 'Julien',
    avatarSrc: 'https://i.pravatar.cc/48?img=12',
    body: "J'ai refactoré le module d'authentification pour supporter les passkeys. Le flow OAuth reste inchangé mais le stockage des sessions a été migré vers Redis.",
    date: ago(15),
    replies: [
      {
        id: '1-1',
        author: 'Sarah',
        avatarSrc: 'https://i.pravatar.cc/48?img=5',
        body: 'Super clean ! Tu as prévu des tests de charge sur Redis ? On avait eu des soucis de latence la dernière fois.',
        date: ago(12),
        replies: [
          {
            id: '1-1-1',
            author: 'Julien',
            avatarSrc: 'https://i.pravatar.cc/48?img=12',
            body: 'Oui, k6 tourne en CI maintenant. Les résultats sont dans le dashboard Grafana.',
            date: ago(8),
            replies: [
              {
                id: '1-1-1-1',
                author: 'Marc',
                body: 'Parfait, je vais checker les métriques côté infra.',
                date: ago(5),
              },
            ],
          },
        ],
      },
      {
        id: '1-2',
        author: 'Léa',
        avatarSrc: 'https://i.pravatar.cc/48?img=23',
        body: "Est-ce que ça impacte le SDK mobile ? Il faudra mettre à jour les dépendances côté iOS.",
        date: ago(10),
      },
    ],
  },
  {
    id: '2',
    author: 'Thomas',
    avatarSrc: 'https://i.pravatar.cc/48?img=33',
    body: "Rappel : on merge freeze demain à 14h pour la release. Merci de finir vos PRs avant.",
    date: ago(45),
    replies: [
      {
        id: '2-1',
        author: 'Julien',
        avatarSrc: 'https://i.pravatar.cc/48?img=12',
        body: 'Noté. Ma PR est prête, je ping Sarah pour la review.',
        date: ago(30),
      },
    ],
  },
];

const meta: Meta<typeof JUCommentThread> = {
  title: 'Molecules/JUCommentThread',
  component: JUCommentThread,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    maxDepth: { control: { type: 'range', min: 1, max: 6 } },
  },
};

export default meta;
type Story = StoryObj<typeof JUCommentThread>;

export const Default: Story = {
  args: {
    comments: sampleComments,
    maxDepth: 4,
    onReply: (id: string) => alert(`Reply to ${id}`),
  },
};

export const ShallowNesting: Story = {
  args: {
    comments: sampleComments,
    maxDepth: 2,
    onReply: (id: string) => alert(`Reply to ${id}`),
  },
};

export const NoAvatars: Story = {
  args: {
    comments: sampleComments.map(function strip(c): JUComment {
      return {
        ...c,
        avatarSrc: undefined,
        replies: c.replies?.map(strip),
      };
    }),
    maxDepth: 4,
    onReply: (id: string) => alert(`Reply to ${id}`),
  },
};

export const SingleThread: Story = {
  args: {
    comments: [sampleComments[0]],
    maxDepth: 4,
  },
};
