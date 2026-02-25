import React from 'react';
import styles from './ju-project-card.module.css';

/* ── Chat message type ── */

export interface JUProjectMessage {
  /** Sender name (displayed above the bubble) */
  sender: string;
  /** Message text */
  text: string;
  /** 'left' = app owner, 'right' = visitor */
  side: 'left' | 'right';
  /** Optional URL link shown as a separate bubble */
  link?: string;
}

/* ── Props ── */

export interface JUProjectCardProps {
  /** Project cover image */
  image: { src: string; alt: string };
  /** Array of chat messages displayed below the image */
  messages: JUProjectMessage[];
  /** Avatar letter or emoji for the left sender */
  avatar?: string;
  /** Card height (default 620px like portfolio, 'auto' for flexible) */
  height?: string;
  /** Additional CSS class */
  className?: string;
}

export const JUProjectCard: React.FC<JUProjectCardProps> = ({
  image,
  messages,
  avatar = 'J',
  height = '620px',
  className,
}) => {
  const classNames = [styles['ju-project-card'], className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classNames} style={{ height }}>
      {/* Image */}
      <div className={styles['ju-project-card__img-wrap']}>
        <img
          className={styles['ju-project-card__img']}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Chat */}
      <div className={styles['ju-project-card__chat']}>
        {messages.map((msg, i) => (
          <React.Fragment key={i}>
            <div
              className={`${styles['ju-project-card__bubble']} ${
                msg.side === 'right'
                  ? styles['ju-project-card__bubble--right']
                  : styles['ju-project-card__bubble--left']
              }`}
            >
              {msg.side === 'left' && (
                <span className={styles['ju-project-card__avatar']} aria-hidden="true">
                  {avatar}
                </span>
              )}
              <div className={styles['ju-project-card__body']}>
                <span
                  className={`${styles['ju-project-card__sender']} ${
                    msg.side === 'right' ? styles['ju-project-card__sender--right'] : ''
                  }`}
                >
                  {msg.sender}
                </span>
                <p className={styles['ju-project-card__text']}>{msg.text}</p>
              </div>
            </div>

            {/* Link bubble (always from left sender) */}
            {msg.link && (
              <div
                className={`${styles['ju-project-card__bubble']} ${styles['ju-project-card__bubble--left']}`}
              >
                <span className={styles['ju-project-card__avatar']} aria-hidden="true">
                  {avatar}
                </span>
                <div className={styles['ju-project-card__body']}>
                  <a
                    href={msg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['ju-project-card__link']}
                  >
                    {msg.link}
                  </a>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </article>
  );
};