import React from 'react';
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
  /** Position */
  position?: 'left' | 'right';
  /** Header content */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  className?: string;
}

export const JUSidebar: React.FC<JUSidebarProps> = ({
  sections,
  position = 'left',
  header,
  footer,
  className,
}) => (
  <aside
    className={[
      'ju-sb',
      `ju-sb--${position}`,
      className ?? '',
    ].filter(Boolean).join(' ')}
    aria-label="Sidebar"
  >
    <div className="ju-sb__inner">
      {header && <div className="ju-sb__header">{header}</div>}

      <nav className="ju-sb__nav">
        {sections.map((s, si) => (
          <div key={si} className="ju-sb__section">
            {s.title && (
              <h3 className="ju-sb__section-title">{s.title}</h3>
            )}
            <ul className="ju-sb__list">
              {s.items.map((item, ii) => (
                <li key={ii}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className={[
                        'ju-sb__link',
                        item.active ? 'ju-sb__link--active' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={item.onClick}
                    >
                      {item.icon && <span className="ju-sb__icon">{item.icon}</span>}
                      {item.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={[
                        'ju-sb__link',
                        item.active ? 'ju-sb__link--active' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={item.onClick}
                    >
                      {item.icon && <span className="ju-sb__icon">{item.icon}</span>}
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && <div className="ju-sb__footer">{footer}</div>}
    </div>
  </aside>
);
