import React, { useState, useCallback } from 'react';
import './ju-timeline.css';

export interface JUTimelineItem {
  id: string;
  date: string;
  title: string;
  badge?: { label: string; icon?: string; color?: string };
  subtitle?: string;
  points?: string[];
}

export interface JUTimelineProps {
  /** Timeline items */
  items: JUTimelineItem[];
  /** Allow only one item open at a time */
  accordion?: boolean;
  /** All items expanded (e.g. mobile) */
  expandAll?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const JUTimeline: React.FC<JUTimelineProps> = ({
  items,
  accordion = true,
  expandAll = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    if (expandAll) return;
    setOpenIds((prev) => {
      const next = new Set(accordion ? [] : prev);
      if (prev.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, [accordion, expandAll]);

  return (
    <ul className={`${'ju-timeline'} ${className ?? ''}`} role="list">
      {items.map((item) => {
        const isOpen = expandAll || openIds.has(item.id);
        return (
          <li key={item.id} className={`${'ju-timeline__item'} ${isOpen ? 'ju-timeline__item--open' : ''}`}>
            <div
              className={'ju-timeline__row'}
              onClick={() => toggle(item.id)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(item.id); } }}
            >
              <span className={'ju-timeline__date'}>{item.date}</span>
              <span className={'ju-timeline__title'}>
                {item.title}
                {!expandAll && (
                  <svg className={`${'ju-timeline__caret'} ${isOpen ? 'ju-timeline__caret--open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </span>
              {item.badge && (
                <span
                  className={'ju-timeline__badge'}
                  style={item.badge.color ? { backgroundColor: item.badge.color } : undefined}
                >
                  {item.badge.icon && <img src={item.badge.icon} alt="" className={'ju-timeline__badge-icon'} />}
                  <span>{item.badge.label}</span>
                </span>
              )}
            </div>
            <div className={`${'ju-timeline__details'} ${isOpen ? 'ju-timeline__details--open' : ''}`}>
              <div className={'ju-timeline__inner'}>
                {item.subtitle && <p className={'ju-timeline__subtitle'}>{item.subtitle}</p>}
                {item.points && item.points.length > 0 && (
                  <ul className={'ju-timeline__points'}>
                    {item.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};