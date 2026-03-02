import React from 'react';
import './ju-status.css';

export type JUStatusColor = 'orange' | 'blue' | 'purple' | 'yellow' | 'green' | 'red' | 'gray';

export interface JUStatusProps {
  /** Label text */
  label: string;
  /** Status color */
  color?: JUStatusColor;
  /** Optional icon (ReactNode) */
  icon?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

export const JUStatus: React.FC<JUStatusProps> = ({
  label,
  color = 'blue',
  icon,
  className,
}) => {
  const classNames = [
    'ju-status',
    `ju-status--${color}`,
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} role="status">
      {icon && <span className={'ju-status__icon'} aria-hidden="true">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};