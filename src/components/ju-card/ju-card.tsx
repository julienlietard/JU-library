import React from 'react';
import styles from './ju-card.module.css';

export type JUCardVariant = 'glass' | 'solid' | 'outline' | 'chat' | 'visual';
export type JUCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface JUCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: JUCardVariant;
  /** Inner padding */
  padding?: JUCardPadding;
  /** Optional image displayed at the top (for glass/solid/chat) */
  image?: { src: string; alt: string; height?: string };
  /**
   * Full-bleed background image (for 'visual' variant).
   * The children are overlaid on top of the image.
   */
  backgroundImage?: string;
  /** Enable hover lift animation */
  interactive?: boolean;
  /** Aspect ratio (useful for visual cards, e.g. '1/1', '16/9', '4/3') */
  aspectRatio?: string;
  /** Card content */
  children?: React.ReactNode;
}

export const JUCard: React.FC<JUCardProps> = ({
  variant = 'glass',
  padding = 'md',
  image,
  backgroundImage,
  interactive = false,
  aspectRatio,
  children,
  className,
  style,
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

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(aspectRatio ? { aspectRatio } : {}),
    ...(variant === 'visual' && backgroundImage
      ? { backgroundImage: `url(${backgroundImage})` }
      : {}),
  };

  return (
    <div className={classNames} style={combinedStyle} {...rest}>
      {/* Top image (non-visual variants) */}
      {image && variant !== 'visual' && (
        <img
          className={styles['ju-card__image']}
          src={image.src}
          alt={image.alt}
          style={image.height ? { height: image.height } : undefined}
          loading="lazy"
          draggable={false}
        />
      )}

      {/* Overlay content for visual variant */}
      {variant === 'visual' && children && (
        <div className={styles['ju-card__overlay']}>{children}</div>
      )}

      {/* Normal content for other variants */}
      {variant !== 'visual' && children}
    </div>
  );
};