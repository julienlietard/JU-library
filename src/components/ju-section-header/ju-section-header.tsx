import React from 'react';
import './ju-section-header.css';

export interface JUSectionHeaderProps {
  /** Small subtitle above the title (e.g. "Découvrez mon") */
  subtitle?: string;
  /** Main title (e.g. "Workspace") */
  title: string;
  /** Text alignment */
  align?: 'left' | 'center';
  /** Additional CSS class */
  className?: string;
}

export const JUSectionHeader: React.FC<JUSectionHeaderProps> = ({
  subtitle,
  title,
  align = 'center',
  className,
}) => {
  const classNames = [
    'ju-section-header',
    `ju-section-header--${align}`,
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <header className={classNames}>
      {subtitle && <p className={'ju-section-header__subtitle'}>{subtitle}</p>}
      <h2 className={'ju-section-header__title'}>{title}</h2>
    </header>
  );
};