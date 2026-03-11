import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUToast, JUToastContainer, JUToastData } from './ju-toast';

const meta: Meta<typeof JUToast> = {
  title: 'Feedback/JUToast',
  component: JUToast,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUToast>;

export const Info: Story = { args: { toast: { id: '1', message: 'Maquette enregistrée en brouillon.', variant: 'info' }, onDismiss: () => {} } };
export const Success: Story = { args: { toast: { id: '2', message: 'Composant publié avec succès dans le design system !', variant: 'success' }, onDismiss: () => {} } };
export const Warning: Story = { args: { toast: { id: '3', message: 'Attention : le token de couleur est manquant.', variant: 'warning' }, onDismiss: () => {} } };
export const Error: Story = { args: { toast: { id: '4', message: 'Erreur lors de l\u2019export de la palette.', variant: 'error' }, onDismiss: () => {} } };

export const Interactive: Story = {
  render: () => {
    const [toasts, setToasts] = useState<JUToastData[]>([]);
    let counter = 0;
    const variants = ['info', 'success', 'warning', 'error'] as const;
    const messages = ['Grille sauvegardée', 'Typographie mise à jour !', 'Token de spacing manquant', 'Erreur d\u2019import Figma'];
    const addToast = () => {
      const v = variants[counter % 4];
      setToasts((prev) => [...prev, { id: String(++counter), message: messages[counter % 4], variant: v }]);
    };
    return (
      <>
        <button onClick={addToast} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#1b82ff', color: 'white', cursor: 'pointer' }}>
          Ajouter une notification
        </button>
        <JUToastContainer toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
      </>
    );
  },
};
