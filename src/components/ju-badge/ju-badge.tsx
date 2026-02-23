import React from 'react';
import styles from './ju-badge.module.css';

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
    styles['ju-badge'],
    styles[`ju-badge--${color}`],
    glass ? styles['ju-badge--glass'] : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames}>
      {icon && <span className={styles['ju-badge__icon']} aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};