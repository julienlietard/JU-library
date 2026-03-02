import React, { useState, useEffect, useCallback } from 'react';
import './ju-sidebar.css';

export interface JUSidebarSection {
  title?: string;
  items: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    active?: boolean;
  }[];
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
  const isOpen = controlled ? open! : internalOpen;

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isOpen, controlled, onOpenChange]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && overlay) toggle();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, overlay, toggle]);

  const cls = [
    'ju-sb',
    `ju-sb--${position}`,
    isOpen ? 'ju-sb--open' : 'ju-sb--closed',
    overlay ? 'ju-sb--overlay' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  // Chevron direction: always points "inward" to indicate close, "outward" to indicate open
  // Left sidebar open → chevron points left (←) to close
  // Left sidebar closed → chevron points right (→) to open
  const chevron =
    position === 'left' ? (
      isOpen ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )
    ) : isOpen ? (
      <polyline points="9 18 15 12 9 6" />
    ) : (
      <polyline points="15 18 9 12 15 6" />
    );

  return (
    <>
      {overlay && isOpen && (
        <div className={'ju-sb__backdrop'} onClick={toggle} />
      )}

      {/*
       * Wrapper holds both the collapsible panel and the always-visible toggle tab.
       * This way the toggle is never clipped when the sidebar is closed.
       */}
      <div
        className={[
          'ju-sb__wrapper',
          `ju-sb__wrapper--${position}`,
          overlay ? 'ju-sb__wrapper--overlay' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* ── Collapsible panel ── */}
        <aside
          className={cls}
          style={{ width: isOpen ? width : 0 }}
          aria-label="Sidebar"
          aria-hidden={!isOpen}
        >
          <div className={'ju-sb__inner'} style={{ width }}>
            {/* Header */}
            {header && (
              <div className={'ju-sb__header'}>
                {header}
              </div>
            )}

            {/* Sections */}
            <nav className={'ju-sb__nav'}>
              {sections.map((s, si) => (
                <div key={si} className={'ju-sb__section'}>
                  {s.title && (
                    <h3 className={'ju-sb__section-title'}>{s.title}</h3>
                  )}
                  <ul className={'ju-sb__list'}>
                    {s.items.map((item, ii) => (
                      <li key={ii}>
                        {item.href ? (
                          <a
                            href={item.href}
                            className={`${'ju-sb__link'} ${
                              item.active ? 'ju-sb__link--active' : ''
                            }`}
                            onClick={item.onClick}
                          >
                            {item.icon && (
                              <span className={'ju-sb__icon'}>{item.icon}</span>
                            )}
                            {item.label}
                          </a>
                        ) : (
                          <button
                            type="button"
                            className={`${'ju-sb__link'} ${
                              item.active ? 'ju-sb__link--active' : ''
                            }`}
                            onClick={item.onClick}
                          >
                            {item.icon && (
                              <span className={'ju-sb__icon'}>{item.icon}</span>
                            )}
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

        {/* ── Toggle tab — always visible, hugs the edge of the panel ── */}
        <button
          className={[
            'ju-sb__toggle',
            `ju-sb__toggle--${position}`,
          ].join(' ')}
          onClick={toggle}
          aria-label={isOpen ? 'Fermer le panneau' : 'Ouvrir le panneau'}
          aria-expanded={isOpen}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {chevron}
          </svg>
        </button>
      </div>
    </>
  );
};