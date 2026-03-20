import React from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-digest-sentinel.css';

export interface JUDigestItem {
  /** Emoji representing the topic */
  emoji: string;
  /** Bold headline */
  title: string;
  /** AI-generated one-line summary */
  summary: string;
  /** Source URL */
  sourceUrl: string;
  /** Optional source name (e.g. "TechCrunch") */
  sourceName?: string;
}

export interface JUDigestSentinelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** List of digest items */
  items: JUDigestItem[];
  /** Optional widget title */
  title?: string;
}

export const JUDigestSentinel: React.FC<JUDigestSentinelProps> = ({
  items,
  title = 'Digest Sentinel',
  className,
  ...rest
}) => {
  const cls = ['ju-digest-sentinel', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={cls} {...rest}>
      {title && <h3 className="ju-digest-sentinel__title">{title}</h3>}

      <div className="ju-digest-sentinel__list" role="list">
        {items.map((item, i) => (
          <JUCard
            key={i}
            variant="glass"
            padding="none"
            className="ju-digest-sentinel__item"
            role="listitem"
          >
            <div className="ju-digest-sentinel__row">
              <span className="ju-digest-sentinel__emoji" aria-hidden="true">
                {item.emoji}
              </span>

              <div className="ju-digest-sentinel__content">
                <span className="ju-digest-sentinel__headline">{item.title}</span>
                <span className="ju-digest-sentinel__summary">{item.summary}</span>
              </div>

              <a
                className="ju-digest-sentinel__link"
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ouvrir la source : ${item.sourceName ?? item.title}`}
              >
                Ouvrir la source
              </a>
            </div>
          </JUCard>
        ))}
      </div>
    </div>
  );
};
