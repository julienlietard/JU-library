import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTimeline } from './ju-timeline';

const sampleItems = [
  {
    id: 'exp-1',
    date: '2023 – Aujourd\'hui',
    title: 'Directeur Artistique · Designer UI/UX',
    badge: { label: 'Studio Créatif', color: '#fff5f5' },
    subtitle: 'Agence Digitale Paris',
    points: [
      'Conception de systèmes de design (Figma, Storybook).',
      'Création de maquettes haute-fidélité et prototypes interactifs.',
      'Animation d\'ateliers de co-conception et revues de design.',
    ],
  },
  {
    id: 'exp-2',
    date: '2021 – 2023',
    title: 'Designer UI · Intégrateur',
    badge: { label: 'Studio Créatif', color: '#fff5f5' },
    subtitle: 'Projets E-commerce & SaaS',
    points: [
      'Développement de composants React avec tokens de design.',
      'Mise en place de grilles responsives et typographies fluides.',
      'Harmonisation des palettes de couleurs et iconographies.',
    ],
  },
  {
    id: 'exp-3',
    date: '2020',
    title: 'Stagiaire Designer Graphique',
    badge: { label: 'Atelier Visuel', color: '#f6faff' },
    subtitle: 'Département Communication',
    points: [
      'Création d\'identités visuelles et chartes graphiques.',
      'Rédaction de spécifications et documentation design.',
    ],
  },
];

const educationItems = [
  {
    id: 'edu-1',
    date: '2021 – 2023',
    title: 'Master Design d\'Interaction',
    badge: { label: 'École de Design', color: '#beffe53d' },
    subtitle: 'École Supérieure de Design Numérique',
    points: [
      'Spécialisation en design de systèmes et accessibilité.',
      'Typographie avancée, théorie des couleurs, grilles modulaires…',
    ],
  },
  {
    id: 'edu-2',
    date: '2020 – 2021',
    title: 'Licence Arts Visuels & Multimédia',
    badge: { label: 'École de Design', color: '#beffe53d' },
  },
];

const meta: Meta<typeof JUTimeline> = {
  title: 'Organisms/JUTimeline',
  component: JUTimeline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof JUTimeline>;

export const Experience: Story = {
  args: { items: sampleItems, accordion: true },
};

export const Education: Story = {
  args: { items: educationItems, accordion: true },
};

export const FullPage: Story = {
  render: () => (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <p style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: '#666', letterSpacing: '0.03em' }}>
        Expérience Professionnelle
      </p>
      <JUTimeline items={sampleItems} accordion />
      <hr style={{ border: 'none', height: '1px', background: '#eee', margin: '2.5rem 0' }} />
      <p style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: '#666', letterSpacing: '0.03em' }}>
        Formation
      </p>
      <JUTimeline items={educationItems} accordion />
    </div>
  ),
};

export const AllExpanded: Story = {
  args: { items: sampleItems, expandAll: true },
};
