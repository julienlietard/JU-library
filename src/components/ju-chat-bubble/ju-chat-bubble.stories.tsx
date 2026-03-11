import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUChatBubble } from './ju-chat-bubble';

const meta: Meta<typeof JUChatBubble> = {
  title: 'Components/JUChatBubble',
  component: JUChatBubble,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ['blue', 'gray', 'green', 'dark', 'ai'] },
    tail: { control: 'select', options: ['left', 'right', 'none'] },
  },
  decorators: [(Story) => <div style={{ padding: '2rem', maxWidth: '500px' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUChatBubble>;

export const Blue: Story = {
  args: { children: <p>J'ai finalisé la maquette du design system, les composants sont prêts pour la revue.</p>, color: 'blue', tail: 'left' },
};

export const Gray: Story = {
  args: { children: <p>Super, tu as pensé à vérifier les contrastes sur la palette de couleurs ?</p>, color: 'gray', tail: 'right' },
};

export const Conversation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <div style={{ display: 'flex' }}>
        <JUChatBubble color="blue" tail="left" sender="Julien">
          <p>J'ai mis à jour la grille typographique et ajouté les tokens de spacing.</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <JUChatBubble color="gray" tail="right">
          <p>Parfait, et pour les composants de formulaire, tu as suivi les maquettes Figma ?</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex' }}>
        <JUChatBubble color="blue" tail="left" sender="Julien">
          <p>Oui, chaque composant respecte les tokens de la palette et les règles d'accessibilité.</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <JUChatBubble color="gray" tail="right">
          <p>Excellent ! On peut lancer la revue de design alors.</p>
        </JUChatBubble>
      </div>
      <div style={{ display: 'flex' }}>
        <JUChatBubble color="green" tail="left" sender="Julien">
          <p>Je publie les composants sur Storybook, vous aurez accès à la documentation complète.</p>
        </JUChatBubble>
      </div>
    </div>
  ),
};

export const OnDark: Story = {
  render: () => (
    <div style={{
      padding: '2rem', borderRadius: '24px',
      display: 'flex', flexDirection: 'column', gap: '0.8rem',
    }}>
      <JUChatBubble color="blue" tail="left"><p>Le mode sombre est intégré dans tous les composants du design system.</p></JUChatBubble>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <JUChatBubble color="dark" tail="right"><p>Les contrastes sont validés WCAG AA.</p></JUChatBubble>
      </div>
    </div>
  ),
};

  export const OnAI: Story = {
    render: () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <JUChatBubble color="ai" tail="right"><p>Je peux vous aider à choisir la bonne palette de couleurs pour votre interface.</p></JUChatBubble>
        </div>
  ),
};
