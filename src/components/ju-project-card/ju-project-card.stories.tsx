import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUProjectCard } from './ju-project-card';

const meta: Meta<typeof JUProjectCard> = {
  title: 'Components/JUProjectCard',
  component: JUProjectCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUProjectCard>;

export const Default: Story = {
  args: {
    image: { src: 'https://placehold.co/600x300/1a1a2e/ffffff?text=JU+Design', alt: 'JU Design' },
    avatar: 'J',
    messages: [
      { sender: 'Julien', text: 'Ma librairie React avec Storybook, déployée via Azure.', side: 'left' },
      { sender: 'Moi', text: 'Il est stylé le bouton 😲', side: 'right' },
      { sender: 'Julien', text: 'Ma librairie React', side: 'left', link: 'https://ju-design.azurestaticapps.net/' },
    ],
  },
};

export const Blog: Story = {
  args: {
    image: { src: 'https://placehold.co/600x300/667eea/ffffff?text=Le+Labo', alt: 'Le Labo' },
    avatar: 'J',
    messages: [
      { sender: 'Julien', text: 'Ma nouvelle application en développement : un blog pour lire des articles sur divers sujets tech.', side: 'left' },
      { sender: 'Moi', text: "J'aimerai bien suivre l'actu tech", side: 'right' },
      { sender: 'Julien', text: 'Va lire le tout dernier article, il était passionnant à écrire.', side: 'left', link: 'https://blog.julienlietard.fr/' },
    ],
  },
};

export const InCarouselContext: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '1200px', margin: '0 auto' }}>
      <JUProjectCard
        image={{ src: 'https://placehold.co/600x300/667eea/ffffff?text=Labo', alt: 'Labo' }}
        messages={[
          { sender: 'Julien', text: 'Mon blog tech pour partager des articles.', side: 'left' },
          { sender: 'Moi', text: "J'aimerai bien suivre l'actu tech", side: 'right' },
          { sender: 'Julien', text: 'Va lire le tout dernier article !', side: 'left', link: 'https://blog.julienlietard.fr/' },
        ]}
        height="580px"
      />
      <JUProjectCard
        image={{ src: 'https://placehold.co/600x300/1a1a2e/ffffff?text=JU+Design', alt: 'JU Design' }}
        messages={[
          { sender: 'Julien', text: 'Ma librairie React avec Storybook.', side: 'left' },
          { sender: 'Moi', text: 'Il est stylé le bouton 😲', side: 'right' },
          { sender: 'Julien', text: 'Ma librairie React', side: 'left', link: 'https://ju-design.azurestaticapps.net/' },
        ]}
        height="580px"
      />
      <JUProjectCard
        image={{ src: 'https://placehold.co/600x300/2d6a4f/ffffff?text=UDESMA45', alt: 'UDESMA45' }}
        messages={[
          { sender: 'Julien', text: "Site web de l'association UDESMA45.", side: 'left' },
          { sender: 'Moi', text: "Elle a l'air super cette association !", side: 'right' },
          { sender: 'Julien', text: "Hésite pas à t'inscrire !", side: 'left', link: 'https://udesma45.fr/' },
        ]}
        height="580px"
      />
    </div>
  ),
  decorators: [(Story) => <div style={{ padding: '2rem' }}><Story /></div>],
};

export const FlexibleHeight: Story = {
  args: {
    image: { src: 'https://placehold.co/600x300/764ba2/ffffff?text=Portfolio', alt: 'Portfolio' },
    avatar: 'J',
    height: 'auto',
    messages: [
      { sender: 'Julien', text: 'Découvrez mon portfolio.', side: 'left' },
      { sender: 'Moi', text: 'Mais je suis déjà dessus non ?', side: 'right' },
      { sender: 'Julien', text: 'Exactement 😉', side: 'left', link: 'https://julienlietard.fr/' },
    ],
  },
};