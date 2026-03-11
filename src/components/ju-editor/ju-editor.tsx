import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ju-editor.css';

/* ============================================
   Types
   ============================================ */

export type JUEditorFontFamily = 'System' | 'Serif' | 'Mono' | 'Inter' | 'Georgia';
export type JUEditorFontSize = 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32;

export interface JUEditorProps {
  /** Controlled HTML content */
  value?: string;
  /** Default HTML content (uncontrolled) */
  defaultValue?: string;
  /** Change handler — returns HTML string */
  onChange?: (html: string) => void;
  /** Placeholder text shown when editor is empty */
  placeholder?: string;
  /** Minimum height of the editable area */
  minHeight?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Available font families */
  fontFamilies?: JUEditorFontFamily[];
  /** Available font sizes (px) */
  fontSizes?: JUEditorFontSize[];
  /** Preset colors for the color picker */
  colors?: string[];
  className?: string;
}

/* ============================================
   Constants
   ============================================ */

const FONT_FAMILY_MAP: Record<JUEditorFontFamily, string> = {
  System: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  Serif: 'Georgia, "Times New Roman", serif',
  Mono: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
  Inter: '"Inter", -apple-system, sans-serif',
  Georgia: '"Georgia", serif',
};

const DEFAULT_FONTS: JUEditorFontFamily[] = ['System', 'Serif', 'Mono'];
const DEFAULT_SIZES: JUEditorFontSize[] = [12, 14, 16, 18, 20, 24];
const DEFAULT_COLORS = [
  '#1b82ff', '#000000', '#374151', '#dc2626',
  '#16a34a', '#d97706', '#7c3aed', '#db2777',
];

/* ============================================
   Helpers
   ============================================ */

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fontName: string;
  fontSize: string;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  foreColor: string;
}

const INITIAL_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  fontName: '',
  fontSize: '',
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  foreColor: '',
};

