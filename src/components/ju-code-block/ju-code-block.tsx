import React, { useState, useCallback, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import './ju-code-block.css';

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

/** Map common language aliases to Prism grammar keys */
const LANG_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  md: 'markdown',
};

function resolveLang(language?: string): string | undefined {
  if (!language) return undefined;
  const key = LANG_MAP[language] ?? language;
  return Prism.languages[key] ? key : undefined;
}

/** Recursively render Prism tokens as React elements */
function renderToken(
  token: string | Prism.Token,
  key: number,
): React.ReactNode {
  if (typeof token === 'string') return token;
  const children = Array.isArray(token.content)
    ? (token.content as (string | Prism.Token)[]).map((t, i) => renderToken(t, i))
    : typeof token.content === 'string'
      ? token.content
      : renderToken(token.content as Prism.Token, 0);

  return (
    <span key={key} className={`ju-cb__token--${token.type}`}>
      {children}
    </span>
  );
}

/** Tokenize a single line of code */
function tokenizeLine(
  line: string,
  grammar: Prism.Grammar,
): React.ReactNode[] {
  const tokens = Prism.tokenize(line, grammar);
  return tokens.map((t, i) => renderToken(t, i));
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

  const resolvedLang = useMemo(() => resolveLang(language), [language]);
  const grammar = resolvedLang ? Prism.languages[resolvedLang] : undefined;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  }, [code]);

  return (
    <div className={`ju-cb ${className ?? ''}`}>
      {/* Header bar */}
      <div className="ju-cb__header">
        <div className="ju-cb__dots">
          <span /><span /><span />
        </div>
        {language && <span className="ju-cb__lang">{language}</span>}
        {copyable && (
          <button
            className={`ju-cb__copy ${copied ? 'ju-cb__copy--done' : ''}`}
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
      <pre className="ju-cb__pre" style={maxHeight ? { maxHeight } : undefined}>
        <code className="ju-cb__code">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`ju-cb__line ${highlightLines.includes(i + 1) ? 'ju-cb__line--hl' : ''}`}
            >
              {lineNumbers && <span className="ju-cb__ln">{i + 1}</span>}
              <span className="ju-cb__content">
                {grammar ? tokenizeLine(line, grammar) : (line || ' ')}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};
