import React from 'react';
import './ju-divider.css';

export type JUDividerVariant = 'solid' | 'dashed' | 'gradient' | 'dot';

export interface JUDividerProps {
  /** Visual style */
  variant?: JUDividerVariant;
  /** Vertical spacing */
  spacing?: 'sm' | 'md' | 'lg';
  /** Optional label in the center */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

export const JUDivider: React.FC<JUDividerProps> = ({
  variant = 'solid',
  spacing = 'md',
  label,
  className,
}) => {
  const classNames = [
    'ju-divider',
    `ju-divider--${variant}`,
    `ju-divider--${spacing}`,
    className ?? '',
  ].filter(Boolean).join(' ');

  if (label) {
    return (
      <div className={classNames} role="separator">
        <span className={'ju-divider__line'} />
        <span className={'ju-divider__label'}>{label}</span>
        <span className={'ju-divider__line'} />
      </div>
    );
  }

  return <hr className={classNames} role="separator" />;
};