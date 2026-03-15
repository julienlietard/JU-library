import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUNotificationCenter, JUNotificationItem } from './ju-notification-center';

/* ── Sample data helpers ── */

const now = Date.now();
const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

function makeSampleNotifications(): JUNotificationItem[] {
  return [
    { id: '1', type: 'success', title: 'Déploiement réussi', message: 'La version 2.4.1 a été déployée en production avec succès.', timestamp: new Date(now - 3 * MINUTE), read: false },
    { id: '2', type: 'info', title: 'Nouveau commentaire', message: 'Alice a commenté sur la PR #142 : "Super implémentation !"', timestamp: new Date(now - 25 * MINUTE), read: false },
    { id: '3', type: 'warning', title: 'Espace disque faible', message: 'Le serveur staging n\'a plus que 12% d\'espace disponible.', timestamp: new Date(now - 2 * HOUR), read: true },
    { id: '4', type: 'error', title: 'Build échoué', message: 'Le pipeline CI a échoué sur la branche feature/auth à l\'étape des tests.', timestamp: new Date(now - 5 * HOUR), read: false },
    { id: '5', type: 'info', title: 'Mise à jour disponible', message: 'Une nouvelle version de Node.js (v22.1.0) est disponible.', timestamp: new Date(now - DAY - 2 * HOUR), read: true },
    { id: '6', type: 'success', title: 'Backup terminé', message: 'La sauvegarde quotidienne de la base de données est terminée.', timestamp: new Date(now - DAY - 5 * HOUR), read: true },
    { id: '7', type: 'warning', title: 'Certificat SSL', message: 'Le certificat SSL de api.example.com expire dans 7 jours.', timestamp: new Date(now - 3 * DAY), read: false },
    { id: '8', type: 'error', title: 'Erreur API', message: 'Le endpoint /api/payments retourne des erreurs 500 intermittentes.', timestamp: new Date(now - 5 * DAY), read: true },
  ];
}

function makeManyNotifications(count: number): JUNotificationItem[] {
  const types: JUNotificationItem['type'][] = ['info', 'success', 'warning', 'error'];
  const titles = ['Nouveau message', 'Action requise', 'Mise à jour', 'Alerte système'];
  const messages = [
    'Un nouveau rapport a été généré et est prêt à être consulté.',
    'Veuillez vérifier les permissions du projet avant la release.',
    'Les dépendances ont été mises à jour automatiquement.',
    'Le monitoring a détecté un pic d\'utilisation mémoire.',
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    type: types[i % 4],
    title: titles[i % 4],
    message: messages[i % 4],
    timestamp: new Date(now - i * HOUR * 2),
    read: i % 3 !== 0,
  }));
}

/* ── Meta ── */

const meta: Meta<typeof JUNotificationCenter> = {
  title: 'Organisms/JUNotificationCenter',
  component: JUNotificationCenter,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['bottom-end', 'bottom-start'] },
    maxVisible: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUNotificationCenter>;

/* ══════════════════════════ STORIES ══════════════════════════ */

export const Default: Story = {
  args: {
    notifications: makeSampleNotifications(),
    onRead: (id) => console.log('Read:', id),
    onDismiss: (id) => console.log('Dismiss:', id),
    onMarkAllRead: () => console.log('Mark all read'),
  },
};

export const WithUnread: Story = {
  args: {
    notifications: makeSampleNotifications().map((n) => ({ ...n, read: false })),
    onRead: (id) => console.log('Read:', id),
    onDismiss: (id) => console.log('Dismiss:', id),
    onMarkAllRead: () => console.log('Mark all read'),
  },
};

export const Empty: Story = {
  args: {
    notifications: [],
  },
};

export const ManyNotifications: Story = {
  args: {
    notifications: makeManyNotifications(30),
    onRead: (id) => console.log('Read:', id),
    onDismiss: (id) => console.log('Dismiss:', id),
    onMarkAllRead: () => console.log('Mark all read'),
    maxVisible: 20,
  },
};

export const AllTypes: Story = {
  render: () => {
    const notifs: JUNotificationItem[] = [
      { id: '1', type: 'info', title: 'Information', message: 'Ceci est une notification d\'information standard.', timestamp: new Date(now - 5 * MINUTE), read: false },
      { id: '2', type: 'success', title: 'Succès', message: 'L\'opération a été réalisée avec succès.', timestamp: new Date(now - 10 * MINUTE), read: false },
      { id: '3', type: 'warning', title: 'Avertissement', message: 'Attention, une action de votre part est nécessaire.', timestamp: new Date(now - 20 * MINUTE), read: false },
      { id: '4', type: 'error', title: 'Erreur', message: 'Une erreur critique est survenue.', timestamp: new Date(now - 30 * MINUTE), read: false },
    ];
    return (
      <JUNotificationCenter
        notifications={notifs}
        onRead={(id) => console.log('Read:', id)}
        onDismiss={(id) => console.log('Dismiss:', id)}
        onMarkAllRead={() => console.log('Mark all read')}
      />
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [notifs, setNotifs] = useState<JUNotificationItem[]>(makeSampleNotifications());
    let counter = 100;

    const addNotif = () => {
      const types: JUNotificationItem['type'][] = ['info', 'success', 'warning', 'error'];
      const type = types[Math.floor(Math.random() * 4)];
      const titles: Record<string, string> = {
        info: 'Nouvelle info',
        success: 'Opération réussie',
        warning: 'Attention requise',
        error: 'Erreur détectée',
      };
      setNotifs((prev) => [
        {
          id: String(++counter),
          type,
          title: titles[type],
          message: `Notification ajoutée à ${new Date().toLocaleTimeString('fr-FR')}`,
          timestamp: new Date(),
          read: false,
        },
        ...prev,
      ]);
    };

    const handleRead = (id: string) => {
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const handleDismiss = (id: string) => {
      setNotifs((prev) => prev.filter((n) => n.id !== id));
    };

    const handleMarkAllRead = () => {
      setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={addNotif}
          style={{
            padding: '8px 16px',
            borderRadius: 10,
            border: 'none',
            background: '#1b82ff',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'var(--ju-font-family)',
            fontSize: '0.8125rem',
            fontWeight: 600,
          }}
        >
          Ajouter une notification
        </button>
        <JUNotificationCenter
          notifications={notifs}
          onRead={handleRead}
          onDismiss={handleDismiss}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    return (
      <div data-theme="dark" style={{ padding: 40, background: '#111', borderRadius: 20, minHeight: 100, display: 'flex', justifyContent: 'center' }}>
        <JUNotificationCenter
          notifications={makeSampleNotifications()}
          onRead={(id) => console.log('Read:', id)}
          onDismiss={(id) => console.log('Dismiss:', id)}
          onMarkAllRead={() => console.log('Mark all read')}
        />
      </div>
    );
  },
};
