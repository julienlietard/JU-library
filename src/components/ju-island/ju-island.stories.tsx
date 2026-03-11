import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUIsland } from './ju-island';

const demoLinks = [
  { id: 'intro', label: 'Introduction', href: '#intro' },
  { id: 'context', label: 'Contexte', href: '#context' },
  { id: 'method', label: 'Methodologie', href: '#method' },
  { id: 'results', label: 'Resultats', href: '#results' },
  { id: 'discussion', label: 'Discussion', href: '#discussion' },
  { id: 'conclusion', label: 'Conclusion', href: '#conclusion' },
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

/* ── Par defaut ── */
export const Default: Story = {
  args: {
    sectionLabel: 'Methodologie',
    progress: 45,
    links: demoLinks,
    activeId: 'method',
    visible: true,
  },
};

/* ── Vide (pas de progression) ── */
export const Empty: Story = {
  args: {
    sectionLabel: 'Accueil',
    progress: 0,
    links: demoLinks,
    visible: true,
  },
};

/* ── Progression complete ── */
export const Complete: Story = {
  args: {
    sectionLabel: 'Contact',
    progress: 100,
    links: demoLinks,
    visible: true,
  },
};

/* ── Couleur personnalisee ── */
export const CustomColor: Story = {
  args: {
    sectionLabel: 'Espace de travail',
    progress: 72,
    links: demoLinks,
    progressColor: '#00b436',
    visible: true,
  },
};

/* ── Demo interactive avec curseur ── */
const InteractiveDemo = () => {
  const [progress, setProgress] = useState(0);

  const sections = [
    { threshold: 15, label: 'Introduction', id: 'intro' },
    { threshold: 30, label: 'Contexte', id: 'context' },
    { threshold: 50, label: 'Methodologie', id: 'method' },
    { threshold: 70, label: 'Resultats', id: 'results' },
    { threshold: 88, label: 'Discussion', id: 'discussion' },
    { threshold: 101, label: 'Conclusion', id: 'conclusion' },
  ];

  const currentSection =
    sections.find((s) => progress < s.threshold) ?? sections[sections.length - 1];

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
        sectionLabel={currentSection.label}
        progress={progress}
        links={demoLinks}
        activeId={currentSection.id}
        onLinkClick={(id) => {
          const map: Record<string, number> = {
            intro: 5,
            context: 20,
            method: 40,
            results: 60,
            discussion: 78,
            conclusion: 92,
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
          Simuler le defilement :
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
