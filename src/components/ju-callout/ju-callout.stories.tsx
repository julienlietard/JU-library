import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUCallout } from './ju-callout';

const meta: Meta<typeof JUCallout> = {
  title: 'Molecules/JUCallout',
  component: JUCallout,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 600, margin: '0 auto', padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof JUCallout>;

export const AllVariants: Story = {
  render: () => (
    <>
      <JUCallout variant="note" title="Note">Une note simple pour ajouter du contexte à votre maquette.</JUCallout>
      <JUCallout variant="info" title="Information">Ce composant utilise les propriétés CSS personnalisées du système de tokens JU Design.</JUCallout>
      <JUCallout variant="warning" title="Attention">Cette API est obsolète et sera supprimée dans la version 2.0.</JUCallout>
      <JUCallout variant="success" title="Terminé !">Votre composant a été publié avec succès sur npm.</JUCallout>
      <JUCallout variant="danger" title="Changement majeur">Cette mise à jour contient des modifications incompatibles de l'API Bouton.</JUCallout>
    </>
  ),
};

export const NoTitle: Story = {
  args: { variant: 'info', children: 'Un callout simple sans titre.' },
};

export const NoIcon: Story = {
  args: { variant: 'warning', title: 'Personnalisé', hideIcon: true, children: 'Un callout sans icône.' },
};
