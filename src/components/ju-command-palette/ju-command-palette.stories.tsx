import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { JUCommandPalette, JUCommandPaletteItem } from './ju-command-palette';

/* ── Icon helpers ── */

const icon = (d: string, size = 16) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  file: icon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6'),
  search: icon('M21 21l-4.35-4.35 M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z'),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
  user: icon('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'),
  mail: icon('M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z M22 6l-10 7L2 6'),
  calendar: icon('M16 2v4 M8 2v4 M3 10h18 M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z'),
  lock: icon('M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z M7 11V7a5 5 0 0 1 10 0v4'),
  trash: icon('M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
  edit: icon('M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z'),
  copy: icon('M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'),
  home: icon('M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z M9 22V12h6v10'),
  star: icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z'),
  zap: icon('M13 2L3 14h9l-1 8 10-12h-9l1-8Z'),
  globe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  palette: icon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.52-4.48-9.99-10-9.99Z'),
  terminal: icon('M4 17l6-6-6-6 M12 19h8'),
  git: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
  ),
};

/* ── Mock items ── */

const appItems: JUCommandPaletteItem[] = [
  // Navigation
  { id: 'home', label: 'Go to Home', description: 'Main dashboard', icon: Icons.home, shortcut: '⌘H', section: 'Navigation', keywords: ['dashboard', 'main'] },
  { id: 'profile', label: 'Go to Profile', description: 'Your account settings', icon: Icons.user, shortcut: '⌘P', section: 'Navigation', keywords: ['account', 'settings'] },
  { id: 'mail', label: 'Open Inbox', description: '3 unread messages', icon: Icons.mail, shortcut: '⌘I', section: 'Navigation', keywords: ['messages', 'email'] },
  { id: 'cal', label: 'Open Calendar', description: 'Upcoming events', icon: Icons.calendar, section: 'Navigation', keywords: ['events', 'schedule'] },

  // Actions
  { id: 'new-file', label: 'New File', description: 'Create a blank document', icon: Icons.file, shortcut: '⌘N', section: 'Actions' },
  { id: 'edit', label: 'Edit Current Page', icon: Icons.edit, shortcut: '⌘E', section: 'Actions' },
  { id: 'duplicate', label: 'Duplicate', description: 'Clone this item', icon: Icons.copy, shortcut: '⌘D', section: 'Actions' },
  { id: 'delete', label: 'Delete', description: 'Move to trash', icon: Icons.trash, section: 'Actions', keywords: ['remove', 'trash'] },

  // Tools
  { id: 'search', label: 'Search Everything', description: 'Full-text search across workspace', icon: Icons.search, shortcut: '⌘⇧F', section: 'Tools' },
  { id: 'terminal', label: 'Open Terminal', description: 'Command line interface', icon: Icons.terminal, shortcut: '⌘T', section: 'Tools', keywords: ['cli', 'console', 'shell'] },
  { id: 'git', label: 'Git Status', description: 'View changes & branches', icon: Icons.git, section: 'Tools', keywords: ['version', 'branch'] },

  // Settings
  { id: 'settings', label: 'Preferences', description: 'Customize your workspace', icon: Icons.settings, shortcut: '⌘,', section: 'Settings' },
  { id: 'theme', label: 'Change Theme', description: 'Switch between light and dark', icon: Icons.palette, section: 'Settings', keywords: ['dark', 'light', 'appearance'] },
  { id: 'security', label: 'Security & Privacy', description: 'Manage passwords & 2FA', icon: Icons.lock, section: 'Settings', keywords: ['password', '2fa', 'auth'] },
  { id: 'language', label: 'Language & Region', description: 'Change display language', icon: Icons.globe, section: 'Settings', keywords: ['locale', 'i18n'] },
];

const recentItems: JUCommandPaletteItem[] = [
  { id: 'new-file', label: 'New File', icon: Icons.file, shortcut: '⌘N', section: 'Recent' },
  { id: 'settings', label: 'Preferences', icon: Icons.settings, shortcut: '⌘,', section: 'Recent' },
  { id: 'terminal', label: 'Open Terminal', icon: Icons.terminal, shortcut: '⌘T', section: 'Recent' },
];

/* ── Meta ── */

const meta: Meta<typeof JUCommandPalette> = {
  title: 'Organisms/JUCommandPalette',
  component: JUCommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof JUCommandPalette>;

/* ── Stories ── */

/** Full interactive demo — click the button or press ⌘K to open */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [lastAction, setLastAction] = useState<string | null>(null);

    return (
      <div style={{ padding: '4rem', textAlign: 'center', minHeight: '100vh', background: 'linear-gradient(145deg, #f8f9fb 0%, #eef0f4 100%)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 8px' }}>
            JUCommandPalette
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#888', margin: 0 }}>
            Press <kbd style={{ padding: '2px 6px', background: '#f0f0f0', borderRadius: 4, border: '1px solid #ddd', fontSize: '0.8rem' }}>⌘K</kbd> or click below
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '12px 28px',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#fff',
            background: '#1b82ff',
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(27, 130, 255, 0.3)',
          }}
        >
          Open Command Palette
        </button>

        {lastAction && (
          <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#666' }}>
            Last action: <strong>{lastAction}</strong>
          </div>
        )}

        <JUCommandPalette
          open={open}
          onOpenChange={setOpen}
          items={appItems}
          recentItems={recentItems}
          onSelect={(item) => setLastAction(item.label)}
        />
      </div>
    );
  },
};