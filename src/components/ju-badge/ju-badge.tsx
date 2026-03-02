import React from 'react';
import './ju-badge.css';

export type JUBadgeColor = 'default' | 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'pink';

export interface JUBadgeProps {
  /** Badge label text */
  label: string;
  /** Color variant */
  color?: JUBadgeColor;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Glass variant for dark backgrounds */
  glass?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const JUBadge: React.FC<JUBadgeProps> = ({
  label,
  color = 'default',
  icon,
  glass = false,
  className,
}) => {
  const classNames = [
    'ju-badge',
    `ju-badge--${color}`,
    glass ? 'ju-badge--glass' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {icon && <span className={'ju-badge__icon'} aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};