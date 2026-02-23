import React from 'react';
import styles from './ju-card.module.css';

export type JUCardVariant = 'glass' | 'solid' | 'outline' | 'chat';
export type JUCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface JUCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: JUCardVariant;
  /** Inner padding */
  padding?: JUCardPadding;
  /** Optional image displayed at the top */
  image?: { src: string; alt: string; height?: string };
  /** Enable hover lift animation */
  interactive?: boolean;
  /** Card content */
  children: React.ReactNode;
}

export const JUCard: React.FC<JUCardProps> = ({
  variant = 'glass',
  padding = 'md',
  image,
  interactive = false,
  children,
  className,
  ...rest
}) => {
  const classNames = [
    styles['ju-card'],
    styles[`ju-card--${variant}`],
    styles[`ju-card--p-${padding}`],
    interactive ? styles['ju-card--interactive'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...rest}>
      {image && (
        <img
          className={styles['ju-card__image']}
          src={image.src}
          alt={image.alt}
          style={image.height ? { height: image.height } : undefined}
          loading="lazy"
          draggable={false}
        />
      )}
      {children}
    </div>
  );
};