import React, { useState, useRef, useCallback, useId } from 'react';
import './ju-tag-input.css';

export interface JUTagInputProps {
  /** Current tags (controlled) */
  value?: string[];
  /** Default tags (uncontrolled) */
  defaultValue?: string[];
  /** Called when tags change */
  onChange?: (tags: string[]) => void;
  /** Placeholder */
  placeholder?: string;
  /** Label */
  label?: string;
  /** Max number of tags */
  max?: number;
  /** Disabled */
  disabled?: boolean;
  /** Error message */
  error?: string;
  className?: string;
}

export const JUTagInput: React.FC<JUTagInputProps> = ({
  value,
  defaultValue = [],
  onChange,
  placeholder = 'Add a tag…',
  label,
  max,
  disabled = false,
  error,
  className,
}) => {
  const id = useId();
  const controlled = value !== undefined;
  const [internalTags, setInternalTags] = useState<string[]>(defaultValue);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = controlled ? value : internalTags;

  const update = useCallback((next: string[]) => {
    if (!controlled) setInternalTags(next);
    onChange?.(next);
  }, [controlled, onChange]);

  const addTag = useCallback((raw: string) => {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) return;
    if (max && tags.length >= max) return;
    update([...tags, tag]);
    setInput('');
  }, [tags, max, update]);

  const removeTag = useCallback((idx: number) => {
    update(tags.filter((_, i) => i !== idx));
  }, [tags, update]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags.length - 1);
    }
  }, [input, tags, addTag, removeTag]);

  return (
    <div className={`${'ju-ti'} ${error ? 'ju-ti--error' : ''} ${disabled ? 'ju-ti--disabled' : ''} ${className ?? ''}`}>
      {label && <label htmlFor={id} className={'ju-ti__label'}>{label}</label>}
      <div className={'ju-ti__wrapper'} onClick={() => inputRef.current?.focus()}>
        {tags.map((tag, i) => (
          <span key={tag} className={'ju-ti__tag'}>
            <span>{tag}</span>
            {!disabled && (
              <button
                className={'ju-ti__tag-x'}
                onClick={(e) => { e.stopPropagation(); removeTag(i); }}
                aria-label={`Remove ${tag}`}
                tabIndex={-1}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          className={'ju-ti__input'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(input)}
          placeholder={tags.length ? '' : placeholder}
          disabled={disabled || (!!max && tags.length >= max)}
          aria-invalid={!!error}
        />
      </div>
      {error && <span className={'ju-ti__error'} role="alert">{error}</span>}
      {max && <span className={'ju-ti__count'}>{tags.length}/{max}</span>}
    </div>
  );
};