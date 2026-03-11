import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import './ju-command-palette.css';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface JUCommandPaletteItem {
  /** Unique id */
  id: string;
  /** Display label */
  label: string;
  /** Optional description shown below label */
  description?: string;
  /** Leading icon (ReactNode) */
  icon?: React.ReactNode;
  /** Keyboard shortcut hint (e.g. "⌘N") */
  shortcut?: string;
  /** Section / group name (items are grouped by this) */
  section?: string;
  /** Extra keywords for search matching */
  keywords?: string[];
  /** Is this item disabled? */
  disabled?: boolean;
  /** Custom onSelect — overrides root onSelect */
  onSelect?: () => void;
}

export interface JUCommandPaletteProps {
  /** Controlled open state */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** All available items */
  items: JUCommandPaletteItem[];
  /** Search placeholder */
  placeholder?: string;
  /** Message when no results match */
  emptyMessage?: string;
  /** Items shown when query is empty (e.g. "recent") */
  recentItems?: JUCommandPaletteItem[];
  /** Label for the recent items section */
  recentLabel?: string;
  /** Callback when an item is selected */
  onSelect?: (item: JUCommandPaletteItem) => void;
  /** Additional CSS class on the panel */
  className?: string;
  /** Footer content (e.g. hints row) */
  footer?: React.ReactNode;
}

export interface JUCommandPaletteHandle {
  /** Focus the search input */
  focus: () => void;
}

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ReturnIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 10 4 15 9 20" />
    <path d="M20 4v7a4 4 0 0 1-4 4H4" />
  </svg>
);

/** Simple fuzzy search — matches if all query chars appear in order */
function fuzzyMatch(text: string, query: string): { match: boolean; score: number } {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  let score = 0;
  let lastMatchIdx = -1;

  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      // Bonus for consecutive matches
      if (lastMatchIdx === i - 1) score += 4;
      // Bonus for match at start
      if (i === 0) score += 6;
      // Bonus for match after separator
      if (i > 0 && /[\s\-_/.]/.test(lower[i - 1])) score += 4;
      score += 1;
      lastMatchIdx = i;
      qi++;
    }
  }

  return { match: qi === q.length, score };
}

