import React from 'react';
import styles from './ju-skeleton.module.css';

export interface JUSkeletonProps {
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /** Width (CSS value) */
  width?: string | number;
  /** Height (CSS value) */
  height?: string | number;
  /** Number of text lines */
  lines?: number;
  /** Animation style */
  animation?: 'shimmer' | 'pulse' | 'none';
  /** Border radius override */
  borderRadius?: string | number;
  className?: string;
}

export const JUSkeleton: React.FC<JUSkeletonProps> = ({
  variant = 'text',
  width,
  height,
  lines = 1,
  animation = 'shimmer',
  borderRadius,
  className,
}) => {
  const cls = [
    styles['ju-sk'],
    styles[`ju-sk--${variant}`],
    styles[`ju-sk--${animation}`],
    className ?? '',
  ].filter(Boolean).join(' ');

  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles['ju-sk__lines']} style={{ width }}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cls}
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              height: height ?? '1em',
              borderRadius,
            }}
          />
        ))}
      </div>
    );
  }

  const style: React.CSSProperties = {
    width: width ?? (variant === 'circular' ? '40px' : '100%'),
    height: height ?? (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '120px'),
    borderRadius,
  };

  return <div className={cls} style={style} aria-hidden="true" />;
};