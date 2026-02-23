import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTimeline } from './ju-timeline';

const sampleItems = [
  {
    id: 'exp-1',
    date: '2023 – Present',
    title: 'Scrum Master · Full Stack Developer',
    badge: { label: 'Sopra Steria', color: '#fff5f5' },
    subtitle: 'Société Générale',
    points: [
      'Micro-frontends development (React) and back-for-front (Spring).',
      'DevOps: Kubernetes, Docker, Jenkins.',
      'Agile ceremonies facilitation (Scrum).',
    ],
  },
  {
    id: 'exp-2',
    date: '2021 – 2023',
    title: 'Apprentice Full Stack Developer',
    badge: { label: 'Sopra Steria', color: '#fff5f5' },
    subtitle: 'CNP & SG',
    points: [
      'Spring / React development in a Scrum squad.',
      'CI/CD on Cloud (Kubernetes).',
      '.NET + Angular stack for CNP Assurances.',
    ],
  },
  {
    id: 'exp-3',
    date: '2020',
    title: 'Developer Intern',
    badge: { label: 'EDF', color: '#f6faff' },
    subtitle: 'Logistics Department',
    points: [
      'Web business application design.',
      'Documentation and specifications.',
    ],
  },
];

const educationItems = [
  {
    id: 'edu-1',
    date: '2021 – 2023',
    title: 'Master MIAGE, SIR option',
    badge: { label: "Université d'Orléans", color: '#beffe53d' },
    subtitle: "Université d'Orléans",
    points: [
      'Event manager at BDE @AMIGO.',
      'Cryptography, networking, Big Data, data-mining, entrepreneurship…',
    ],
  },
  {
    id: 'edu-2',
    date: '2020 – 2021',
    title: 'Licence MIAGE',
    badge: { label: "Université d'Orléans", color: '#beffe53d' },
  },
];

const meta: Meta<typeof JUTimeline> = {
  title: 'Components/JUTimeline',
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
        Professional Experience
      </p>
      <JUTimeline items={sampleItems} accordion />
      <hr style={{ border: 'none', height: '1px', background: '#eee', margin: '2.5rem 0' }} />
      <p style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: '#666', letterSpacing: '0.03em' }}>
        Education
      </p>
      <JUTimeline items={educationItems} accordion />
    </div>
  ),
};

export const AllExpanded: Story = {
  args: { items: sampleItems, expandAll: true },
};
