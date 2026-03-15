import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ju-ask-bar.css';

/* -- Types -- */
export type JUAskBarTheme = 'light' | 'dark' | 'auto';

export interface JUAskBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  theme?: JUAskBarTheme;
  autoFocus?: boolean;
  className?: string;
  currentModel?: string;
}

/* -- Icons (Minimalist SVGs) -- */
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const JUAskBar: React.FC<JUAskBarProps> = ({
  placeholder = 'Posez une question...',
  value: controlledValue,
  onChange,
  onSubmit,
  disabled = false,
  loading = false,
  theme = 'auto',
  autoFocus = false,
  className,
  currentModel = 'Claude Sonnet 3.5',
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const isDisabled = disabled || loading;
  const hasText = value.trim().length > 0;

  // Auto-focus
  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasText && !loading) {
        onSubmit?.(value);
      }
    }
  }, [onSubmit, value, loading, hasText]);

  const handleSubmitClick = useCallback(() => {
    if (!loading && hasText) onSubmit?.(value);
  }, [onSubmit, value, loading, hasText]);

  // Touch follow effect logic
  const handlePointerDown = () => setIsPointerDown(true);
  const handlePointerUp = () => setIsPointerDown(false);
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown || !glowRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.setProperty('--x', `${x}px`);
    glowRef.current.style.setProperty('--y', `${y}px`);
  };

  const cls = [
    'ju-ask-bar',
    `ju-ask-bar--${theme}`,
    isDisabled ? 'ju-ask-bar--disabled' : '',
    loading ? 'ju-ask-bar--loading' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* Inner surface — beveled squircle card */}
      <div className="ju-ask-bar__inner-surface">
        {/* Glow overlay for mobile long press */}
        <div
          ref={glowRef}
          className={`ju-ask-bar__glow ${isPointerDown ? 'active' : ''}`}
        />

        <textarea
          ref={textareaRef}
          className="ju-ask-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          rows={1}
        />

        <div className="ju-ask-bar__toolbar">
          {/* Left: Action Menu */}
          <div className="ju-ask-bar__tools-left">
            <button className="ju-ask-bar__add-btn" aria-label="Add attachment">
              <PlusIcon />
            </button>
          </div>

          {/* Right: Dynamic Tools */}
          <div className="ju-ask-bar__tools-right">
            {loading ? (
              /* Skeleton Loading State */
              <div className="ju-ask-bar__skeleton-loader">
                <div className="skeleton-dot"></div>
                <div className="skeleton-dot"></div>
                <div className="skeleton-dot"></div>
              </div>
            ) : hasText ? (
              /* Send Button */
              <button
                className="ju-ask-bar__send-btn"
                onClick={handleSubmitClick}
                aria-label="Envoyer"
              >
                <SendIcon />
              </button>
            ) : (
              /* Idle Tools (Model, Search, Mic) */
              <>
                <button className="ju-ask-bar__model-selector">
                  {currentModel} <ChevronDownIcon />
                </button>
                <button className="ju-ask-bar__icon-btn" aria-label="Web search">
                  <SearchIcon />
                </button>
                <button className="ju-ask-bar__icon-btn" aria-label="Voice input">
                  <MicIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};