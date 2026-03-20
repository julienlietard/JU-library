import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUVideoPlayer } from './ju-video-player';

const SAMPLE_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4';
const SAMPLE_POSTER = 'https://placehold.co/960x540/1a1a2e/ffffff?text=▶';

const meta: Meta<typeof JUVideoPlayer> = {
  title: 'Organisms/JUVideoPlayer',
  component: JUVideoPlayer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: '700px', margin: '0 auto' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUVideoPlayer>;

export const Default: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    aspectRatio: '16/9',
    borderRadius: 24,
  },
};

export const RedAccent: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    accentColor: '#ff3b30',
    aspectRatio: '16/9',
    borderRadius: 24,
  },
};

export const BlueAccent: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    accentColor: '#007aff',
    aspectRatio: '16/9',
    borderRadius: 24,
  },
};

export const PurpleAccent: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
    accentColor: '#af52de',
    aspectRatio: '16/9',
    borderRadius: 24,
  },
};

export const Square: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: 'https://placehold.co/600x600/2d6a4f/ffffff?text=🎨',
    aspectRatio: '1/1',
    borderRadius: 20,
    accentColor: '#34c759',
  },
  decorators: [(Story) => <div style={{ maxWidth: '400px', margin: '0 auto' }}><Story /></div>],
};

export const Cinematic: Story = {
  args: {
    src: SAMPLE_VIDEO,
    poster: 'https://placehold.co/1200x500/0f0f0f/ffffff?text=Cinematic',
    aspectRatio: '21/9',
    borderRadius: 32,
  },
  decorators: [(Story) => <div style={{ maxWidth: '900px', margin: '0 auto' }}><Story /></div>],
};

export const AutoPlayMuted: Story = {
  args: {
    src: SAMPLE_VIDEO,
    autoPlay: true,
    muted: true,
    loop: true,
    aspectRatio: '16/9',
    borderRadius: 24,
  },
};

export const PassionGrid: Story = {
  render: () => (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
      maxWidth: '900px', margin: '0 auto',
    }}>
      <JUVideoPlayer
        src={SAMPLE_VIDEO}
        poster="https://placehold.co/600x600/2d6a4f/ffffff?text=🎨+Art"
        aspectRatio="1/1"
        borderRadius={20}
        accentColor="#ff9500"
      />
      <JUVideoPlayer
        src={SAMPLE_VIDEO}
        poster="https://placehold.co/600x600/764ba2/ffffff?text=🎬+Cinema"
        aspectRatio="1/1"
        borderRadius={20}
        accentColor="#af52de"
      />
    </div>
  ),
  decorators: [(Story) => <div style={{ padding: '2rem' }}><Story /></div>],
};