import React, { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import { X, SmilePlus, SquarePlus, Sparkles, Keyboard } from 'lucide-react';
import './ju-comment-box.css';

/* ---- Types ---- */

export interface JUCommentBoxUser {
  /** Unique id */
  id: string;
  /** Display name (e.g. "hanny.unicorn") */
  name: string;
  /** Avatar URL */
  avatarSrc?: string;
  /** Verified badge */
  verified?: boolean;
}

export interface JUCommentBoxComment {
  id: string;
  author: JUCommentBoxUser;
  body: string;
  date: string;
}

export interface JUCommentBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** Title shown in the header */
  title?: string;
  /** Existing comments to display above the input */
  comments?: JUCommentBoxComment[];
  /** Users available for @mention autocomplete */
  users?: JUCommentBoxUser[];
  /** Placeholder text */
  placeholder?: string;
  /** Controlled value */
  value?: string;
  /** Called when input value changes */
  onValueChange?: (value: string) => void;
  /** Called when the user submits (clicks send or presses Enter) */
  onSubmit?: (value: string, mentions: string[]) => void;
  /** Called when close button is clicked */
  onClose?: () => void;
  /** Show emoji action */
  showEmoji?: boolean;
  /** Show attach action */
  showAttach?: boolean;
  /** Show AI action */
  showAI?: boolean;
  /** Show keyboard toggle */
  showKeyboard?: boolean;
  /** Max suggestions shown in autocomplete */
  maxSuggestions?: number;
}

/* ---- Helpers ---- */

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

/** Extract mention IDs from text like "hello @hanny.unicorn how are you" */
function extractMentions(text: string, users: JUCommentBoxUser[]): string[] {
  const ids: string[] = [];
  const regex = /@(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const name = match[1];
    const user = users.find(
      (u) => u.name.toLowerCase() === name.toLowerCase(),
    );
    if (user) ids.push(user.id);
  }
  return ids;
}

/* ---- Render body with highlighted mentions ---- */

