import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTooltip } from './ju-tooltip';

const meta: Meta<typeof JUTooltip> = {
  title: 'Components/JUTooltip',
  component: JUTooltip,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof JUTooltip>;

const btnStyle = { 
  padding: '10px 20px', 
  borderRadius: 8, 
  border: '1px solid #333', 
  background: '#222', 
  color: '#fff', 
  cursor: 'pointer',
  fontFamily: 'inherit'
};

export const Top: Story = {
  render: () => (
    <JUTooltip content="Action rapide" placement="top">
      <button style={btnStyle}>Survolez-moi</button>
    </JUTooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <JUTooltip content="Plus d'infos ici" placement="bottom">
      <button style={btnStyle}>En bas</button>
    </JUTooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <JUTooltip content="Panneau latéral" placement="left">
      <button style={btnStyle}>À gauche</button>
    </JUTooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <JUTooltip content="Options avancées" placement="right">
      <button style={btnStyle}>À droite</button>
    </JUTooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <JUTooltip
      content="Ceci est un tooltip avec un contenu plus long pour montrer le retour à la ligne automatique et la largeur maximale."
      placement="top"
      maxWidth={200}
    >
      <span style={{ padding: '8px 16px', borderRadius: 8, background: '#1b82ff', color: '#fff', cursor: 'pointer', display: 'inline-block' }}>
        Contenu long
      </span>
    </JUTooltip>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <JUTooltip content="Apparition retardée (500ms)" placement="top" delay={500}>
      <button style={btnStyle}>Délai 500ms</button>
    </JUTooltip>
  ),
};

export const Disabled: Story = {
  render: () => (
    <JUTooltip content="Tu ne verras pas ça" placement="top" disabled>
      <button style={{ ...btnStyle, border: '1px solid #555', background: '#333', color: '#888', cursor: 'not-allowed' }}>
        Désactivé
      </button>
    </JUTooltip>
  ),
};

export const MultipleTooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((p) => (
        <JUTooltip key={p} content={`Placement: ${p}`} placement={p}>
          <button style={{ ...btnStyle, textTransform: 'capitalize' }}>
            {p}
          </button>
        </JUTooltip>
      ))}
    </div>
  ),
};

export const InsideOverflow: Story = {
  render: () => (
    <div style={{ padding: '2rem', border: '2px dashed #ccc', overflow: 'hidden', width: '200px', textAlign: 'center' }}>
      <p style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
        Ce conteneur coupe ce qui dépasse (overflow: hidden).
      </p>
      <JUTooltip content="Mais je m'échappe grâce au Portal React !" placement="top">
        <button style={btnStyle}>Hover moi</button>
      </JUTooltip>
    </div>
  ),
};