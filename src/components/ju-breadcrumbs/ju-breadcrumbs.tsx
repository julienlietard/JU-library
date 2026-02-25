import React from 'react';
import styles from './ju-breadcrumbs.module.css';

export interface JUBreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface JUBreadcrumbsProps {
  /** Breadcrumb items, last is current page */
  items: JUBreadcrumbItem[];
  /** Separator character */
  separator?: React.ReactNode;
  /** Max items before collapsing (0 = no collapse) */
  maxItems?: number;
  className?: string;
}

export const JUBreadcrumbs: React.FC<JUBreadcrumbsProps> = ({
  items,
  separator,
  maxItems = 0,
  className,
}) => {
  const sep = separator ?? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  let visibleItems = items;
  if (maxItems > 0 && items.length > maxItems) {
    visibleItems = [
      items[0],
      { label: '…' },
      ...items.slice(-(maxItems - 1)),
    ];
  }

  return (
    <nav aria-label="Breadcrumb" className={`${styles['ju-bc']} ${className ?? ''}`}>
      <ol className={styles['ju-bc__list']}>
        {visibleItems.map((item, i) => {
          const isLast = i === visibleItems.length - 1;
          return (
            <li key={i} className={styles['ju-bc__item']}>
              {!isLast && item.href ? (
                <a href={item.href} className={styles['ju-bc__link']} onClick={item.onClick}>
                  {item.label}
                </a>
              ) : !isLast && item.onClick ? (
                <button type="button" className={styles['ju-bc__link']} onClick={item.onClick}>
                  {item.label}
                </button>
              ) : (
                <span className={isLast ? styles['ju-bc__current'] : styles['ju-bc__link']} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className={styles['ju-bc__sep']} aria-hidden="true">{sep}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};