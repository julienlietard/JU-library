import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ju-ask-bar.css';

/* -- Types -- */

export type JUAskBarSize = 'sm' | 'md' | 'lg';
export type JUAskBarVariant = 'raised' | 'flat' | 'outline';

export interface JUAskBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;
  /** Called on submit (Enter or button click) */
  onSubmit?: (value: string) => void;
  /** Disable the input */
  disabled?: boolean;
  /** Show loading spinner on the submit button */
  loading?: boolean;
  /** Overall size */
  size?: JUAskBarSize;
  /** Visual style */
  variant?: JUAskBarVariant;
  /** Custom icon for the submit button */
  icon?: React.ReactNode;
  /** Keyboard shortcut hint (false to hide entirely) */
  shortcut?: string | false;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Max characters (shows counter when set) */
  maxLength?: number;
  /** Additional CSS class */
  className?: string;
}

/* -- Default icons -- */

const DefaultIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
);

const SpinnerIcon: React.FC = () => (
  <svg
    className="ju-ask-bar__spinner"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
    <path d="M18 10a8 8 0 00-8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/* -- Component -- */

export const JUAskBar: React.FC<JUAskBarProps> = ({
  placeholder = 'Ask a Question..',
  value: controlledValue,
  onChange,
  onSubmit,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'raised',
  icon,
  shortcut,
  autoFocus = false,
  maxLength,
  className,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;
  const inputRef = useRef<HTMLInputElement>(null);
  const isDisabled = disabled || loading;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (maxLength && v.length > maxLength) return;
      setInternalValue(v);
      onChange?.(v);
    },
    [onChange, maxLength],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && value.trim() && !loading) {
        onSubmit?.(value);
      }
    },
    [onSubmit, value, loading],
  );

  const handleButtonClick = useCallback(() => {
    if (loading) return;
    if (value.trim()) {
      onSubmit?.(value);
    } else {
      inputRef.current?.focus();
    }
  }, [onSubmit, value, loading]);

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  /* Shortcut hint text */
  const shortcutText = shortcut === false
    ? null
    : shortcut ?? (typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform) ? '\u2318 + K' : 'Ctrl + K');

  const cls = [
    'ju-ask-bar',
    `ju-ask-bar--${size}`,
    `ju-ask-bar--${variant}`,
    isDisabled ? 'ju-ask-bar--disabled' : '',
    loading ? 'ju-ask-bar--loading' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} onClick={handleContainerClick} role="search">
      <input
        ref={inputRef}
        className="ju-ask-bar__input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        aria-label="Ask a question"
        maxLength={maxLength}
      />

      <div className="ju-ask-bar__footer">
        {shortcutText && (
          <span className="ju-ask-bar__shortcut" aria-hidden="true">
            {shortcutText}
          </span>
        )}

        {maxLength && (
          <span
            className={`ju-ask-bar__counter${value.length >= maxLength ? ' ju-ask-bar__counter--limit' : ''}`}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>
        )}

        <button
          type="button"
          className="ju-ask-bar__btn"
          onClick={handleButtonClick}
          disabled={isDisabled}
          aria-label="Submit"
          aria-busy={loading || undefined}
        >
          {loading ? <SpinnerIcon /> : (icon ?? <DefaultIcon />)}
        </button>
      </div>
    </div>
  );
};