/** Highlight matched characters */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const indices: number[] = [];
  let qi = 0;

  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) {
      indices.push(i);
      qi++;
    }
  }

  if (qi < q.length) return text;

  const parts: React.ReactNode[] = [];
  let last = 0;
  indices.forEach((idx, i) => {
    if (idx > last) parts.push(text.slice(last, idx));
    parts.push(
      <mark key={i} className="ju-cp__highlight">
        {text[idx]}
      </mark>,
    );
    last = idx + 1;
  });
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export const JUCommandPalette = forwardRef<JUCommandPaletteHandle, JUCommandPaletteProps>(
  (
    {
      open,
      onOpenChange,
      items,
      placeholder = 'Type a command or search…',
      emptyMessage = 'No results found.',
      recentItems,
      recentLabel = 'Recent',
      onSelect,
      className,
      footer,
    },
    ref,
  ) => {
    const [query, setQuery] = useState('');
    const [focusedIdx, setFocusedIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [closing, setClosing] = useState(false);

    /* ── Expose imperative handle ── */
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    /* ── Filter & score items ── */
    const filteredItems = useMemo(() => {
      if (!query.trim()) {
        // Show recent items (if any) + all items when query is empty
        return null; // signals "show default view"
      }

      const scored: { item: JUCommandPaletteItem; score: number }[] = [];
      for (const item of items) {
        const labelResult = fuzzyMatch(item.label, query);
        const descResult = item.description ? fuzzyMatch(item.description, query) : { match: false, score: 0 };
        const keywordsResult = item.keywords
          ? item.keywords.reduce(
              (best, kw) => {
                const r = fuzzyMatch(kw, query);
                return r.match && r.score > best.score ? r : best;
              },
              { match: false, score: 0 },
            )
          : { match: false, score: 0 };

        const bestScore = Math.max(
          labelResult.match ? labelResult.score : 0,
          descResult.match ? descResult.score * 0.6 : 0,
          keywordsResult.match ? keywordsResult.score * 0.8 : 0,
        );

        if (bestScore > 0) {
          scored.push({ item, score: bestScore });
        }
      }

      scored.sort((a, b) => b.score - a.score);
      return scored.map((s) => s.item);
    }, [items, query]);

    /* ── Group items by section ── */
    const groups = useMemo(() => {
      const sourceItems = filteredItems ?? recentItems ?? items;
      const map = new Map<string, JUCommandPaletteItem[]>();

      // If showing default view with recent items
      if (!filteredItems && recentItems && recentItems.length > 0) {
        map.set(recentLabel, recentItems);
        // Also show all other items grouped by section
        for (const item of items) {
          const section = item.section ?? 'Actions';
          if (!map.has(section)) map.set(section, []);
          map.get(section)!.push(item);
        }
      } else {
        for (const item of sourceItems) {
          const section = item.section ?? 'Actions';
          if (!map.has(section)) map.set(section, []);
          map.get(section)!.push(item);
        }
      }

      return map;
    }, [filteredItems, recentItems, recentLabel, items]);

    /* ── Flat list for keyboard nav ── */
    const flatItems = useMemo(() => {
      const result: JUCommandPaletteItem[] = [];
      groups.forEach((groupItems) => {
        for (const item of groupItems) {
          if (!item.disabled) result.push(item);
        }
      });
      return result;
    }, [groups]);

    /* ── Reset state when opening ── */
    useEffect(() => {
      if (open) {
        setQuery('');
        setFocusedIdx(0);
        setClosing(false);
        // Focus input after animation starts
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    }, [open]);

    /* ── Close with animation ── */
    const close = useCallback(() => {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        onOpenChange(false);
      }, 180);
    }, [onOpenChange]);

    /* ── Global keyboard shortcut ── */
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          onOpenChange(!open);
        }
        if (open && e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [open, onOpenChange, close]);

    /* ── Keyboard navigation ── */
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setFocusedIdx((i) => (i + 1) % Math.max(flatItems.length, 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setFocusedIdx((i) => (i - 1 + flatItems.length) % Math.max(flatItems.length, 1));
            break;
          case 'Enter':
            e.preventDefault();
            if (flatItems[focusedIdx]) {
              const item = flatItems[focusedIdx];
              item.onSelect?.();
              onSelect?.(item);
              close();
            }
            break;
        }
      },
      [flatItems, focusedIdx, onSelect, close],
    );

    /* ── Scroll focused item into view ── */
    useEffect(() => {
      if (!listRef.current) return;
      const el = listRef.current.querySelector('[data-focused="true"]');
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, [focusedIdx]);

    /* ── Reset focus index on filter change ── */
    useEffect(() => {
      setFocusedIdx(0);
    }, [query]);

    /* ── Select handler ── */
    const handleSelect = useCallback(
      (item: JUCommandPaletteItem) => {
        if (item.disabled) return;
        item.onSelect?.();
        onSelect?.(item);
        close();
      },
      [onSelect, close],
    );

    /* ── Backdrop click ── */
    const handleBackdropClick = useCallback(
      (e: React.MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          close();
        }
      },
      [close],
    );

    if (!open && !closing) return null;

    /* ── Build item index for focused tracking ── */
    let globalIdx = 0;

    const content = (
      <div
        className={`ju-cp__overlay ${closing ? 'ju-cp__overlay--closing' : ''}`}
        onClick={handleBackdropClick}
        role="presentation"
      >
        <div
          ref={panelRef}
          className={[
            'ju-cp__panel',
            closing ? 'ju-cp__panel--closing' : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onKeyDown={handleKeyDown}
        >
          {/* ── Search bar ── */}
          <div className="ju-cp__search">
            <span className="ju-cp__search-icon">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              className="ju-cp__input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Search commands"
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button
                className="ju-cp__clear"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                tabIndex={-1}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="10" y2="10" />
                  <line x1="10" y1="4" x2="4" y2="10" />
                </svg>
              </button>
            )}
            <kbd className="ju-cp__esc">Esc</kbd>
          </div>

          {/* ── Results ── */}
          <div className="ju-cp__results" ref={listRef} role="listbox">
            {flatItems.length === 0 && query.trim() ? (
              <div className="ju-cp__empty">
                <span className="ju-cp__empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
                <span className="ju-cp__empty-text">{emptyMessage}</span>
                <span className="ju-cp__empty-hint">Try different keywords</span>
              </div>
            ) : (
              Array.from(groups.entries()).map(([section, groupItems]) => (
                <div key={section} className="ju-cp__group">
                  <div className="ju-cp__group-label">{section}</div>
                  {groupItems.map((item) => {
                    const isFocused = flatItems[focusedIdx]?.id === item.id;
                    const idx = globalIdx++;
                    void idx; // consume to keep counter
                    return (
                      <button
                        key={item.id}
                        className={[
                          'ju-cp__item',
                          isFocused ? 'ju-cp__item--focused' : '',
                          item.disabled ? 'ju-cp__item--disabled' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        role="option"
                        aria-selected={isFocused}
                        aria-disabled={item.disabled}
                        data-focused={isFocused}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => {
                          const fi = flatItems.findIndex((fi) => fi.id === item.id);
                          if (fi >= 0) setFocusedIdx(fi);
                        }}
                        tabIndex={-1}
                      >
                        {item.icon && <span className="ju-cp__item-icon">{item.icon}</span>}
                        <span className="ju-cp__item-content">
                          <span className="ju-cp__item-label">
                            {highlightMatch(item.label, query)}
                          </span>
                          {item.description && (
                            <span className="ju-cp__item-desc">{item.description}</span>
                          )}
                        </span>
                        {item.shortcut && <kbd className="ju-cp__shortcut">{item.shortcut}</kbd>}
                        {isFocused && (
                          <span className="ju-cp__item-enter">
                            <ReturnIcon />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* ── Footer ── */}
          {footer !== undefined ? (
            <div className="ju-cp__footer">{footer}</div>
          ) : (
            <div className="ju-cp__footer">
              <span className="ju-cp__footer-hint">
                <kbd>↑↓</kbd> Navigate
              </span>
              <span className="ju-cp__footer-hint">
                <kbd>↵</kbd> Select
              </span>
              <span className="ju-cp__footer-hint">
                <kbd>Esc</kbd> Close
              </span>
            </div>
          )}
        </div>
      </div>
    );

    return createPortal(content, document.body);
  },
);

JUCommandPalette.displayName = 'JUCommandPalette';
