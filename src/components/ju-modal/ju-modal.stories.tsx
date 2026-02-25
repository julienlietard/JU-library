import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUModal } from './ju-modal';

const meta: Meta<typeof JUModal> = {
  title: 'Feedback/JUModal',
  component: JUModal,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Ouvrir la modale</button>
        <JUModal open={open} onClose={() => setOpen(false)} title="Confirmation">
          <p>Êtes-vous sûr de vouloir publier cet article ?</p>
        </JUModal>
      </>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Avec footer</button>
        <JUModal
          open={open}
          onClose={() => setOpen(false)}
          title="Supprimer l'article"
          footer={
            <>
              <button onClick={() => setOpen(false)} style={{ padding: '8px 16px', border: '1px solid #e4e4e7', borderRadius: 10, background: 'white', cursor: 'pointer' }}>Annuler</button>
              <button onClick={() => setOpen(false)} style={{ padding: '8px 16px', border: 'none', borderRadius: 10, background: '#ff3b5c', color: 'white', cursor: 'pointer' }}>Supprimer</button>
            </>
          }
        >
          <p>Cette action est irréversible. L'article et tous ses commentaires seront définitivement supprimés.</p>
        </JUModal>
      </>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Grande modale</button>
        <JUModal open={open} onClose={() => setOpen(false)} title="Paramètres avancés" size="lg">
          <p>Contenu étendu avec de nombreux réglages possibles.</p>
        </JUModal>
      </>
    );
  },
};