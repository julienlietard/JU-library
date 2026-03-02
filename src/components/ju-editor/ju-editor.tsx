import React, { useState, useRef, useCallback } from 'react';
import './ju-editor.css';

export type JUEditorAction = 'bold' | 'italic' | 'heading' | 'link' | 'code' | 'quote' | 'ul' | 'ol' | 'image';

export interface JUEditorProps {
  /** Controlled Markdown content */
  value?: string;
  /** Default content (uncontrolled) */
  defaultValue?: string;
  /** Change handler — returns markdown string */
  onChange?: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Toolbar actions shown */
  actions?: JUEditorAction[];
  /** Toolbar position */
  toolbarPosition?: 'top' | 'floating';
  /** Min height */
  minHeight?: number;
  /** Disabled */
  disabled?: boolean;
  className?: string;
}

const DEFAULT_ACTIONS: JUEditorAction[] = ['bold', 'italic', 'heading', 'link', 'code', 'quote', 'ul', 'ol'];

const ACTION_ICONS: Record<JUEditorAction, { icon: string; label: string; prefix: string; suffix: string }> = {
  bold:    { icon: 'B',  label: 'Gras',        prefix: '**', suffix: '**' },
  italic:  { icon: 'I',  label: 'Italique',    prefix: '_',  suffix: '_' },
  heading: { icon: 'H',  label: 'Titre',       prefix: '## ', suffix: '' },
  link:    { icon: '🔗', label: 'Lien',        prefix: '[',  suffix: '](url)' },
  code:    { icon: '<>', label: 'Code',         prefix: '`',  suffix: '`' },
  quote:   { icon: '❝',  label: 'Citation',    prefix: '> ',  suffix: '' },
  ul:      { icon: '•',  label: 'Liste',       prefix: '- ',  suffix: '' },
  ol:      { icon: '1.', label: 'Liste num.',  prefix: '1. ', suffix: '' },
  image:   { icon: '🖼', label: 'Image',       prefix: '![alt](', suffix: ')' },
};

export const JUEditor: React.FC<JUEditorProps> = ({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Commencez à écrire...',
  actions = DEFAULT_ACTIONS,
  toolbarPosition = 'top',
  minHeight = 240,
  disabled = false,
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalVal, setInternalVal] = useState(defaultValue);
  const controlled = value !== undefined;
  const currentVal = controlled ? value : internalVal;
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (!controlled) setInternalVal(v);
    onChange?.(v);
  }, [controlled, onChange]);

  const insertMarkdown = useCallback((action: JUEditorAction) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { prefix, suffix } = ACTION_ICONS[action];
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = currentVal;
    const selected = text.slice(start, end) || action;
    const newText = text.slice(0, start) + prefix + selected + suffix + text.slice(end);
    if (!controlled) setInternalVal(newText);
    onChange?.(newText);
    // Restore cursor
    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + prefix.length + selected.length + suffix.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  }, [currentVal, controlled, onChange]);

  const wordCount = currentVal.trim() ? currentVal.trim().split(/\s+/).length : 0;

  const cls = [
    'ju-ed',
    `ju-ed--toolbar-${toolbarPosition}`,
    focused ? 'ju-ed--focused' : '',
    disabled ? 'ju-ed--disabled' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      <div className={'ju-ed__toolbar'} role="toolbar" aria-label="Formatting">
        {actions.map((a) => (
          <button
            key={a}
            type="button"
            className={'ju-ed__action'}
            onClick={() => insertMarkdown(a)}
            title={ACTION_ICONS[a].label}
            aria-label={ACTION_ICONS[a].label}
            disabled={disabled}
          >
            {ACTION_ICONS[a].icon}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className={'ju-ed__textarea'}
        value={controlled ? value : undefined}
        defaultValue={controlled ? undefined : defaultValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ minHeight }}
      />
      <div className={'ju-ed__footer'}>
        <span className={'ju-ed__count'}>{wordCount} mot{wordCount !== 1 ? 's' : ''}</span>
        <span className={'ju-ed__format'}>Markdown</span>
      </div>
    </div>
  );
};