import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUCarousel } from './ju-carousel';
import { JUCard } from '../ju-card/ju-card';
import { JUProjectCard } from '../ju-project-card/ju-project-card';
import { JUButton } from '../ju-button/ju-button';

const meta: Meta<typeof JUCarousel> = {
  title: 'Components/JUCarousel',
  component: JUCarousel,
  tags: ['autodocs'],
  argTypes: {
    itemsPerSlide: { control: { type: 'range', min: 1, max: 5, step: 1 } },
    interval: { control: { type: 'range', min: 1000, max: 10000, step: 500 } },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof JUCarousel>;

/* ── Contenu de cartes generiques (pour les demos non-projet) ── */
const sampleCards = [
  { title: 'Portfolio', desc: 'Mon portfolio developpe en React et deploye via Azure.', emoji: '🌐' },
  { title: 'JU Design', desc: 'Ma bibliotheque React de composants reutilisables.', emoji: '🎨' },
  { title: 'Le Labo', desc: 'Mon blog tech pour partager des articles passionnants.', emoji: '🧪' },
  { title: 'Udesma45', desc: "Site web de l'association UDESMA45.", emoji: '🏢' },
  { title: 'Projet annexe', desc: "Un projet experimental en cours d'exploration.", emoji: '🚀' },
  { title: 'Open Source', desc: 'Contributions a des projets open source.', emoji: '💻' },
];

const CardContent: React.FC<{ title: string; desc: string; emoji: string }> = ({ title, desc, emoji }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{emoji}</div>
    <h3 style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '1rem' }}>{title}</h3>
    <p style={{ margin: '0 0 12px', fontSize: '0.85rem', opacity: 0.7 }}>{desc}</p>
    <JUButton label="Voir" size="s" variant="primary" />
  </div>
);

/* ── Donnees de projets reels ── */
const projects = [
  {
    image: { src: 'https://placehold.co/600x300/1a1a2e/ffffff?text=JU+Design', alt: 'JU Design' },
    messages: [
      { sender: 'Julien', text: 'Ma bibliotheque React avec Storybook, deployee via Azure.', side: 'left' as const },
      { sender: 'Moi', text: 'Il est style le bouton 😲', side: 'right' as const },
      { sender: 'Julien', text: 'Explorer la bibliotheque', side: 'left' as const, link: 'https://ju-design.azurestaticapps.net/' },
    ],
  },
  {
    image: { src: 'https://placehold.co/600x300/667eea/ffffff?text=Le+Labo', alt: 'Le Labo' },
    messages: [
      { sender: 'Julien', text: 'Mon blog tech pour partager des articles passionnants.', side: 'left' as const },
      { sender: 'Moi', text: "J'aimerais bien suivre l'actu tech", side: 'right' as const },
      { sender: 'Julien', text: 'Va lire le tout dernier article !', side: 'left' as const, link: 'https://blog.julienlietard.fr/' },
    ],
  },
  {
    image: { src: 'https://placehold.co/600x300/2d6a4f/ffffff?text=UDESMA45', alt: 'UDESMA45' },
    messages: [
      { sender: 'Julien', text: "Site web de l'association UDESMA45.", side: 'left' as const },
      { sender: 'Moi', text: "Elle a l'air super cette association !", side: 'right' as const },
      { sender: 'Julien', text: "N'hesite pas a t'inscrire !", side: 'left' as const, link: 'https://udesma45.fr/' },
    ],
  },
  {
    image: { src: 'https://placehold.co/600x300/764ba2/ffffff?text=Portfolio', alt: 'Portfolio' },
    messages: [
      { sender: 'Julien', text: 'Mon portfolio personnel developpe sous React.', side: 'left' as const },
      { sender: 'Moi', text: 'Mais je suis deja dessus non ?', side: 'right' as const },
      { sender: 'Julien', text: 'Exactement 😉', side: 'left' as const, link: 'https://julienlietard.fr/' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────
 * ✦ CARROUSEL DE PROJETS — la story principale, avec JUProjectCard
 * ───────────────────────────────────────────────────────────────────────── */
export const ProjectCarousel: Story = {
  args: {
    autoPlay: true,
    interval: 6000,
    itemsPerSlide: 3,
  },
  render: (args) => (
    <JUCarousel {...args}>
      {projects.map((p, i) => (
        <JUProjectCard key={i} {...p} />
      ))}
    </JUCarousel>
  ),
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '3rem 1rem',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '500px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * Par defaut : 3 par diapositive, JUCard generique
 * ───────────────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    autoPlay: true,
    interval: 5000,
    itemsPerSlide: 3,
  },
  render: (args) => (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <JUCarousel {...args}>
        {sampleCards.map((card, i) => (
          <JUCard key={i} variant="glass">
            <CardContent {...card} />
          </JUCard>
        ))}
      </JUCarousel>
    </div>
  ),
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '3rem 1rem',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '400px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * Diapositive unique
 * ───────────────────────────────────────────────────────────────────────── */
export const SingleSlide: Story = {
  args: {
    autoPlay: false,
    itemsPerSlide: 1,
  },
  render: (args) => (
    <div style={{ maxWidth: '420px', margin: '0 auto' }}>
      <JUCarousel {...args}>
        {projects.slice(0, 3).map((p, i) => (
          <JUProjectCard key={i} {...p} />
        ))}
      </JUCarousel>
    </div>
  ),
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '3rem 1rem',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          minHeight: '500px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
 * Manuel uniquement — pas de lecture automatique, pas de bouton lecture
 * ───────────────────────────────────────────────────────────────────────── */
export const ManualOnly: Story = {
  args: {
    autoPlay: false,
    showPlayButton: false,
    itemsPerSlide: 2,
  },
  render: (args) => (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <JUCarousel {...args}>
        {sampleCards.slice(0, 4).map((card, i) => (
          <JUCard key={i} variant="outline">
            <CardContent {...card} />
          </JUCard>
        ))}
      </JUCarousel>
    </div>
  ),
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '3rem 1rem',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          minHeight: '400px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