/** Normalise browser color format (rgb → hex) */
function rgbToHex(rgb: string): string {
  const m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!m) return rgb;
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hex(+m[1])}${hex(+m[2])}${hex(+m[3])}`;
}

/** Get display name for detected font */
function fontDisplayName(raw: string, families: JUEditorFontFamily[]): string {
  const lower = raw.toLowerCase().replace(/"/g, '');
  for (const f of families) {
    if (lower.includes(f.toLowerCase())) return f;
    const mapped = FONT_FAMILY_MAP[f].toLowerCase().replace(/"/g, '');
    if (mapped.includes(lower) || lower.includes(mapped.split(',')[0].trim())) return f;
  }
  return families[0] ?? 'System';
}

/**
 * Convert execCommand fontSize value (1-7) to approximate px,
 * or return the value if already in px. Returns display string like "16".
 */
const FONT_SIZE_MAP: Record<string, string> = {
  '1': '10', '2': '13', '3': '16', '4': '18', '5': '24', '6': '32', '7': '48',
};

function normalizeFontSize(raw: string): string {
  if (!raw) return '';
  // execCommand returns "1"-"7"
  if (FONT_SIZE_MAP[raw]) return FONT_SIZE_MAP[raw];
  // Sometimes returns "16px" or just a number
  const n = parseInt(raw, 10);
  if (!isNaN(n) && n > 7) return String(n);
  return '';
}

/** Get the actual computed font-size from the current selection node */
function getComputedFontSize(): string {
  try {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '';
    let node: Node | null = sel.anchorNode;
    if (node?.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (node && node instanceof HTMLElement) {
      const computed = window.getComputedStyle(node).fontSize;
      return parseInt(computed, 10).toString();
    }
  } catch { /* ignore */ }
  return '';
}

/* ============================================
   SVG Icons (inline, no deps)
   ============================================ */

const AlignLeftIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16">
    <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16">
    <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const AlignRightIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16">
    <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ============================================
   Component
   ============================================ */

export const JUEditor: React.FC<JUEditorProps> = ({
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Start writing...',
  minHeight = 200,
  disabled = false,
  fontFamilies = DEFAULT_FONTS,
  fontSizes = DEFAULT_SIZES,
  colors = DEFAULT_COLORS,
  className,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const [internalHtml, setInternalHtml] = useState(defaultValue);
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>(INITIAL_FORMATS);
  const [openDropdown, setOpenDropdown] = useState<'font' | 'size' | 'color' | null>(null);

  const controlled = value !== undefined;

  /* --- Active format detection --- */
  const updateActiveFormats = useCallback(() => {
    try {
      const rawSize = document.queryCommandValue('fontSize') ?? '';
      const normalizedSize = normalizeFontSize(rawSize) || getComputedFontSize();
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        fontName: document.queryCommandValue('fontName') ?? '',
        fontSize: normalizedSize,
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        foreColor: rgbToHex(document.queryCommandValue('foreColor') ?? ''),
      });
    } catch {
      // queryCommandState can throw in some environments
    }
  }, []);

  /* --- Selection save / restore (for dropdown interactions) --- */
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const range = savedSelectionRef.current;
    if (range) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      savedSelectionRef.current = null;
    }
  }, []);

  /* --- Emit change --- */
  const emitChange = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    if (!controlled) setInternalHtml(html);
    onChange?.(html);
  }, [controlled, onChange]);

  /* --- Format command --- */
  const execFormat = useCallback((command: string, val?: string) => {
    restoreSelection();
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    updateActiveFormats();
    emitChange();
  }, [restoreSelection, updateActiveFormats, emitChange]);

  /* --- Font size (custom px via font-size workaround) --- */
  const applyFontSize = useCallback((sizePx: number) => {
    restoreSelection();
    document.execCommand('fontSize', false, '7');
    const editor = editorRef.current;
    if (!editor) return;
    const fontEls = editor.querySelectorAll('font[size="7"]');
    fontEls.forEach((el) => {
      const span = document.createElement('span');
      span.style.fontSize = `${sizePx}px`;
      span.innerHTML = el.innerHTML;
      el.replaceWith(span);
    });
    editorRef.current?.focus();
    updateActiveFormats();
    emitChange();
  }, [restoreSelection, updateActiveFormats, emitChange]);

  /* --- Selection change → update active formats --- */
  const handleSelectionChange = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  /* --- Input handler --- */
  const handleInput = useCallback(() => {
    emitChange();
    updateActiveFormats();
  }, [emitChange, updateActiveFormats]);

  /* --- Keyboard shortcuts --- */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key === 'b') { e.preventDefault(); execFormat('bold'); }
    if (mod && e.key === 'i') { e.preventDefault(); execFormat('italic'); }
    if (mod && e.key === 'u') { e.preventDefault(); execFormat('underline'); }
  }, [execFormat]);

  /* --- Init default content --- */
  useEffect(() => {
    if (editorRef.current && defaultValue && !controlled) {
      editorRef.current.innerHTML = defaultValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- Sync controlled value --- */
  useEffect(() => {
    if (controlled && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value ?? '';
    }
  }, [value, controlled]);

  /* --- Close dropdown on outside click --- */
  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openDropdown]);

  /* --- Derived values --- */
  const currentFont = fontDisplayName(activeFormats.fontName, fontFamilies);
  const currentColor = activeFormats.foreColor || colors[0] || '#000000';

  const cls = [
    'ju-ed',
    disabled ? 'ju-ed--disabled' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      {/* --- Editable content --- */}
      <div
        ref={editorRef}
        className="ju-ed__content"
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        style={{ minHeight }}
        role="textbox"
        aria-multiline="true"
        aria-label="Rich text editor"
        data-placeholder={placeholder}
      />

      {/* --- Toolbar (always visible below content) --- */}
      <div
        ref={toolbarRef}
        className="ju-ed__toolbar"
        role="toolbar"
        aria-label="Formatting"
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* Font family */}
        <div className="ju-ed__dropdown">
          <button
            className="ju-ed__dropdown-trigger"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              setOpenDropdown(openDropdown === 'font' ? null : 'font');
            }}
            aria-haspopup="listbox"
            aria-expanded={openDropdown === 'font'}
            aria-label="Font family"
          >
            <span>{currentFont}</span>
            <svg className="ju-ed__dropdown-chevron" viewBox="0 0 10 10">
              <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
          {openDropdown === 'font' && (
            <div className="ju-ed__dropdown-panel" role="listbox">
              {fontFamilies.map((f) => (
                <button
                  key={f}
                  className={`ju-ed__dropdown-option ${currentFont === f ? 'ju-ed__dropdown-option--active' : ''}`}
                  style={{ fontFamily: FONT_FAMILY_MAP[f] }}
                  role="option"
                  aria-selected={currentFont === f}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execFormat('fontName', FONT_FAMILY_MAP[f]);
                    setOpenDropdown(null);
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font size */}
        <div className="ju-ed__dropdown">
          <button
            className="ju-ed__dropdown-trigger"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              setOpenDropdown(openDropdown === 'size' ? null : 'size');
            }}
            aria-haspopup="listbox"
            aria-expanded={openDropdown === 'size'}
            aria-label="Font size"
          >
            <span>{activeFormats.fontSize || '16'}px</span>
            <svg className="ju-ed__dropdown-chevron" viewBox="0 0 10 10">
              <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
          {openDropdown === 'size' && (
            <div className="ju-ed__dropdown-panel" role="listbox">
              {fontSizes.map((s) => (
                <button
                  key={s}
                  className={`ju-ed__dropdown-option ${activeFormats.fontSize === String(s) ? 'ju-ed__dropdown-option--active' : ''}`}
                  role="option"
                  aria-selected={activeFormats.fontSize === String(s)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyFontSize(s);
                    setOpenDropdown(null);
                  }}
                >
                  {s}px
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color */}
        <div className="ju-ed__dropdown ju-ed__dropdown--color">
          <button
            className="ju-ed__dropdown-trigger"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              setOpenDropdown(openDropdown === 'color' ? null : 'color');
            }}
            aria-haspopup="listbox"
            aria-expanded={openDropdown === 'color'}
            aria-label="Text color"
          >
            <span
              className="ju-ed__color-dot"
              style={{ backgroundColor: currentColor }}
            />
          </button>
          {openDropdown === 'color' && (
            <div className="ju-ed__dropdown-panel" role="listbox">
              <div className="ju-ed__color-grid">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`ju-ed__color-swatch ${currentColor === c ? 'ju-ed__color-swatch--active' : ''}`}
                    style={{ backgroundColor: c }}
                    role="option"
                    aria-selected={currentColor === c}
                    aria-label={`Color ${c}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      execFormat('foreColor', c);
                      setOpenDropdown(null);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ju-ed__separator" />

        {/* Bold */}
        <button
          className={`ju-ed__btn ju-ed__btn--bold ${activeFormats.bold ? 'ju-ed__btn--active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); execFormat('bold'); }}
          aria-pressed={activeFormats.bold}
          aria-label="Bold"
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        {/* Italic */}
        <button
          className={`ju-ed__btn ju-ed__btn--italic ${activeFormats.italic ? 'ju-ed__btn--active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); execFormat('italic'); }}
          aria-pressed={activeFormats.italic}
          aria-label="Italic"
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        {/* Underline */}
        <button
          className={`ju-ed__btn ju-ed__btn--underline ${activeFormats.underline ? 'ju-ed__btn--active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); execFormat('underline'); }}
          aria-pressed={activeFormats.underline}
          aria-label="Underline"
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        <div className="ju-ed__separator" />

        {/* Alignment group */}
        <div className="ju-ed__group">
          <button
            className={`ju-ed__btn ${activeFormats.justifyLeft ? 'ju-ed__btn--active' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); execFormat('justifyLeft'); }}
            aria-pressed={activeFormats.justifyLeft}
            aria-label="Align left"
            title="Align left"
          >
            <AlignLeftIcon />
          </button>
          <button
            className={`ju-ed__btn ${activeFormats.justifyCenter ? 'ju-ed__btn--active' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); execFormat('justifyCenter'); }}
            aria-pressed={activeFormats.justifyCenter}
            aria-label="Align center"
            title="Align center"
          >
            <AlignCenterIcon />
          </button>
          <button
            className={`ju-ed__btn ${activeFormats.justifyRight ? 'ju-ed__btn--active' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); execFormat('justifyRight'); }}
            aria-pressed={activeFormats.justifyRight}
            aria-label="Align right"
            title="Align right"
          >
            <AlignRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
