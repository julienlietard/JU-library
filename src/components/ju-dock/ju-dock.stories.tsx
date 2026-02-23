import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUDock, JUDockItem } from './ju-dock';

const demoItems: JUDockItem[] = [
  { id: 'home', icon: <span>🏠</span>, label: 'Home' },
  { id: 'about', icon: <span>👤</span>, label: 'About' },
  { id: 'skills', icon: <span>⚡</span>, label: 'Skills' },
  { id: 'projects', icon: <span>📁</span>, label: 'Projects' },
  { id: 'contact', icon: <span>💬</span>, label: 'Contact' },
  { id: 'gallery', icon: <span>⭐</span>, label: 'Gallery' },
];

const meta: Meta<typeof JUDock> = {
  title: 'Components/JUDock',
  component: JUDock,
  tags: ['autodocs'],
  argTypes: {
    theme: { control: 'select', options: ['light', 'dark'] },
    position: { control: 'select', options: ['bottom', 'top'] },
    visible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof JUDock>;

/* ── Light theme (portfolio style) ── */
export const Light: Story = {
  args: {
    items: demoItems,
    activeId: 'home',
    theme: 'light',
    visible: true,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
          padding: '2rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/* ── Dark theme ── */
export const Dark: Story = {
  args: {
    items: demoItems,
    activeId: 'home',
    theme: 'dark',
    visible: true,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '2rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/* ── Interactive demo ── */
const InteractiveDemo = () => {
  const [activeId, setActiveId] = useState('home');

  return (
    <div
      style={{
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        background: 'linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          background: 'rgba(0,0,0,0.05)',
          fontSize: '1rem',
        }}
      >
        Active section: <strong>{activeId}</strong>
      </div>
      <JUDock
        items={demoItems}
        activeId={activeId}
        onItemClick={setActiveId}
        theme="light"
        visible
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

/* ── Both themes side by side ── */
export const ThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div
        style={{
          padding: '3rem',
          display: 'flex',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
          borderRadius: '16px',
        }}
      >
        <JUDock items={demoItems} activeId="home" theme="light" visible />
      </div>
      <div
        style={{
          padding: '3rem',
          display: 'flex',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          borderRadius: '16px',
        }}
      >
        <JUDock items={demoItems} activeId="home" theme="dark" visible />
      </div>
    </div>
  ),
};
