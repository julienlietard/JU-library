import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUCard } from './ju-card';
import { JUButton } from '../ju-button/ju-button';
import { JUBadge } from '../ju-badge/ju-badge';

const meta: Meta<typeof JUCard> = {
  title: 'Components/JUCard',
  component: JUCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['glass', 'solid', 'outline', 'chat', 'visual'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof JUCard>;

/* ── Glass ── */
export const Glass: Story = {
  args: {
    variant: 'glass', interactive: true,
    children: <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2rem' }}>🎨</span><h3 style={{ margin: '8px 0', fontWeight: 600 }}>JU Design</h3><p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Ma librairie React</p></div>,
  },
  decorators: [(Story) => <div style={{ padding: '3rem', background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)', borderRadius: '24px', maxWidth: '300px' }}><Story /></div>],
};

/* ── Chat ── */
export const Chat: Story = {
  args: {
    variant: 'chat', padding: 'md', interactive: true,
    children: <div><h4 style={{ margin: '0 0 6px', fontWeight: 600 }}>Project Card</h4><p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#666' }}>Developed with React & Azure.</p><JUButton label="View" variant="primary" size="s" /></div>,
  },
  decorators: [(Story) => <div style={{ padding: '3rem', maxWidth: '320px' }}><Story /></div>],
};

/* ── Visual: Passion Art (square image card) ── */
export const VisualArt: Story = {
  args: {
    variant: 'visual',
    interactive: true,
    backgroundImage: 'https://placehold.co/600x600/2d6a4f/ffffff?text=🎨+Art',
    aspectRatio: '1/1',
    padding: 'none',
    children: null,
  },
  decorators: [(Story) => <div style={{ padding: '2rem', maxWidth: '300px' }}><Story /></div>],
};

/* ── Visual: Passion Space (wide with overlay text) ── */
export const VisualSpace: Story = {
  args: {
    variant: 'visual',
    interactive: true,
    backgroundImage: 'https://placehold.co/900x400/111111/ffffff?text=✦+L%27infini%2C+le+vide',
    aspectRatio: '16/7',
    padding: 'none',
    children: (
      <div style={{ textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px',
          padding: '0.5rem 1.2rem', fontSize: '0.9rem', color: '#fff',
        }}>
          ✦ L'infini, le vide, l'infini, l'éclat, le vertige.
        </span>
      </div>
    ),
  },
  decorators: [(Story) => <div style={{ padding: '2rem', maxWidth: '700px' }}><Story /></div>],
};

/* ── Visual: No overlay content (pure image) ── */
export const VisualPure: Story = {
  args: {
    variant: 'visual',
    interactive: true,
    backgroundImage: 'https://placehold.co/400x400/764ba2/ffffff?text=🔭',
    aspectRatio: '1/1',
    padding: 'none',
  },
  decorators: [(Story) => <div style={{ padding: '2rem', maxWidth: '280px' }}><Story /></div>],
};

/* ── All variants showcase ── */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      {/* Dark bg variants */}
      <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #0f0f0f, #1a1a2e)', borderRadius: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <JUCard variant="glass" interactive>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2rem' }}>🌐</span><h4 style={{ margin: '8px 0 4px', fontWeight: 600 }}>Glass</h4></div>
          </JUCard>
          <JUCard variant="solid" interactive>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2rem' }}>🎯</span><h4 style={{ margin: '8px 0 4px', fontWeight: 600 }}>Solid</h4></div>
          </JUCard>
          <JUCard variant="outline" interactive>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2rem' }}>✨</span><h4 style={{ margin: '8px 0 4px', fontWeight: 600 }}>Outline</h4></div>
          </JUCard>
        </div>
      </div>

      {/* Chat variant */}
      <JUCard variant="chat" interactive style={{ maxWidth: '320px' }}>
        <div><h4 style={{ margin: '0 0 6px', fontWeight: 600 }}>Chat</h4><p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#666' }}>iMessage card style</p>
        <div style={{ display: 'flex', gap: '6px' }}><JUBadge label="React" color="blue" /><JUBadge label="Azure" color="purple" /></div></div>
      </JUCard>

      {/* Visual variants */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
        <JUCard variant="visual" interactive backgroundImage="https://placehold.co/400x400/2d6a4f/ffffff?text=🎨" aspectRatio="1/1" padding="none" />
        <JUCard variant="visual" interactive backgroundImage="https://placehold.co/400x400/764ba2/ffffff?text=🔭" aspectRatio="1/1" padding="none" />
        <JUCard variant="visual" interactive backgroundImage="https://placehold.co/900x400/111/fff?text=✦+Space" aspectRatio="16/7" padding="none">
          <div style={{ textAlign: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              ✦ L'infini, le vide, l'éclat, le vertige.
            </span>
          </div>
        </JUCard>
      </div>
    </div>
  ),
};