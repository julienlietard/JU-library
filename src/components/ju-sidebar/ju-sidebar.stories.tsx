import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSidebar } from './ju-sidebar';

const meta: Meta<typeof JUSidebar> = {
  title: 'Navigation/JUSidebar',
  component: JUSidebar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUSidebar>;

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const SECTIONS = [
  {
    title: 'Composants',
    items: [
      { label: 'Tous les composants', icon: <HomeIcon />, active: true },
      { label: 'Brouillons', icon: <FileIcon /> },
      { label: 'Publiés', icon: <FileIcon /> },
    ],
  },
  {
    title: 'Catégories',
    items: [
      { label: 'Typographie', icon: <TagIcon /> },
      { label: 'Palette de couleurs', icon: <TagIcon /> },
      { label: 'Grilles & Espacements', icon: <TagIcon /> },
    ],
  },
];

const ContentBlock = ({ count = 15 }: { count?: number }) => (
  <div style={{ flex: 1, marginLeft: 260, padding: '40px 48px', maxWidth: 720, opacity: 0.7 }}>
    {Array.from({ length: count }, (_, i) => (
      <p key={i} style={{ marginBottom: 20, lineHeight: 1.7, fontSize: '1.05rem' }}>
        Le design est l'art de donner forme aux idées. Chaque composant est pensé pour s'intégrer harmonieusement dans l'ensemble du système.
      </p>
    ))}
  </div>
);

export const Default: Story = {
  decorators: [(Story) => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Story />
      <ContentBlock />
    </div>
  )],
  args: {
    sections: SECTIONS,
    header: <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Atelier Design</span>,
  },
};

export const WithFooter: Story = {
  decorators: [(Story) => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Story />
      <ContentBlock />
    </div>
  )],
  args: {
    sections: SECTIONS,
    header: <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Atelier Design</span>,
    footer: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SettingsIcon />
        <span style={{ fontSize: '0.85rem' }}>Paramètres</span>
      </div>
    ),
  },
};

export const Minimal: Story = {
  decorators: [(Story) => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Story />
      <ContentBlock />
    </div>
  )],
  args: {
    sections: [
      {
        items: [
          { label: 'Accueil', icon: <HomeIcon />, active: true },
          { label: 'Composants', icon: <FileIcon /> },
          { label: 'Tokens', icon: <TagIcon /> },
          { label: 'Paramètres', icon: <SettingsIcon /> },
        ],
      },
    ],
  },
};

export const RightSide: Story = {
  decorators: [(Story) => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: 1, marginRight: 260, padding: '40px 48px', maxWidth: 720, opacity: 0.7 }}>
        <p style={{ lineHeight: 1.7 }}>Contenu principal avec barre latérale à droite.</p>
      </div>
      <Story />
    </div>
  )],
  args: {
    sections: [{ title: 'Sommaire', items: [{ label: 'Introduction', active: true }, { label: 'Fondamentaux' }, { label: 'Conclusion' }] }],
    position: 'right',
  },
};
