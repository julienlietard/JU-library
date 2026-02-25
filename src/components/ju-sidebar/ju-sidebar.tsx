import React, { useState, useEffect, useCallback } from 'react';
import styles from './ju-sidebar.module.css';

export interface JUSidebarSection {
  title?: string;
  items: { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode; active?: boolean }[];
}

export interface JUSidebarProps {
  /** Sidebar sections */
  sections: JUSidebarSection[];
  /** Controlled open state */
  open?: boolean;
  /** Default open (uncontrolled) */
  defaultOpen?: boolean;
  /** On open/close */
  onOpenChange?: (open: boolean) => void;
  /** Position */
  position?: 'left' | 'right';
  /** Width in px */
  width?: number;
  /** Overlay mode (modal-like on mobile) */
  overlay?: boolean;
  /** Header content */
  header?: React.ReactNode;
  className?: string;
}

export const JUSidebar: React.FC<JUSidebarProps> = ({
  sections,
  open,
  defaultOpen = true,
  onOpenChange,
  position = 'left',
  width = 260,
  overlay = false,
  header,
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const controlled = open !== undefined;
  const isOpen = controlled ? open : internalOpen;

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isOpen, controlled, onOpenChange]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen && overlay) toggle(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, overlay, toggle]);

  const cls = [
    styles['ju-sb'],
    styles[`ju-sb--${position}`],
    isOpen ? styles['ju-sb--open'] : '',
    overlay ? styles['ju-sb--overlay'] : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {overlay && isOpen && <div className={styles['ju-sb__backdrop']} onClick={toggle} />}
      <aside className={cls} style={{ width: isOpen ? width : 0 }} aria-label="Sidebar">
        <div className={styles['ju-sb__inner']} style={{ width }}>
          {/* Header */}
          <div className={styles['ju-sb__header']}>
            {header}
            <button
              className={styles['ju-sb__toggle']}
              onClick={toggle}
              aria-label={isOpen ? 'Fermer le panneau' : 'Ouvrir le panneau'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {position === 'left'
                  ? <polyline points="15 18 9 12 15 6" />
                  : <polyline points="9 18 15 12 9 6" />}
              </svg>
            </button>
          </div>

          {/* Sections */}
          <nav className={styles['ju-sb__nav']}>
            {sections.map((s, si) => (
              <div key={si} className={styles['ju-sb__section']}>
                {s.title && <h3 className={styles['ju-sb__section-title']}>{s.title}</h3>}
                <ul className={styles['ju-sb__list']}>
                  {s.items.map((item, ii) => (
                    <li key={ii}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className={`${styles['ju-sb__link']} ${item.active ? styles['ju-sb__link--active'] : ''}`}
                          onClick={item.onClick}
                        >
                          {item.icon && <span className={styles['ju-sb__icon']}>{item.icon}</span>}
                          {item.label}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={`${styles['ju-sb__link']} ${item.active ? styles['ju-sb__link--active'] : ''}`}
                          onClick={item.onClick}
                        >
                          {item.icon && <span className={styles['ju-sb__icon']}>{item.icon}</span>}
                          {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};