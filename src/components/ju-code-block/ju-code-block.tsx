import React, { useState, useCallback } from 'react';
import styles from './ju-code-block.module.css';

export interface JUCodeBlockProps {
  /** Code content */
  code: string;
  /** Language label (e.g. 'tsx', 'python', 'bash') */
  language?: string;
  /** Show line numbers */
  lineNumbers?: boolean;
  /** Highlight specific lines (1-indexed) */
  highlightLines?: number[];
  /** Show copy button */
  copyable?: boolean;
  /** Max height with scroll */
  maxHeight?: number;
  className?: string;
}

export const JUCodeBlock: React.FC<JUCodeBlockProps> = ({
  code,
  language,
  lineNumbers = true,
  highlightLines = [],
  copyable = true,
  maxHeight,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  }, [code]);

  return (
    <div className={`${styles['ju-cb']} ${className ?? ''}`}>
      {/* Header bar */}
      <div className={styles['ju-cb__header']}>
        <div className={styles['ju-cb__dots']}>
          <span /><span /><span />
        </div>
        {language && <span className={styles['ju-cb__lang']}>{language}</span>}
        {copyable && (
          <button
            className={`${styles['ju-cb__copy']} ${copied ? styles['ju-cb__copy--done'] : ''}`}
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        )}
      </div>

      {/* Code area */}
      <pre className={styles['ju-cb__pre']} style={maxHeight ? { maxHeight } : undefined}>
        <code className={styles['ju-cb__code']}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={`${styles['ju-cb__line']} ${highlightLines.includes(i + 1) ? styles['ju-cb__line--hl'] : ''}`}
            >
              {lineNumbers && <span className={styles['ju-cb__ln']}>{i + 1}</span>}
              <span className={styles['ju-cb__content']}>{line || ' '}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};