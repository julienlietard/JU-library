import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './ju-notification-center.css';

/* ── Types ── */

export type JUNotificationType = 'info' | 'success' | 'warning' | 'error';

export type JUNotificationPlacement = 'bottom-end' | 'bottom-start';

export interface JUNotificationItem {
  id: string;
  type: JUNotificationType;
  title: string;
  message: string;
  timestamp: Date | string | number;
  read: boolean;
}

export interface JUNotificationCenterProps {
  /** List of notifications (controlled) */
  notifications: JUNotificationItem[];
  /** Called when a notification is marked as read */
  onRead?: (id: string) => void;
  /** Called when a notification is dismissed */
  onDismiss?: (id: string) => void;
  /** Called when "Mark all read" is clicked */
  onMarkAllRead?: () => void;
  /** Maximum visible notifications before scroll */
  maxVisible?: number;
  /** Override the trigger button */
  trigger?: React.ReactNode;
  /** Panel placement relative to trigger */
  placement?: JUNotificationPlacement;
  /** Additional CSS class */
  className?: string;
}

/* ── Icons ── */

const BellIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const TYPE_ICONS: Record<JUNotificationType, React.ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

const CheckAllIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

const EmptyBellIcon: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

/* ── Helpers ── */

function toDate(ts: Date | string | number): Date {
  return ts instanceof Date ? ts : new Date(ts);
}

function formatRelativeTime(ts: Date | string | number): string {
  const now = Date.now();
  const diff = now - toDate(ts).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return toDate(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

type TemporalGroup = 'today' | 'yesterday' | 'older';

function getTemporalGroup(ts: Date | string | number): TemporalGroup {
  const now = new Date();
  const date = toDate(ts);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);

  if (date >= todayStart) return 'today';
  if (date >= yesterdayStart) return 'yesterday';
  return 'older';
}

const GROUP_LABELS: Record<TemporalGroup, string> = {
  today: "Aujourd'hui",
  yesterday: 'Hier',
  older: 'Plus ancien',
};

const GROUP_ORDER: TemporalGroup[] = ['today', 'yesterday', 'older'];

/* ── Swipe-to-dismiss item wrapper ── */

interface SwipeWrapperProps {
  children: React.ReactNode;
  onDismiss: () => void;
}

const SwipeWrapper: React.FC<SwipeWrapperProps> = ({ children, onDismiss }) => {
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragging = useRef(false);
  const [swiping, setSwiping] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const getInner = useCallback(() => ref.current?.children[1] as HTMLElement | undefined, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    /* Skip swipe when clicking the dismiss button */
    if ((e.target as HTMLElement).closest('.ju-notif-item__dismiss')) return;
    startX.current = e.clientX;
    currentX.current = 0;
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    if (dx >= 0) {
      currentX.current = 0;
      const inner = getInner();
      if (inner) { inner.style.transition = 'none'; inner.style.transform = ''; }
      setSwiping(false);
      return;
    }
    currentX.current = dx;
    if (Math.abs(dx) > 10) {
      setSwiping(true);
      const inner = getInner();
      if (inner) { inner.style.transition = 'none'; inner.style.transform = `translateX(${dx}px)`; }
    }
  }, [getInner]);

  const handlePointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = currentX.current;
    startX.current = 0;
    currentX.current = 0;

    if (dx < -100) {
      /* Slide fully off-screen, then collapse */
      const inner = getInner();
      if (inner) { inner.style.transition = 'transform 0.2s ease'; inner.style.transform = 'translateX(-100%)'; }
      setDismissed(true);
      setTimeout(onDismiss, 300);
    } else {
      /* Snap back with transition */
      const inner = getInner();
      if (inner) { inner.style.transition = 'transform 0.2s ease'; inner.style.transform = ''; }
      setSwiping(false);
    }
  }, [onDismiss, getInner]);

  const cls = [
    'ju-notif-item__swipe-wrapper',
    swiping ? 'ju-notif-item__swipe-wrapper--swiping' : '',
    dismissed ? 'ju-notif-item__swipe-wrapper--dismissed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={cls}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="ju-notif-item__swipe-bg" aria-hidden="true">Supprimer</div>
      {children}
    </div>
  );
};

/* ── NotificationItem ── */

interface NotifItemProps {
  notification: JUNotificationItem;
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  staggerIndex: number;
}

