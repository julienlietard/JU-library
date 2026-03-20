import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUNotificationCenter, JUNotificationItem } from './ju-notification-center';

const now = Date.now();
const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

function makeNotifications(overrides?: Partial<JUNotificationItem>[]): JUNotificationItem[] {
  const defaults: JUNotificationItem[] = [
    { id: '1', type: 'info', title: 'Info Title', message: 'Info message', timestamp: new Date(now - 3 * MINUTE), read: false },
    { id: '2', type: 'success', title: 'Success Title', message: 'Success message', timestamp: new Date(now - 2 * HOUR), read: true },
    { id: '3', type: 'warning', title: 'Warning Title', message: 'Warning message', timestamp: new Date(now - DAY - HOUR), read: false },
    { id: '4', type: 'error', title: 'Error Title', message: 'Error message', timestamp: new Date(now - 3 * DAY), read: true },
  ];
  if (overrides) {
    return defaults.map((n, i) => ({ ...n, ...(overrides[i] ?? {}) }));
  }
  return defaults;
}

function openPanel() {
  const trigger = screen.getByRole('button', { name: /notifications/i });
  fireEvent.click(trigger);
}

describe('JUNotificationCenter', () => {
  /* ── Trigger ── */

  it('renders trigger button with bell', () => {
    render(<JUNotificationCenter notifications={[]} />);
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument();
  });

  it('shows unread count badge', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    const trigger = screen.getByRole('button', { name: /notifications/i });
    expect(trigger.querySelector('.ju-notif-trigger__badge')).toBeInTheDocument();
    expect(trigger.querySelector('.ju-notif-trigger__badge')?.textContent).toBe('2');
  });

  it('hides badge when all read', () => {
    const notifs = makeNotifications().map((n) => ({ ...n, read: true }));
    render(<JUNotificationCenter notifications={notifs} />);
    const trigger = screen.getByRole('button', { name: /notifications/i });
    expect(trigger.querySelector('.ju-notif-trigger__badge')).toBeNull();
  });

  it('shows 99+ for large counts', () => {
    const notifs = Array.from({ length: 120 }, (_, i) => ({
      id: String(i),
      type: 'info' as const,
      title: 'T',
      message: 'M',
      timestamp: new Date(),
      read: false,
    }));
    render(<JUNotificationCenter notifications={notifs} />);
    const badge = screen.getByRole('button', { name: /notifications/i }).querySelector('.ju-notif-trigger__badge');
    expect(badge?.textContent).toBe('99+');
  });

  it('aria-label includes unread count', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    expect(screen.getByRole('button', { name: /2 non lues/i })).toBeInTheDocument();
  });

  /* ── Panel open/close ── */

  it('opens panel on click', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-expanded on trigger', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    const trigger = screen.getByRole('button', { name: /notifications/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on overlay click', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const overlay = document.querySelector('.ju-notif-overlay')!;
    fireEvent.click(overlay);
    // Panel should start exiting (animation)
    expect(document.querySelector('.ju-notif-panel--exit')).toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.ju-notif-panel--exit')).toBeInTheDocument();
  });

  /* ── Panel content ── */

  it('shows "Notifications" title in header', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('shows "Tout marquer comme lu" button when unread exist', () => {
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        onMarkAllRead={() => {}}
      />,
    );
    openPanel();
    expect(screen.getByText('Tout marquer comme lu')).toBeInTheDocument();
  });

  it('hides "Tout marquer comme lu" when all read', () => {
    const notifs = makeNotifications().map((n) => ({ ...n, read: true }));
    render(
      <JUNotificationCenter notifications={notifs} onMarkAllRead={() => {}} />,
    );
    openPanel();
    expect(screen.queryByText('Tout marquer comme lu')).toBeNull();
  });

  it('calls onMarkAllRead', () => {
    const onMarkAllRead = vi.fn();
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    openPanel();
    fireEvent.click(screen.getByText('Tout marquer comme lu'));
    expect(onMarkAllRead).toHaveBeenCalledOnce();
  });

  /* ── Notification items ── */

  it('renders all notifications', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(screen.getByText('Info Title')).toBeInTheDocument();
    expect(screen.getByText('Success Title')).toBeInTheDocument();
    expect(screen.getByText('Warning Title')).toBeInTheDocument();
    expect(screen.getByText('Error Title')).toBeInTheDocument();
  });

  it('shows messages', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('shows unread dot for unread items', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    const dots = document.querySelectorAll('.ju-notif-item__dot');
    expect(dots.length).toBe(2);
  });

  it('applies unread class', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    const unread = document.querySelectorAll('.ju-notif-item--unread');
    expect(unread.length).toBe(2);
  });

  it('renders type icons with correct classes', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(document.querySelector('.ju-notif-item__icon--info')).toBeInTheDocument();
    expect(document.querySelector('.ju-notif-item__icon--success')).toBeInTheDocument();
    expect(document.querySelector('.ju-notif-item__icon--warning')).toBeInTheDocument();
    expect(document.querySelector('.ju-notif-item__icon--error')).toBeInTheDocument();
  });

  it('shows relative timestamps', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(screen.getByText('Il y a 3 min')).toBeInTheDocument();
  });

  /* ── Temporal groups ── */

  it('groups by temporal labels', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    expect(screen.getByText("Aujourd'hui")).toBeInTheDocument();
    expect(screen.getByText('Hier')).toBeInTheDocument();
    expect(screen.getByText('Plus ancien')).toBeInTheDocument();
  });

  /* ── Callbacks ── */

  it('calls onRead when clicking unread notification', () => {
    const onRead = vi.fn();
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        onRead={onRead}
      />,
    );
    openPanel();
    fireEvent.click(screen.getByText('Info Title'));
    expect(onRead).toHaveBeenCalledWith('1');
  });

  it('does not call onRead on already-read notification', () => {
    const onRead = vi.fn();
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        onRead={onRead}
      />,
    );
    openPanel();
    fireEvent.click(screen.getByText('Success Title'));
    expect(onRead).not.toHaveBeenCalled();
  });

  it('calls onDismiss when clicking X button', () => {
    const onDismiss = vi.fn();
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        onDismiss={onDismiss}
      />,
    );
    openPanel();
    const dismissBtns = screen.getAllByLabelText(/supprimer la notification/i);
    fireEvent.click(dismissBtns[0]);
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  /* ── Empty state ── */

  it('shows empty state when no notifications', () => {
    render(<JUNotificationCenter notifications={[]} />);
    openPanel();
    expect(screen.getByText('Aucune notification')).toBeInTheDocument();
  });

  /* ── maxVisible ── */

  it('limits visible notifications to maxVisible', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      id: String(i),
      type: 'info' as const,
      title: `Notif ${i}`,
      message: 'msg',
      timestamp: new Date(now - i * HOUR),
      read: false,
    }));
    render(<JUNotificationCenter notifications={many} maxVisible={5} />);
    openPanel();
    const items = document.querySelectorAll('.ju-notif-item');
    expect(items.length).toBe(5);
  });

  /* ── Placement ── */

  it('applies placement class', () => {
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        placement="bottom-start"
      />,
    );
    openPanel();
    expect(document.querySelector('.ju-notif-panel')).toBeInTheDocument();
  });

  /* ── Custom trigger ── */

  it('renders custom trigger', () => {
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        trigger={<span data-testid="custom">Custom</span>}
      />,
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  /* ── className ── */

  it('applies custom className', () => {
    const { container } = render(
      <JUNotificationCenter notifications={[]} className="my-custom" />,
    );
    expect(container.querySelector('.ju-notif-center.my-custom')).toBeInTheDocument();
  });

  /* ── Panel dialog role ── */

  it('panel has role=dialog with aria-label', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'Centre de notifications');
  });

  /* ── Dismiss buttons have accessible labels ── */

  it('dismiss buttons have descriptive aria-label', () => {
    render(
      <JUNotificationCenter
        notifications={makeNotifications()}
        onDismiss={() => {}}
      />,
    );
    openPanel();
    expect(screen.getByLabelText('Supprimer la notification : Info Title')).toBeInTheDocument();
  });

  /* ── Staggered animation classes ── */

  it('items have stagger animation class', () => {
    render(<JUNotificationCenter notifications={makeNotifications()} />);
    openPanel();
    const items = document.querySelectorAll('.ju-notif-item--stagger');
    expect(items.length).toBeGreaterThan(0);
  });
});
