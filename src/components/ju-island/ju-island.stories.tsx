import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUIsland } from './ju-island';

const demoLinks = [
  { id: 'about', label: 'About Me', href: '#about' },
  { id: 'skills', label: 'My Skills', href: '#skills' },
  { id: 'projects', label: 'My Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

const meta: Meta<typeof JUIsland> = {
  title: 'Components/JUIsland',
  component: JUIsland,
  tags: ['autodocs'],
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    autoCloseDelay: { control: { type: 'range', min: 0, max: 5000, step: 500 } },
    progressColor: { control: 'color' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '350px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '3rem',
          background: '#f5f5f5',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUIsland>;

/* ── Default ── */
export const Default: Story = {
  args: {
    sectionLabel: 'Compétences',
    progress: 45,
    links: demoLinks,
    visible: true,
  },
};

/* ── Empty (no progress) ── */
export const Empty: Story = {
  args: {
    sectionLabel: 'Accueil',
    progress: 0,
    links: demoLinks,
    visible: true,
  },
};

/* ── Full progress ── */
export const Complete: Story = {
  args: {
    sectionLabel: 'Contact',
    progress: 100,
    links: demoLinks,
    visible: true,
  },
};

/* ── Custom color ── */
export const CustomColor: Story = {
  args: {
    sectionLabel: 'Workspace',
    progress: 72,
    links: demoLinks,
    progressColor: '#00b436',
    visible: true,
  },
};

/* ── Interactive slider demo ── */
const InteractiveDemo = () => {
  const [progress, setProgress] = useState(0);

  const sections = [
    { threshold: 25, label: 'Accueil' },
    { threshold: 45, label: 'Sur moi' },
    { threshold: 68, label: 'Compétences' },
    { threshold: 90, label: 'Workspace' },
    { threshold: 101, label: 'Contact' },
  ];

  const currentLabel =
    sections.find((s) => progress < s.threshold)?.label ?? 'Contact';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        width: '100%',
      }}
    >
      <JUIsland
        sectionLabel={currentLabel}
        progress={progress}
        links={demoLinks}
        onLinkClick={(id) => {
          const map: Record<string, number> = {
            about: 30,
            skills: 55,
            projects: 78,
            contact: 95,
          };
          setProgress(map[id] ?? 0);
        }}
        visible
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 2rem',
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '12px',
        }}
      >
        <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          Simulate scroll:
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          style={{ width: '250px' }}
        />
        <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '3ch' }}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
