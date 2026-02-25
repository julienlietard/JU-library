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

export const Info: Story = { args: { toast: { id: '1', message: 'Article enregistré en brouillon.', variant: 'info' }, onDismiss: () => {} } };
export const Success: Story = { args: { toast: { id: '2', message: 'Article publié avec succès !', variant: 'success' }, onDismiss: () => {} } };
export const Warning: Story = { args: { toast: { id: '3', message: 'Attention : ce champ est requis.', variant: 'warning' }, onDismiss: () => {} } };
export const Error: Story = { args: { toast: { id: '4', message: 'Erreur lors de la sauvegarde.', variant: 'error' }, onDismiss: () => {} } };

export const Interactive: Story = {
  render: () => {
    const [toasts, setToasts] = useState<JUToastData[]>([]);
    let counter = 0;
    const variants = ['info', 'success', 'warning', 'error'] as const;
    const messages = ['Brouillon sauvegardé', 'Article publié !', 'Champ manquant', 'Erreur serveur'];
    const addToast = () => {
      const v = variants[counter % 4];
      setToasts((prev) => [...prev, { id: String(++counter), message: messages[counter % 4], variant: v }]);
    };
    return (
      <>
        <button onClick={addToast} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: '#1b82ff', color: 'white', cursor: 'pointer' }}>
          Ajouter un toast
        </button>
        <JUToastContainer toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
      </>
    );
  },
};