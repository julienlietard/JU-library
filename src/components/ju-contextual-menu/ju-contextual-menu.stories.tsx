import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUContextualMenu } from './ju-contextual-menu';
import type { JUContextualMenuItem } from './ju-contextual-menu';
import {
  Upload, ExternalLink, Pencil, Copy, FolderInput, Archive,
  Share2, Link, Trash2, MoreHorizontal, Plus, FolderOpen,
  Settings, Bell, User, LogOut, Moon, CreditCard, HelpCircle,
  FileText, Image, Film, Music, Code, Globe, Lock, Eye
} from 'lucide-react';

const meta: Meta<typeof JUContextualMenu> = {
  title: 'Organisms/JUContextualMenu',
  component: JUContextualMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof JUContextualMenu>;

/* ============================================
   ITEMS DATA — matches the design reference
   ============================================ */
const designItems: JUContextualMenuItem[] = [
  { id: 'open', label: 'Open', icon: <Upload size={16} />, section: 'Interact' },
  { id: 'new-tab', label: 'Open in new tab', icon: <ExternalLink size={16} /> },
  { id: 'rename', label: 'Rename', icon: <Pencil size={16} />, section: 'Edit' },
  { id: 'duplicate', label: 'Duplicate', icon: <Copy size={16} /> },
  {
    id: 'move-to',
    label: 'Move to',
    icon: <FolderInput size={16} />,
    children: [
      { id: 'proj-1', label: 'Website redesign', icon: <FolderOpen size={15} /> },
      { id: 'proj-2', label: 'Mobile app', icon: <FolderOpen size={15} /> },
      { id: 'proj-3', label: 'Design system', icon: <FolderOpen size={15} /> },
      { id: 'proj-4', label: 'Brand refresh', icon: <FolderOpen size={15} /> },
      { id: 'new-proj', label: 'New project', icon: <Plus size={15} /> },
    ],
  },
  { id: 'archive', label: 'Archive', icon: <Archive size={16} /> },
  { id: 'share', label: 'Share', icon: <Share2 size={16} />, section: 'Social' },
  { id: 'copy-link', label: 'Copy link', icon: <Link size={16} /> },
  { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, section: 'Manage', danger: true },
];

/* ============================================
   DESIGN REFERENCE — matches the screenshots
   ============================================ */
export const DesignReference: Story = {
  name: '✦ Design Reference',
  render: () => (
    <div style={{ padding: '4rem' }}>
      <JUContextualMenu
        trigger={
          <button style={{
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid var(--ju-color-border, #e4e4e7)',
            background: 'var(--ju-color-surface, #fff)',
            color: 'var(--ju-color-text, #18181b)',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
            fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <MoreHorizontal size={16} />
            Actions
          </button>
        }
        items={designItems}
        searchable
        searchPlaceholder="Search actions..."
        subSearchPlaceholder="Search projects..."
      />
    </div>
  ),
};

/* ============================================
   BASIC — simple menu without search
   ============================================ */
export const Basic: Story = {
  name: 'Basic',
  render: () => (
    <div style={{ padding: '4rem' }}>
      <JUContextualMenu
        trigger={
          <button style={{
            padding: '6px', borderRadius: 8,
            border: '1px solid var(--ju-color-border, #e4e4e7)',
            background: 'var(--ju-color-surface, #fff)',
            color: 'var(--ju-color-text, #18181b)',
            cursor: 'pointer', display: 'flex',
          }}>
            <MoreHorizontal size={18} />
          </button>
        }
        items={[
          { id: 'edit', label: 'Edit', icon: <Pencil size={16} /> },
          { id: 'duplicate', label: 'Duplicate', icon: <Copy size={16} /> },
          { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, danger: true },
        ]}
      />
    </div>
  ),
};

/* ============================================
   WITH SHORTCUTS
   ============================================ */
export const WithShortcuts: Story = {
  name: 'With Shortcuts',
  render: () => (
    <div style={{ padding: '4rem' }}>
      <JUContextualMenu
        trigger={
          <button style={{
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid var(--ju-color-border, #e4e4e7)',
            background: 'var(--ju-color-surface, #fff)',
            color: 'var(--ju-color-text, #18181b)',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
            fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            File
          </button>
        }
        items={[
          { id: 'new', label: 'New File', icon: <FileText size={16} />, shortcut: '⌘N', section: 'File' },
          { id: 'open', label: 'Open', icon: <FolderOpen size={16} />, shortcut: '⌘O' },
          { id: 'save', label: 'Save', icon: <Upload size={16} />, shortcut: '⌘S' },
          { id: 'export', label: 'Export', icon: <ExternalLink size={16} />, shortcut: '⇧⌘E', section: 'Share' },
          { id: 'copy-link', label: 'Copy Link', icon: <Link size={16} />, shortcut: '⌘L' },
          { id: 'close', label: 'Close', icon: <Trash2 size={16} />, shortcut: '⌘W', section: 'Danger', danger: true },
        ]}
        searchable
        searchPlaceholder="Search commands..."
      />
    </div>
  ),
};

/* ============================================
   USER MENU
   ============================================ */
export const UserMenu: Story = {
  name: 'User Menu',
  render: () => (
    <div style={{ padding: '4rem' }}>
      <JUContextualMenu
        trigger={
          <button style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid var(--ju-color-border, #e4e4e7)',
            background: 'var(--ju-color-primary-soft, rgba(27, 130, 255, 0.10))',
            color: 'var(--ju-color-primary, #1b82ff)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={18} />
          </button>
        }
        items={[
          { id: 'profile', label: 'My Profile', icon: <User size={16} />, section: 'Account' },
          { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
          { id: 'billing', label: 'Billing', icon: <CreditCard size={16} /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />, section: 'Preferences' },
          { id: 'appearance', label: 'Dark Mode', icon: <Moon size={16} /> },
          { id: 'help', label: 'Help & Support', icon: <HelpCircle size={16} />, section: 'Support' },
          { id: 'logout', label: 'Log Out', icon: <LogOut size={16} />, danger: true },
        ]}
        placement="bottom-end"
      />
    </div>
  ),
};

/* ============================================
   WITH SUBMENUS
   ============================================ */
export const WithSubmenus: Story = {
  name: 'With Submenus',
  render: () => (
    <div style={{ padding: '4rem' }}>
      <JUContextualMenu
        trigger={
          <button style={{
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid var(--ju-color-border, #e4e4e7)',
            background: 'var(--ju-color-surface, #fff)',
            color: 'var(--ju-color-text, #18181b)',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
            fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Plus size={16} />
            Insert
          </button>
        }
        items={[
          {
            id: 'insert-media', label: 'Media', icon: <Image size={16} />, section: 'Content',
            children: [
              { id: 'photo', label: 'Photo', icon: <Image size={15} /> },
              { id: 'video', label: 'Video', icon: <Film size={15} /> },
              { id: 'audio', label: 'Audio', icon: <Music size={15} /> },
            ],
          },
          {
            id: 'insert-embed', label: 'Embed', icon: <Code size={16} />,
            children: [
              { id: 'website', label: 'Website', icon: <Globe size={15} /> },
              { id: 'code-block', label: 'Code Block', icon: <Code size={15} /> },
            ],
          },
          { id: 'insert-file', label: 'File', icon: <FileText size={16} /> },
          { id: 'divider-sep', label: 'Divider', icon: <MoreHorizontal size={16} />, section: 'Layout' },
        ]}
        searchable
      />
    </div>
  ),
};

/* ============================================
   DISABLED ITEMS
   ============================================ */
export const DisabledItems: Story = {
  name: 'Disabled Items',
  render: () => (
    <div style={{ padding: '4rem' }}>
      <JUContextualMenu
        trigger={
          <button style={{
            padding: '8px 16px', borderRadius: 10,
            border: '1px solid var(--ju-color-border, #e4e4e7)',
            background: 'var(--ju-color-surface, #fff)',
            color: 'var(--ju-color-text, #18181b)',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
            fontWeight: 500,
          }}>
            Permissions
          </button>
        }
        items={[
          { id: 'view', label: 'View', icon: <Eye size={16} />, section: 'Access' },
          { id: 'edit', label: 'Edit', icon: <Pencil size={16} />, disabled: true },
          { id: 'share', label: 'Share', icon: <Share2 size={16} />, disabled: true },
          { id: 'admin', label: 'Admin Settings', icon: <Lock size={16} />, section: 'Admin', disabled: true },
          { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, danger: true, disabled: true },
        ]}
      />
    </div>
  ),
};

/* ============================================
   PLACEMENTS
   ============================================ */
export const Placements: Story = {
  name: 'Placements',
  render: () => {
    const items: JUContextualMenuItem[] = [
      { id: '1', label: 'Option A', icon: <FileText size={16} /> },
      { id: '2', label: 'Option B', icon: <Image size={16} /> },
      { id: '3', label: 'Option C', icon: <Settings size={16} /> },
    ];
    const btnStyle: React.CSSProperties = {
      padding: '8px 14px', borderRadius: 10,
      border: '1px solid var(--ju-color-border, #e4e4e7)',
      background: 'var(--ju-color-surface, #fff)',
      color: 'var(--ju-color-text, #18181b)',
      cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem',
      fontWeight: 500,
    };
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: '8rem 4rem' }}>
        <JUContextualMenu trigger={<button style={btnStyle}>bottom-start</button>} items={items} placement="bottom-start" />
        <JUContextualMenu trigger={<button style={btnStyle}>bottom-end</button>} items={items} placement="bottom-end" />
        <JUContextualMenu trigger={<button style={btnStyle}>top-start</button>} items={items} placement="top-start" />
        <JUContextualMenu trigger={<button style={btnStyle}>top-end</button>} items={items} placement="top-end" />
      </div>
    );
  },
};

/* ============================================
   INTERACTIVE — with state feedback
   ============================================ */
export const Interactive: Story = {
  name: 'Interactive',
  render: () => {
    const InteractiveDemo = () => {
      const [lastAction, setLastAction] = useState('—');
      const items: JUContextualMenuItem[] = [
        { id: 'open', label: 'Open', icon: <Upload size={16} />, section: 'Interact', onClick: () => setLastAction('Opened file') },
        { id: 'rename', label: 'Rename', icon: <Pencil size={16} />, section: 'Edit', onClick: () => setLastAction('Renaming...') },
        { id: 'duplicate', label: 'Duplicate', icon: <Copy size={16} />, onClick: () => setLastAction('Duplicated!') },
        {
          id: 'move-to', label: 'Move to', icon: <FolderInput size={16} />,
          children: [
            { id: 'p1', label: 'Website redesign', icon: <FolderOpen size={15} />, onClick: () => setLastAction('Moved to "Website redesign"') },
            { id: 'p2', label: 'Mobile app', icon: <FolderOpen size={15} />, onClick: () => setLastAction('Moved to "Mobile app"') },
            { id: 'p3', label: 'Design system', icon: <FolderOpen size={15} />, onClick: () => setLastAction('Moved to "Design system"') },
          ],
        },
        { id: 'share', label: 'Share', icon: <Share2 size={16} />, section: 'Social', onClick: () => setLastAction('Share dialog opened') },
        { id: 'copy-link', label: 'Copy link', icon: <Link size={16} />, onClick: () => setLastAction('Link copied!') },
        { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, section: 'Manage', danger: true, onClick: () => setLastAction('Deleted!') },
      ];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '4rem' }}>
          <JUContextualMenu
            trigger={
              <button style={{
                padding: '8px 16px', borderRadius: 10,
                border: '1px solid var(--ju-color-border, #e4e4e7)',
                background: 'var(--ju-color-surface, #fff)',
                color: 'var(--ju-color-text, #18181b)',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem',
                fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <MoreHorizontal size={16} />
                Actions
              </button>
            }
            items={items}
            searchable
          />
          <div style={{
            padding: '8px 16px', borderRadius: 10,
            background: 'var(--ju-color-surface-muted, #f5f5f7)',
            fontSize: '0.8rem', color: 'var(--ju-color-text-muted, #71717a)',
          }}>
            Last action: <strong style={{ color: 'var(--ju-color-text, #18181b)' }}>{lastAction}</strong>
          </div>
        </div>
      );
    };
    return <InteractiveDemo />;
  },
};