function renderBody(text: string, users: JUCommentBoxUser[]): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /@(\S+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const name = match[1];
    const user = users.find(
      (u) => u.name.toLowerCase() === name.toLowerCase(),
    );
    if (user) {
      parts.push(
        <span key={key++} className="ju-comment-box__mention">
          @{user.name}
        </span>,
      );
    } else {
      parts.push(match[0]);
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

/* ---- Component ---- */

export const JUCommentBox = forwardRef<HTMLDivElement, JUCommentBoxProps>(
  (
    {
      title = 'Add comment',
      comments = [],
      users = [],
      placeholder = 'Write a comment…',
      value: controlledValue,
      onValueChange,
      onSubmit,
      onClose,
      showEmoji = true,
      showAttach = true,
      showAI = true,
      showKeyboard = true,
      maxSuggestions = 5,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState('');
    const value = isControlled ? controlledValue : internalValue;

    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const [mentionIndex, setMentionIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const inputRef = useRef<HTMLDivElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    /* ---- Filtered users ---- */

    const filtered = mentionQuery !== null
      ? users
          .filter((u) =>
            u.name.toLowerCase().includes(mentionQuery.toLowerCase()),
          )
          .slice(0, maxSuggestions)
      : [];

    /* ---- Mention detection ---- */

    const detectMention = useCallback(
      (text: string, cursorPos: number) => {
        const before = text.slice(0, cursorPos);
        const match = before.match(/@(\S*)$/);
        if (match) {
          setMentionQuery(match[1]);
          setMentionIndex(0);
          setShowSuggestions(true);
        } else {
          setMentionQuery(null);
          setShowSuggestions(false);
        }
      },
      [],
    );

    /* ---- Input handling ---- */

    const handleInput = useCallback(
      (e: React.FormEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const text = el.innerText;

        if (!isControlled) setInternalValue(text);
        onValueChange?.(text);

        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          /* Count characters up to cursor */
          const preRange = document.createRange();
          preRange.selectNodeContents(el);
          preRange.setEnd(range.startContainer, range.startOffset);
          const cursorPos = preRange.toString().length;
          detectMention(text, cursorPos);
        }
      },
      [isControlled, onValueChange, detectMention],
    );

    /* ---- Insert mention ---- */

    const insertMention = useCallback(
      (user: JUCommentBoxUser) => {
        const el = inputRef.current;
        if (!el) return;

        const text = el.innerText;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        const range = sel.getRangeAt(0);
        const preRange = document.createRange();
        preRange.selectNodeContents(el);
        preRange.setEnd(range.startContainer, range.startOffset);
        const cursorPos = preRange.toString().length;

        const before = text.slice(0, cursorPos);
        const mentionStart = before.lastIndexOf('@');
        const after = text.slice(cursorPos);

        const newText = before.slice(0, mentionStart) + '@' + user.name + ' ' + after;

        el.innerText = newText;
        if (!isControlled) setInternalValue(newText);
        onValueChange?.(newText);

        /* Re-position cursor */
        requestAnimationFrame(() => {
          const newRange = document.createRange();
          const textNode = el.firstChild || el;
          const pos = mentionStart + user.name.length + 2; // @name + space
          try {
            newRange.setStart(textNode, Math.min(pos, (textNode as Text).length || 0));
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          } catch {
            /* fallback: place cursor at end */
            newRange.selectNodeContents(el);
            newRange.collapse(false);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
        });

        setShowSuggestions(false);
        setMentionQuery(null);
      },
      [isControlled, onValueChange],
    );

    /* ---- Keyboard nav in suggestions ---- */

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (showSuggestions && filtered.length > 0) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setMentionIndex((i) => (i + 1) % filtered.length);
            return;
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setMentionIndex((i) => (i - 1 + filtered.length) % filtered.length);
            return;
          }
          if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            insertMention(filtered[mentionIndex]);
            return;
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            setShowSuggestions(false);
            return;
          }
        }

        if (e.key === 'Enter' && !e.shiftKey && !showSuggestions) {
          e.preventDefault();
          handleSubmit();
        }
      },
      [showSuggestions, filtered, mentionIndex, insertMention],
    );

    /* ---- Submit ---- */

    const handleSubmit = useCallback(() => {
      const text = (inputRef.current?.innerText || value).trim();
      if (!text) return;
      const mentions = extractMentions(text, users);
      onSubmit?.(text, mentions);

      /* Clear input */
      if (inputRef.current) inputRef.current.innerText = '';
      if (!isControlled) setInternalValue('');
      onValueChange?.('');
    }, [value, users, onSubmit, isControlled, onValueChange]);

    /* ---- Close suggestions on outside click ---- */

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          suggestionsRef.current &&
          !suggestionsRef.current.contains(e.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, []);

    /* ---- Scroll active suggestion into view ---- */

    useEffect(() => {
      if (!showSuggestions || !suggestionsRef.current) return;
      const active = suggestionsRef.current.children[mentionIndex] as HTMLElement | undefined;
      active?.scrollIntoView({ block: 'nearest' });
    }, [mentionIndex, showSuggestions]);

    const cls = ['ju-comment-box', className].filter(Boolean).join(' ');
    const hasValue = value.trim().length > 0;

    return (
      <div ref={ref} className={cls} {...rest}>
        {/* ---- Header ---- */}
        <div className="ju-comment-box__header">
          <span className="ju-comment-box__title">{title}</span>
          {onClose && (
            <button
              className="ju-comment-box__close"
              onClick={onClose}
              type="button"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          )}
        </div>

        {/* ---- Existing comments ---- */}
        {comments.length > 0 && (
          <div className="ju-comment-box__comments">
            {comments.map((c) => (
              <div key={c.id} className="ju-comment-box__comment">
                <div className="ju-comment-box__comment-header">
                  {c.author.avatarSrc ? (
                    <img
                      className="ju-comment-box__avatar"
                      src={c.author.avatarSrc}
                      alt={c.author.name}
                      draggable={false}
                    />
                  ) : (
                    <span className="ju-comment-box__avatar ju-comment-box__avatar--fallback">
                      {c.author.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="ju-comment-box__author">{c.author.name}</span>
                  {c.author.verified && (
                    <span className="ju-comment-box__verified" aria-label="Verified">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#1DA1F2" />
                        <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  <span className="ju-comment-box__date">{formatDate(c.date)}</span>
                </div>
                <p className="ju-comment-box__comment-body">
                  {renderBody(c.body, users)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ---- Input area ---- */}
        <div className="ju-comment-box__input-wrap">
          <div className="ju-comment-box__input-row">
            {/* Current user avatar placeholder */}
            <span className="ju-comment-box__avatar ju-comment-box__avatar--fallback ju-comment-box__avatar--input" />

            <div className="ju-comment-box__editable-wrap">
              <div
                ref={inputRef}
                className="ju-comment-box__input"
                contentEditable
                role="textbox"
                aria-label={placeholder}
                aria-multiline="false"
                data-placeholder={placeholder}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning
              />

              {/* ---- Mention suggestions ---- */}
              {showSuggestions && filtered.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="ju-comment-box__suggestions"
                  role="listbox"
                >
                  {filtered.map((user, i) => (
                    <button
                      key={user.id}
                      className={[
                        'ju-comment-box__suggestion',
                        i === mentionIndex ? 'ju-comment-box__suggestion--active' : '',
                      ].filter(Boolean).join(' ')}
                      role="option"
                      aria-selected={i === mentionIndex}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertMention(user);
                      }}
                      onMouseEnter={() => setMentionIndex(i)}
                    >
                      {user.avatarSrc ? (
                        <img
                          className="ju-comment-box__suggestion-avatar"
                          src={user.avatarSrc}
                          alt={user.name}
                          draggable={false}
                        />
                      ) : (
                        <span className="ju-comment-box__suggestion-avatar ju-comment-box__suggestion-avatar--fallback">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="ju-comment-box__suggestion-name">{user.name}</span>
                      {user.verified && (
                        <span className="ju-comment-box__verified">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#1DA1F2" />
                            <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              className={[
                'ju-comment-box__send',
                hasValue ? 'ju-comment-box__send--active' : '',
              ].filter(Boolean).join(' ')}
              onClick={handleSubmit}
              type="button"
              aria-label="Send"
              disabled={!hasValue}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12l7-7 7 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ---- Toolbar ---- */}
        <div className="ju-comment-box__toolbar">
          <div className="ju-comment-box__actions">
            {showEmoji && (
              <button className="ju-comment-box__action" type="button" aria-label="Emoji">
                <SmilePlus size={20} strokeWidth={1.8} />
              </button>
            )}
            {showAttach && (
              <button className="ju-comment-box__action" type="button" aria-label="Attach">
                <SquarePlus size={20} strokeWidth={1.8} />
              </button>
            )}
            {showAI && (
              <button className="ju-comment-box__action ju-comment-box__action--ai" type="button" aria-label="AI assist">
                <Sparkles size={20} strokeWidth={1.8} />
              </button>
            )}
          </div>
          {showKeyboard && (
            <button className="ju-comment-box__action ju-comment-box__action--keyboard" type="button" aria-label="Keyboard">
              <Keyboard size={20} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    );
  },
);

JUCommentBox.displayName = 'JUCommentBox';
