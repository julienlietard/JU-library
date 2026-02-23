import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUCarousel } from './ju-carousel';
import { JUCard } from '../ju-card/ju-card';
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

/* ── Sample cards ── */
const sampleCards = [
  { title: 'Portfolio', desc: 'Mon portfolio développé en React et déployé via Azure.', emoji: '🌐' },
  { title: 'JU Design', desc: 'Ma librairie React de composants réutilisables.', emoji: '🎨' },
  { title: 'Le Labo', desc: 'Mon blog tech pour partager des articles passionnants.', emoji: '🧪' },
  { title: 'Udesma45', desc: "Site web de l'association UDESMA45.", emoji: '🏢' },
  { title: 'Side Project', desc: "Un projet expérimental en cours d'exploration.", emoji: '🚀' },
  { title: 'Open Source', desc: 'Contributions à des projets open source.', emoji: '💻' },
];

const CardContent: React.FC<{ title: string; desc: string; emoji: string }> = ({ title, desc, emoji }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{emoji}</div>
    <h3 style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '1rem' }}>{title}</h3>
    <p style={{ margin: '0 0 12px', fontSize: '0.85rem', opacity: 0.7 }}>{desc}</p>
    <JUButton label="Voir" size="s" variant="primary" />
  </div>
);

/* ── Default: 3 per slide ── */
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

/* ── Single slide ── */
export const SingleSlide: Story = {
  args: {
    autoPlay: false,
    itemsPerSlide: 1,
  },
  render: (args) => (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <JUCarousel {...args}>
        {sampleCards.slice(0, 3).map((card, i) => (
          <JUCard key={i} variant="solid">
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

/* ── No auto-play, no play button ── */
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