const NotifItem: React.FC<NotifItemProps> = ({ notification, onRead, onDismiss, staggerIndex }) => {
  const { id, type, title, message, timestamp, read } = notification;

  const handleClick = () => {
    if (!read) onRead?.(id);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss?.(id);
  };

  const cls = [
    'ju-notif-item',
    !read ? 'ju-notif-item--unread' : '',
    'ju-notif-item--stagger',
  ].filter(Boolean).join(' ');

  const content = (
    <div
      className={cls}
      style={{ animationDelay: `${staggerIndex * 40}ms` }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {!read && <span className="ju-notif-item__dot" aria-hidden="true" />}
      <span className={`ju-notif-item__icon ju-notif-item__icon--${type}`} aria-hidden="true">
        {TYPE_ICONS[type]}
      </span>
      <div className="ju-notif-item__content">
        <p className="ju-notif-item__title">{title}</p>
        <p className="ju-notif-item__message">{message}</p>
        <span className="ju-notif-item__time">{formatRelativeTime(timestamp)}</span>
      </div>
      {onDismiss && (
        <button
          className="ju-notif-item__dismiss"
          onClick={handleDismiss}
          aria-label={`Supprimer la notification : ${title}`}
          tabIndex={-1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="3" x2="9" y2="9" />
            <line x1="9" y1="3" x2="3" y2="9" />
          </svg>
        </button>
      )}
    </div>
  );

  if (onDismiss) {
    return <SwipeWrapper onDismiss={() => onDismiss(id)}>{content}</SwipeWrapper>;
  }

  return content;
};

/* ── Main component ── */

export const JUNotificationCenter: React.FC<JUNotificationCenterProps> = ({
  notifications,
  onRead,
  onDismiss,
  onMarkAllRead,
  maxVisible = 50,
  trigger,
  placement = 'bottom-end',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const prevCountRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  /* Wiggle when unread count increases */
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setWiggle(true);
      const timer = setTimeout(() => setWiggle(false), 600);
      prevCountRef.current = unreadCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  /* Group + limit */
  const grouped = useMemo(() => {
    const sorted = [...notifications]
      .sort((a, b) => toDate(b.timestamp).getTime() - toDate(a.timestamp).getTime())
      .slice(0, maxVisible);

    const groups: Record<TemporalGroup, JUNotificationItem[]> = {
      today: [],
      yesterday: [],
      older: [],
    };

    for (const n of sorted) {
      groups[getTemporalGroup(n.timestamp)].push(n);
    }

    return groups;
  }, [notifications, maxVisible]);

  /* Close panel */
  const closePanel = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setOpen(false);
      setExiting(false);
    }, 200);
  }, []);

  /* Toggle */
  const togglePanel = useCallback(() => {
    if (open) {
      closePanel();
    } else {
      setOpen(true);
    }
  }, [open, closePanel]);

  /* Keyboard: Escape to close */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, closePanel]);

  /* Focus first item when panel opens */
  useEffect(() => {
    if (open && !exiting && panelRef.current) {
      const first = panelRef.current.querySelector<HTMLElement>('[role="button"]');
      first?.focus();
    }
  }, [open, exiting]);

  /* Compute panel position with viewport clamping */
  const getPanelStyle = useCallback((): React.CSSProperties => {
    if (!triggerRef.current) return { position: 'fixed' };
    const rect = triggerRef.current.getBoundingClientRect();
    const panelWidth = 380;
    const gap = 8;
    const margin = 12;
    const top = Math.min(rect.bottom + gap, window.innerHeight - 440);

    if (placement === 'bottom-end') {
      const right = window.innerWidth - rect.right;
      // Clamp: ensure panel doesn't overflow left edge
      const adjustedRight = Math.max(margin, Math.min(right, window.innerWidth - panelWidth - margin));
      return { position: 'fixed', top, right: adjustedRight };
    }
    const left = rect.left;
    // Clamp: ensure panel doesn't overflow right edge
    const adjustedLeft = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin));
    return { position: 'fixed', top, left: adjustedLeft };
  }, [placement]);

  /* Stagger index counter */
  let staggerIdx = 0;

  const triggerCls = [
    'ju-notif-trigger',
    wiggle ? 'ju-notif-trigger--wiggle' : '',
  ].filter(Boolean).join(' ');

  const panelCls = [
    'ju-notif-panel',
    `ju-notif-panel--${placement}`,
    exiting ? 'ju-notif-panel--exit' : 'ju-notif-panel--enter',
  ].join(' ');

  const rootCls = ['ju-notif-center', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={rootCls}>
      {/* Trigger */}
      {trigger ? (
        <div onClick={togglePanel}>{trigger}</div>
      ) : (
        <button
          ref={triggerRef}
          className={triggerCls}
          onClick={togglePanel}
          aria-label={
            unreadCount > 0
              ? `Notifications — ${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Notifications'
          }
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <span className="ju-notif-trigger__icon">
            <BellIcon />
          </span>
          {unreadCount > 0 && (
            <span className="ju-notif-trigger__badge" aria-hidden="true">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Panel — rendered inline (no portal) to inherit theme context */}
      {open && (
        <>
          <div className="ju-notif-overlay" onClick={closePanel} aria-hidden="true" />
          <div
            ref={panelRef}
            className={panelCls}
            role="dialog"
            aria-label="Centre de notifications"
            style={getPanelStyle()}
          >
            {/* Header */}
            <div className="ju-notif-panel__header">
              <h2 className="ju-notif-panel__title">Notifications</h2>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  className="ju-notif-panel__mark-all"
                  onClick={onMarkAllRead}
                >
                  <CheckAllIcon />
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* List */}
            <div className="ju-notif-panel__list">
              {notifications.length === 0 ? (
                <div className="ju-notif-empty">
                  <span className="ju-notif-empty__icon" aria-hidden="true">
                    <EmptyBellIcon />
                  </span>
                  <p className="ju-notif-empty__text">Aucune notification</p>
                </div>
              ) : (
                GROUP_ORDER.map((group) => {
                  const items = grouped[group];
                  if (items.length === 0) return null;
                  return (
                    <div key={group}>
                      <p className="ju-notif-group__label">{GROUP_LABELS[group]}</p>
                      {items.map((n) => (
                        <NotifItem
                          key={n.id}
                          notification={n}
                          onRead={onRead}
                          onDismiss={onDismiss}
                          staggerIndex={staggerIdx++}
                        />
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

JUNotificationCenter.displayName = 'JUNotificationCenter';
