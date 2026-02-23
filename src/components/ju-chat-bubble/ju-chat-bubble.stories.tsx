import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUChatBubble } from './ju-chat-bubble';

const meta: Meta<typeof JUChatBubble> = {
  title: 'Components/JUChatBubble',
  component: JUChatBubble,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['blue', 'gray', 'green', 'dark'] },
    tail: { control: 'select', options: ['left', 'right', 'none'] },
  },
  decorators: [(Story) => <div style={{ padding: '2rem', maxWidth: '500px' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUChatBubble>;

export const Blue: Story = {
  args: { children: <p>J'explore des idées qui me ressemblent, je les structure, je les concrétise.</p>, color: 'blue', tail: 'left' },
};

export const Gray: Story = {
  args: { children: <p>Mais je suis déjà dessus non ?</p>, color: 'gray', tail: 'right' },
};

export const Conversation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex' }}>
        <JUChatBubble color="blue" tail="left" sender="Julien">
          <p>Bienvenue sur mon portfolio ! Ce site est développé avec React et déployé sur Azure.</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <JUChatBubble color="gray" tail="right">
          <p>Mais je suis déjà dessus non ? 😄</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex' }}>
        <JUChatBubble color="blue" tail="left" sender="Julien">
          <p>Exactement 😉</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <JUChatBubble color="gray" tail="right">
          <p>Il est stylé le bouton 😲</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex' }}>
        <JUChatBubble color="green" tail="left" sender="Julien">
          <p>Hésite pas à t'inscrire à l'asso !</p>
        </JUChatBubble>
      </div>
    </div>
  ),
};

export const OnDark: Story = {
  render: () => (
    <div style={{
      padding: '2rem', borderRadius: '24px',
      background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)',
      display: 'flex', flexDirection: 'column', gap: '0.8rem',
    }}>
      <JUChatBubble color="blue" tail="left"><p>Hello from the dark side!</p></JUChatBubble>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <JUChatBubble color="dark" tail="right"><p>Looking good!</p></JUChatBubble>
      </div>
    </div>
  ),
};
