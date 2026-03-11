import React, { forwardRef } from 'react';
import './ju-badge.css';

export type JUBadgeColor = 'default' | 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'pink' | 'yellow' | 'cyan';
export type JUBadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type JUBadgeVariant = 'soft' | 'solid' | 'outline' | 'ghost';
export type JUBadgeEffect = 'none' | 'glow' | 'pulse' | 'shine' | 'float';

export interface JUBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Texte du badge */
  label: string;
  /** Variante de couleur */
  color?: JUBadgeColor;
  /** Variante de taille */
  size?: JUBadgeSize;
  /** Variante visuelle */
  variant?: JUBadgeVariant;
  /** Effet d'animation */
  effect?: JUBadgeEffect;
  /** Icône optionnelle (gérée par le parent) */
  icon?: React.ReactNode;
  /** Afficher l'icône dans un cercle coloré */
  iconBg?: boolean;
  /** Indicateur pointillé */
  dot?: boolean;
  /** Effet verre dépoli */
  glass?: boolean;
  /** Forme pilule (full-radius) */
  pill?: boolean;
  /** Badge supprimable — affiche une croix */
  removable?: boolean;
  /** Callback de suppression */
  onRemove?: (e: React.MouseEvent) => void;
  /** Rend le badge interactif (curseur pointer, hover) */
  clickable?: boolean;
}

export const JUBadge = forwardRef<HTMLSpanElement, JUBadgeProps>(({
  label,
  color = 'default',
  size = 'md',
  variant = 'soft',
  effect = 'none',
  icon,
  iconBg = false,
  dot = false,
  glass = false,
  pill = false,
  removable = false,
  onRemove,
  clickable = false,
  className,
  onClick,
  ...rest
}, ref) => {
  const isClickable = clickable || !!onClick;

  const classNames = [
    'ju-badge',
    `ju-badge--${color}`,
    `ju-badge--${size}`,
    `ju-badge--${variant}`,
    effect !== 'none' ? `ju-badge--effect-${effect}` : '',
    glass ? 'ju-badge--glass' : '',
    pill ? 'ju-badge--pill' : '',
    isClickable ? 'ju-badge--clickable' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <span
      ref={ref}
      className={classNames}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e as unknown as React.MouseEvent<HTMLSpanElement>);
        }
      } : undefined}
      {...rest}
    >
      {dot && <span className="ju-badge__dot" aria-hidden="true" />}
      {icon && (
        <span className={`ju-badge__icon${iconBg ? ' ju-badge__icon--bg' : ''}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ju-badge__label">{label}</span>
      {removable && (
        <button
          type="button"
          className="ju-badge__remove"
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(e);
          }}
          tabIndex={-1}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="3" x2="9" y2="9" />
            <line x1="9" y1="3" x2="3" y2="9" />
          </svg>
        </button>
      )}
      {/* Shine overlay element */}
      {effect === 'shine' && <span className="ju-badge__shine" aria-hidden="true" />}
    </span>
  );
});

JUBadge.displayName = 'JUBadge';
