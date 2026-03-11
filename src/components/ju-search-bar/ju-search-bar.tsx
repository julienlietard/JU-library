import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ju-search-bar.css';

/* -- Types -- */

export type JUSearchBarSize = 'sm' | 'md' | 'lg';
export type JUSearchBarVariant = 'glass' | 'solid' | 'dark';
export type JUSearchBarPlatform = 'mac' | 'win' | 'none';

export interface JUSearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Size preset */
  size?: JUSearchBarSize;
  /** Visual variant */
  variant?: JUSearchBarVariant;
  /** Platform for shortcut badge */
  platform?: JUSearchBarPlatform;
  /** Controlled value */
  value?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;
  /** Called on Enter key or submit */
  onSubmit?: (value: string) => void;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Disable the input */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

/* -- Icons -- */

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* -- Component -- */

export const JUSearchBar: React.FC<JUSearchBarProps> = ({
  placeholder = 'Search...',
  size = 'md',
  variant = 'glass',
  platform = 'mac',
  value: controlledValue,
  onChange,
  onSubmit,
  autoFocus = false,
  disabled = false,
  className,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInternalValue(v);
      onChange?.(v);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit?.(value);
      }
    },
    [onSubmit, value],
  );

  /* Global keyboard shortcut: Cmd+K / Ctrl+K */
  useEffect(() => {
    if (platform === 'none') return;

    const handler = (e: KeyboardEvent) => {
      const mod = platform === 'mac' ? e.metaKey : e.ctrlKey;
      if (mod && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [platform]);

  const cls = [
    'ju-search-bar',
    `ju-search-bar--${size}`,
    `ju-search-bar--${variant}`,
    focused && 'ju-search-bar--focused',
    disabled && 'ju-search-bar--disabled',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      <SearchIcon className="ju-search-bar__icon" />

      <input
        ref={inputRef}
        className="ju-search-bar__input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        disabled={disabled}
        aria-label="Search"
      />

      {platform !== 'none' && !focused && !value && (
        <div className="ju-search-bar__shortcut" aria-hidden="true">
          {platform === 'mac' ? (
            <>
              <kbd className="ju-search-bar__key">{'\u2318'}</kbd>
              <kbd className="ju-search-bar__key">K</kbd>
            </>
          ) : (
            <>
              <kbd className="ju-search-bar__key">Ctrl</kbd>
              <kbd className="ju-search-bar__key">K</kbd>
            </>
          )}
        </div>
      )}
    </div>
  );
};
