//Un composant parent pour gérer les titres (H1-H6), le corps de texte, les citations et les légendes de manière cohérente.import React from 'react';
import styles from './ju-typography.module.css';

export type JUTypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'lead' | 'small' | 'caption';

const TAG_MAP: Record<JUTypographyVariant, keyof React.JSX.IntrinsicElements> = {
  h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4',
  body: 'p', lead: 'p', small: 'p', caption: 'span',
};

export interface JUTypographyProps {
  /** Text variant controlling size, weight, spacing */
  variant?: JUTypographyVariant;
  /** Override the rendered HTML tag */
  as?: keyof React.JSX.IntrinsicElements;
  /** Muted text (reduced opacity) */
  muted?: boolean;
  /** Gradient text effect */
  gradient?: boolean;
  /** Text-align */
  align?: 'left' | 'center' | 'right';
  /** Balance text wrapping */
  balance?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const JUTypography: React.FC<JUTypographyProps> = ({
  variant = 'body',
  as,
  muted = false,
  gradient = false,
  align,
  balance = false,
  children,
  className,
}) => {
  const Tag = (as ?? TAG_MAP[variant]) as any;
  const cls = [
    styles['ju-typo'],
    styles[`ju-typo--${variant}`],
    muted ? styles['ju-typo--muted'] : '',
    gradient ? styles['ju-typo--gradient'] : '',
    balance ? styles['ju-typo--balance'] : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return <Tag className={cls} style={align ? { textAlign: align } : undefined}>{children}</Tag>;
};