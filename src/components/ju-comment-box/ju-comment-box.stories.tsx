import type { Meta, StoryObj } from '@storybook/react';
import { JUCommentBox, JUCommentBoxUser, JUCommentBoxComment } from './ju-comment-box';

/* ---- Demo data ---- */

const demoUsers: JUCommentBoxUser[] = [
  {
    id: '1',
    name: 'hanny.unicorn',
    avatarSrc: 'https://api.dicebear.com/9.x/glass/svg?seed=hanny&backgroundColor=ff69b4',
    verified: true,
  },
  {
    id: '2',
    name: 'hanko',
    avatarSrc: 'https://api.dicebear.com/9.x/glass/svg?seed=hanko&backgroundColor=22c55e',
    verified: true,
  },
  {
    id: '3',
    name: 'hannah.dev',
    avatarSrc: 'https://api.dicebear.com/9.x/glass/svg?seed=hannah&backgroundColor=6366f1',
    verified: false,
  },
  {
    id: '4',
    name: 'julien.dev',
    avatarSrc: 'https://api.dicebear.com/9.x/glass/svg?seed=julien&backgroundColor=f59e0b',
    verified: true,
  },
  {
    id: '5',
    name: 'sophie.x',
    avatarSrc: 'https://api.dicebear.com/9.x/glass/svg?seed=sophie&backgroundColor=ec4899',
    verified: false,
  },
];

const demoComments: JUCommentBoxComment[] = [
  {
    id: 'c1',
    author: demoUsers[0],
    body: 'This looks amazing! Great work on the redesign.',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

/* ---- Meta ---- */

const meta: Meta<typeof JUCommentBox> = {
  title: 'Molecules/JUCommentBox',
  component: JUCommentBox,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    placeholder: { control: 'text' },
    showEmoji: { control: 'boolean' },
    showAttach: { control: 'boolean' },
    showAI: { control: 'boolean' },
    showKeyboard: { control: 'boolean' },
    maxSuggestions: { control: { type: 'number', min: 1, max: 10 } },
  },
  args: {
    title: 'Add comment',
    placeholder: 'Write a comment…',
    showEmoji: true,
    showAttach: true,
    showAI: true,
    showKeyboard: true,
    maxSuggestions: 5,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUCommentBox>;

/* ---- Stories ---- */

export const Playground: Story = {
  args: {
    users: demoUsers,
    comments: demoComments,
    onClose: () => alert('Close clicked'),
    onSubmit: (value, mentions) => {
      alert(`Submitted: "${value}"\nMentions: ${mentions.join(', ') || 'none'}`);
    },
  },
};

export const Empty: Story = {
  name: 'Empty (no comments)',
  args: {
    users: demoUsers,
    comments: [],
    onClose: () => {},
    onSubmit: (value) => console.log('Submit:', value),
  },
};

export const WithThread: Story = {
  name: 'With comment thread',
  args: {
    users: demoUsers,
    comments: [
      {
        id: 'c1',
        author: demoUsers[0],
        body: 'This looks amazing! Great work on the redesign.',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'c2',
        author: demoUsers[3],
        body: 'Thanks @hanny.unicorn! Still tweaking the spacing.',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'c3',
        author: demoUsers[1],
        body: 'Love the glassmorphism effect on the cards.',
        date: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    onClose: () => {},
    onSubmit: (value) => console.log('Submit:', value),
  },
};

export const MentionDemo: Story = {
  name: 'Mention Autocomplete (type @han)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <p style={{ fontFamily: 'var(--ju-font-family)', fontSize: '0.85rem', color: '#71717a', margin: 0 }}>
        Type <strong>@han</strong> in the input to see autocomplete suggestions
      </p>
      <JUCommentBox
        users={demoUsers}
        comments={demoComments}
        onClose={() => {}}
        onSubmit={(value, mentions) => console.log('Submit:', value, 'Mentions:', mentions)}
      />
    </div>
  ),
};

export const NoToolbar: Story = {
  name: 'Minimal (no toolbar actions)',
  args: {
    users: demoUsers,
    comments: [],
    showEmoji: false,
    showAttach: false,
    showAI: false,
    showKeyboard: false,
    onClose: () => {},
    onSubmit: (value) => console.log('Submit:', value),
  },
};
