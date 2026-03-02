import React from 'react';
import './ju-avatar.css';

export type JUAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface JUAvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Initials fallback when no image */
  initials?: string;
  /** Size variant */
  size?: JUAvatarSize;
  /** Show a status dot */
  status?: 'online' | 'busy' | 'offline' | 'away';
  /** Glass border effect (for dark backgrounds) */
  glass?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const JUAvatar: React.FC<JUAvatarProps> = ({
  src,
  alt = '',
  initials,
  size = 'md',
  status,
  glass = false,
  className,
}) => {
  const classNames = [
    'ju-avatar',
    `ju-avatar--${size}`,
    glass ? 'ju-avatar--glass' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {src ? (
        <img
          className={'ju-avatar__image'}
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
        />
      ) : (
        <span className={'ju-avatar__initials'} aria-label={alt || initials}>
          {initials ?? '?'}
        </span>
      )}
      {status && (
        <span
          className={`${'ju-avatar__status'} ${`ju-avatar__status--${status}`}`}
          aria-label={status}
        />
      )}
    </div>
  );
};