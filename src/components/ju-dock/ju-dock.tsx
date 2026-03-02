import React from 'react';
import './ju-dock.css';

export interface JUDockItem {
  /** Unique identifier for the item */
  id: string;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Accessible label (used for aria-label and tooltip) */
  label: string;
}

export type JUDockTheme = 'light' | 'dark';
export type JUDockPosition = 'bottom' | 'top';

export interface JUDockProps {
  /** Array of dock items */
  items: JUDockItem[];
  /** Currently active item id */
  activeId?: string;
  /** Callback when an item is clicked */
  onItemClick?: (id: string) => void;
  /** Visual theme */
  theme?: JUDockTheme;
  /** Whether the dock is visible (controls enter/exit animation) */
  visible?: boolean;
  /** Position of the dock */
  position?: JUDockPosition;
  /** Additional CSS class */
  className?: string;
}

export const JUDock: React.FC<JUDockProps> = ({
  items,
  activeId,
  onItemClick,
  theme = 'light',
  visible = true,
  position = 'bottom',
  className,
}) => {
  const classNames = [
    'ju-dock',
    `ju-dock--${theme}`,
    `ju-dock--${position}`,
    visible ? 'ju-dock--visible' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={classNames} role="navigation" aria-label="Main navigation">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const itemClassNames = [
          'ju-dock__item',
          isActive ? 'ju-dock__item--active' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={item.id}
            className={itemClassNames}
            onClick={() => onItemClick?.(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
          >
            {item.icon}
          </button>
        );
      })}
    </nav>
  );
};
