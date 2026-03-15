import React, { useState } from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-task-card.css';

export type JUTaskCardStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface JUTaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Project / task group name */
  name: string;
  /** Current status */
  status?: JUTaskCardStatus;
  /** Number of completed tasks */
  completedTasks: number;
  /** Total number of tasks */
  totalTasks: number;
  /** Category label (shown as dropdown-style chip) */
  category?: string;
  /** Avatar image URL */
  avatarSrc?: string;
  /** Avatar alt text */
  avatarAlt?: string;
  /** Last update label */
  updatedLabel?: string;
  /** Callback when settings icon is clicked */
  onSettingsClick?: () => void;
  /** Callback when category chip is clicked */
  onCategoryClick?: () => void;
}

const statusConfig: Record<JUTaskCardStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'ju-task-card__status--active' },
  paused: { label: 'Paused', className: 'ju-task-card__status--paused' },
  completed: { label: 'Done', className: 'ju-task-card__status--completed' },
  archived: { label: 'Archived', className: 'ju-task-card__status--archived' },
};

export const JUTaskCard: React.FC<JUTaskCardProps> = ({
  name,
  status = 'active',
  completedTasks,
  totalTasks,
  category = 'Tasks',
  avatarSrc,
  avatarAlt = 'Assignee',
  updatedLabel,
  onSettingsClick,
  onCategoryClick,
  className,
  ...rest
}) => {
  const [settingsHover, setSettingsHover] = useState(false);
  const cfg = statusConfig[status];
  const segments = totalTasks || 1;
  const cls = ['ju-task-card', className ?? ''].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="md" className={cls} {...rest}>
      {/* Row 1: Status + Settings */}
      <div className="ju-task-card__top">
        <span className={`ju-task-card__status ${cfg.className}`} role="status">
          <span className="ju-task-card__pulse" aria-hidden="true" />
          {cfg.label}
        </span>

        {onSettingsClick && (
          <button
            className="ju-task-card__settings"
            onClick={onSettingsClick}
            onMouseEnter={() => setSettingsHover(true)}
            onMouseLeave={() => setSettingsHover(false)}
            aria-label="Settings"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="2.5" fill={settingsHover ? 'var(--ju-color-text)' : 'currentColor'} />
              <path
                d="M12 1.5l1.09 3.36a1 1 0 00.78.64l3.46.5-2.5 2.44a1 1 0 00-.29.89l.59 3.43-3.1-1.63a1 1 0 00-.93 0L8 12.76l.59-3.43a1 1 0 00-.29-.89L5.8 5.99l3.46-.5a1 1 0 00.78-.64L12 1.5z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0"
              />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 8.82a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Row 2: Title */}
      <div className="ju-task-card__title-row">
        <svg className="ju-task-card__folder-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="ju-task-card__name">{name}</h3>
      </div>

      {/* Row 3: Category chip */}
      <button
        className="ju-task-card__category"
        onClick={onCategoryClick}
        type="button"
        aria-label={`Category: ${category}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="4" cy="6" r="1.5" fill="currentColor" />
          <circle cx="4" cy="12" r="1.5" fill="currentColor" />
          <circle cx="4" cy="18" r="1.5" fill="currentColor" />
        </svg>
        {category}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Row 4: Progress */}
      <div className="ju-task-card__progress-section">
        <div className="ju-task-card__progress-header">
          <span className="ju-task-card__progress-label">Progress</span>
          <span className="ju-task-card__progress-count">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <div className="ju-task-card__bar" role="progressbar" aria-valuenow={completedTasks} aria-valuemin={0} aria-valuemax={totalTasks}>
          {Array.from({ length: segments }, (_, i) => (
            <span
              key={i}
              className={[
                'ju-task-card__segment',
                i < completedTasks ? 'ju-task-card__segment--filled' : '',
              ].filter(Boolean).join(' ')}
            />
          ))}
        </div>
      </div>

      {/* Row 5: Footer */}
      <div className="ju-task-card__footer">
        {avatarSrc && (
          <img
            className="ju-task-card__avatar"
            src={avatarSrc}
            alt={avatarAlt}
            loading="lazy"
            draggable={false}
          />
        )}
        <div className="ju-task-card__spacer" />
        {updatedLabel && (
          <span className="ju-task-card__updated">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {updatedLabel}
          </span>
        )}
      </div>
    </JUCard>
  );
};
