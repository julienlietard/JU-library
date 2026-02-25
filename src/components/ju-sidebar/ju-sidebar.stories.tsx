import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSidebar } from './ju-sidebar';

const meta: Meta<typeof JUSidebar> = {
  title: 'Navigation/JUSidebar',
  component: JUSidebar,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ height: 500, display: 'flex', border: '1px solid #e4e4e7', borderRadius: 16, overflow: 'hidden' }}><Story /><div style={{ flex: 1, padding: 24, background: '#fafafa' }}>Contenu principal</div></div>],
};
export default meta;
type Story = StoryObj<typeof JUSidebar>;

const SECTIONS = [
  {
    title: 'Articles',
    items: [
      { label: 'Tous les articles', active: true },
      { label: 'Brouillons' },
      { label: 'Publiés' },
    ],
  },
  {
    title: 'Catégories',
    items: [
      { label: 'React' },
      { label: 'Design System' },
      { label: 'TypeScript' },
    ],
  },
];

export const Default: Story = { args: { sections: SECTIONS } };
export const Collapsed: Story = { args: { sections: SECTIONS, defaultOpen: false } };
export const WithHeader: Story = { args: { sections: SECTIONS, header: <span style={{ fontWeight: 600 }}>Laboratoire</span> } };
export const RightSide: Story = {
  args: { sections: [{ title: 'Sommaire', items: [{ label: 'Introduction', active: true }, { label: 'Concepts' }, { label: 'Conclusion' }] }], position: 'right' },
  decorators: [(Story) => <div style={{ height: 400, display: 'flex', border: '1px solid #e4e4e7', borderRadius: 16, overflow: 'hidden' }}><div style={{ flex: 1, padding: 24 }}>Contenu</div><Story /></div>],
};