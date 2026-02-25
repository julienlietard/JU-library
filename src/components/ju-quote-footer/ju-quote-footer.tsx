import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ju-quote-footer.module.css';

/* ── Types ── */

export interface JUQuote {
  text: string;
  author: string;
}

export interface JUQuoteFooterProps {
  /** Array of quotes to cycle through */
  quotes: JUQuote[];
  /** Background image URL (portfolio footer.png) */
  backgroundImage?: string;
  /** Background color fallback */
  backgroundColor?: string;
  /** Optional logo image URL */
  logo?: { src: string; alt: string };
  /** Interval between quotes in ms (default 5000) */
  interval?: number;
  /** Transition duration in ms (default 600) */
  transitionDuration?: number;
  /** Legal/copyright section */
  legal?: {
    copyright: string;
    links?: { label: string; href: string }[];
  };
  /** Additional CSS class */
  className?: string;
}

type Phase = 'visible' | 'exit' | 'enter';

export const JUQuoteFooter: React.FC<JUQuoteFooterProps> = ({
  quotes,
  backgroundImage,
  backgroundColor = '#161616',
  logo,
  interval = 5000,
  transitionDuration = 600,
  legal,
  className,
}) => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('visible');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextIndexRef = useRef(1);

  const advance = useCallback(() => {
    setPhase('exit');
    setTimeout(() => {
      setIndex(nextIndexRef.current);
      nextIndexRef.current = (nextIndexRef.current + 1) % quotes.length;
      setPhase('enter');
      // Trigger enter → visible after repaint
      setTimeout(() => setPhase('visible'), 30);
    }, transitionDuration);
  }, [quotes.length, transitionDuration]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, interval);
  }, [advance, interval]);

  useEffect(() => {
    if (quotes.length <= 1) return;
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer, quotes.length]);

  const goTo = useCallback((i: number) => {
    if (i === index || quotes.length <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    nextIndexRef.current = i;
    advance();
    startTimer();
  }, [index, advance, startTimer, quotes.length]);

  const current = quotes[index];

  const footerStyle: React.CSSProperties = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor };

  return (
    <>
      <footer
        className={`${styles['ju-quote-footer']} ${className ?? ''}`}
        style={footerStyle}
        role="region"
        aria-label="Footer with quotes"
      >
        {logo && (
          <img
            className={styles['ju-quote-footer__logo']}
            src={logo.src}
            alt={logo.alt}
            draggable={false}
          />
        )}

        <div
          className={`${styles['ju-quote-footer__quote-wrapper']} ${styles[`ju-quote-footer__quote-wrapper--${phase}`]}`}
          aria-live="polite"
          aria-atomic="true"
          style={{ '--transition-duration': `${transitionDuration}ms` } as React.CSSProperties}
        >
          <h2 className={styles['ju-quote-footer__quote']}>"{current.text}"</h2>
          <p className={styles['ju-quote-footer__author']}>— {current.author}</p>
        </div>

        {quotes.length > 1 && (
          <div className={styles['ju-quote-footer__dots']} role="tablist" aria-label="Quotes">
            {quotes.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Quote ${i + 1}`}
                className={`${styles['ju-quote-footer__dot']} ${i === index ? styles['ju-quote-footer__dot--active'] : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </footer>

      {legal && (
        <div className={styles['ju-quote-footer__legal-wrapper']}>
          <div className={styles['ju-quote-footer__legal-content']}>
            <span>{legal.copyright}</span>
            {legal.links && legal.links.length > 0 && (
              <nav className={styles['ju-quote-footer__legal-links']}>
                {legal.links.map((link, i) => (
                  <a key={i} href={link.href}>{link.label}</a>
                ))}
              </nav>
            )}
          </div>
        </div>
      )}
    </>
  );
};