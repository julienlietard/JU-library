import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { JUCard } from '../ju-card/ju-card';
import './ju-model-selector.css';

/* ── Types ── */

export interface JUOllamaModel {
  name: string;
  size: number; // bytes
  modified_at: string;
}

export interface JUModelSelectorProps {
  /** Ollama base URL (default http://localhost:11434) */
  ollamaUrl?: string;
  /** Callback when active model changes */
  onModelChange?: (model: string | null) => void;
  /** Widget title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/* ── Helpers ── */

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  return `${(bytes / 1e3).toFixed(0)} KB`;
}

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const EjectIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 14 22 14" />
    <rect x="2" y="18" width="20" height="3" rx="1" />
  </svg>
);

/* ── Component ── */

export const JUModelSelector: React.FC<JUModelSelectorProps> = ({
  ollamaUrl = 'http://localhost:11434',
  onModelChange,
  title = 'Model Selector',
  className,
}) => {
  const [models, setModels] = useState<JUOllamaModel[]>([]);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ejecting, setEjecting] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedIdx, setFocusedIdx] = useState(-1);

  const selectRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  /* ── Fetch model list ── */
  const fetchModels = useCallback(async () => {
    try {
      const res = await fetch(`${ollamaUrl}/api/tags`);
      const data = await res.json();
      setModels(data.models ?? []);
      setError(null);
    } catch {
      setError('Ollama injoignable');
      setModels([]);
    }
  }, [ollamaUrl]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  /* ── Position dropdown via portal ── */
  useEffect(() => {
    if (!open || !selectRef.current) {
      setDropdownPos(null);
      return;
    }
    const rect = selectRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [open]);

  /* ── Reposition on scroll / resize ── */
  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      if (!selectRef.current) return;
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open]);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        selectRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* ── Keyboard nav ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIdx((i) => (i + 1) % models.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIdx((i) => (i - 1 + models.length) % models.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIdx >= 0 && focusedIdx < models.length) {
            loadModel(models[focusedIdx].name);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          selectRef.current?.focus();
          break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, focusedIdx, models]);

  /* ── Load model ── */
  const loadModel = async (name: string) => {
    if (loading || name === activeModel) {
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(false);
    setError(null);
    try {
      await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: name, prompt: '', keep_alive: '10m' }),
      });
      setActiveModel(name);
      onModelChange?.(name);
    } catch {
      setError('Échec du chargement');
    } finally {
      setLoading(false);
    }
  };

  /* ── Eject model ── */
  const ejectModel = async () => {
    if (!activeModel || ejecting) return;
    setEjecting(true);
    setError(null);
    try {
      await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: activeModel, keep_alive: 0 }),
      });
      setActiveModel(null);
      onModelChange?.(null);
    } catch {
      setError("Échec de l'éjection");
    } finally {
      setEjecting(false);
    }
  };

  /* ── Toggle dropdown ── */
  const toggleDropdown = () => {
    if (loading) return;
    setOpen((v) => {
      if (!v) setFocusedIdx(-1);
      return !v;
    });
  };

  const activeInfo = models.find((m) => m.name === activeModel);

  const classNames = ['ju-model-selector', className ?? ''].filter(Boolean).join(' ');

  /* ── Dropdown portal ── */
  const dropdownPortal =
    open && models.length > 0 && dropdownPos
      ? createPortal(
          <ul
            className="ju-model-selector__dropdown"
            role="listbox"
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            }}
          >
            {models.map((model, idx) => (
              <li
                key={model.name}
                className={[
                  'ju-model-selector__option',
                  model.name === activeModel ? 'ju-model-selector__option--active' : '',
                  idx === focusedIdx ? 'ju-model-selector__option--focused' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role="option"
                aria-selected={model.name === activeModel}
                onClick={() => loadModel(model.name)}
              >
                <span className="ju-model-selector__option-name">{model.name}</span>
                <span className="ju-model-selector__option-size">{formatBytes(model.size)}</span>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <>
      <JUCard variant="glass" padding="none" className={classNames}>
        {/* Header */}
        <div className="ju-model-selector__header">
          <span className="ju-model-selector__title">{title}</span>
          {activeModel && <span className="ju-model-selector__active-badge">Active</span>}
        </div>

        {/* Body */}
        <div className="ju-model-selector__body">
          {error && <div className="ju-model-selector__error">{error}</div>}

          {/* Select trigger */}
          <div className="ju-model-selector__select-wrap">
            <button
              ref={selectRef}
              className={`ju-model-selector__select ${open ? 'ju-model-selector__select--open' : ''}`}
              onClick={toggleDropdown}
              disabled={loading}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              <span className="ju-model-selector__select-text">
                {loading ? 'Chargement…' : activeModel ?? 'Choisir un modèle'}
              </span>
              {activeInfo && !loading && (
                <span className="ju-model-selector__size">{formatBytes(activeInfo.size)}</span>
              )}
              <span className={`ju-model-selector__chevron ${open ? 'ju-model-selector__chevron--up' : ''}`}>
                <ChevronIcon />
              </span>
            </button>
          </div>

          {/* Eject button */}
          {activeModel && (
            <button
              className={`ju-model-selector__eject ${ejecting ? 'ju-model-selector__eject--busy' : ''}`}
              onClick={ejectModel}
              disabled={ejecting}
              aria-label="Eject model"
            >
              <EjectIcon />
              <span>{ejecting ? 'Éjection…' : 'Éjecter'}</span>
            </button>
          )}
        </div>
      </JUCard>

      {dropdownPortal}
    </>
  );
};
