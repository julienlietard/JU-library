import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTypography } from './ju-typography';

const meta: Meta<typeof JUTypography> = {
  title: 'Typography/JUTypography',
  component: JUTypography,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 700, padding: 40 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof JUTypography>;

export const AllVariants: Story = {
  render: () => (
    <>
      <JUTypography variant="caption">Légende — Libellé système</JUTypography>
      <JUTypography variant="h1">Titre Principal</JUTypography>
      <JUTypography variant="h2">Titre Secondaire</JUTypography>
      <JUTypography variant="h3">Titre Tertiaire</JUTypography>
      <JUTypography variant="h4">Titre Quaternaire</JUTypography>
      <JUTypography variant="lead">Paragraphe d'accroche — idéal pour les introductions d'articles avec une hauteur de ligne généreuse pour une lecture confortable.</JUTypography>
      <JUTypography variant="body">Corps de texte — optimisé pour la lecture longue avec une largeur maximale de 65 caractères et une hauteur de ligne de 1.7 pour la lisibilité.</JUTypography>
      <JUTypography variant="small">Texte petit pour les informations secondaires.</JUTypography>
    </>
  ),
};

export const GradientHeading: Story = {
  args: { variant: 'h1', gradient: true, balance: true, children: 'Système de Design Élégant' },
};

export const MutedBody: Story = {
  args: { variant: 'body', muted: true, children: 'Texte atténué pour le contenu secondaire qui ne doit pas distraire du contenu principal.' },
};

export const OnColoredBackground: Story = {
  name: 'Sur fonds colorés',
  decorators: [(S) => <div style={{ maxWidth: 700 }}><S /></div>],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#1b82ff', color: '#ffffff', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h2">Blanc sur bleu</JUTypography>
        <JUTypography variant="body">Le texte hérite de la couleur du parent — aucune surcharge forcée.</JUTypography>
        <JUTypography variant="caption">Texte de légende</JUTypography>
      </div>
      <div style={{ background: '#18181b', color: '#f4f4f5', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h2">Clair sur sombre</JUTypography>
        <JUTypography variant="body">Fonctionne sur toute surface sombre sans nécessiter data-theme.</JUTypography>
        <JUTypography variant="body" muted>Le texte atténué réduit toujours la visibilité.</JUTypography>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h2">Sur dégradé</JUTypography>
        <JUTypography variant="lead">Texte d'accroche sur un fond dégradé vibrant.</JUTypography>
      </div>
      <div style={{ background: '#fef3c7', color: '#92400e', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h3">Tons chauds</JUTypography>
        <JUTypography variant="body">Texte brun sur jaune chaud — toute combinaison de couleurs fonctionne.</JUTypography>
      </div>
    </div>
  ),
};
