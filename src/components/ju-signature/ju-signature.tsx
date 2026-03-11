import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ju-signature.css';

export interface JUSignatureProps {
  /** Callback with the signature as a PNG data URL */
  onSave?: (dataUrl: string) => void;
  /** Trigger button label */
  label?: string;
  /** Pen stroke color */
  penColor?: string;
  /** Pen stroke width in px */
  penWidth?: number;
  /** Panel title */
  title?: string;
  /** Additional CSS class */
  className?: string;
  /** Visual variant */
  variant?: 'light' | 'dark' | 'white';
}

export const JUSignature: React.FC<JUSignatureProps> = ({
  onSave,
  label = 'Sign',
  penColor,
  penWidth = 2.5,
  title = 'Sign',
  className,
  variant = 'light',
}) => {
  // Le stylo est blanc en mode dark, et sombre en mode light/white par défaut.
  const resolvedPenColor = penColor ?? (variant === 'dark' ? '#ffffff' : '#111111');
  
  const [isOpen, setIsOpen] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);

  /* ── Click outside to close ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [isOpen]);

  /* ── Escape key ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  /* ── Canvas sizing (HiDPI) ── */
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    const timer = setTimeout(resize, 400);
    window.addEventListener('resize', resize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resize);
    };
  }, [isOpen]);

  /* ── Drawing ── */
  const getPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width / dpr),
      y: (e.clientY - rect.top) * (canvas.height / rect.height / dpr),
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      canvasRef.current?.setPointerCapture(e.pointerId);
      isDrawing.current = true;
      points.current = [getPos(e)];
    },
    [getPos],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current) return;
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const pos = getPos(e);
      points.current.push(pos);
      const pts = points.current;
      if (pts.length < 3) return;

      ctx.strokeStyle = resolvedPenColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const a = pts[pts.length - 3];
      const b = pts[pts.length - 2];
      const c = pts[pts.length - 1];
      const midA = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const midB = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };

      ctx.beginPath();
      ctx.moveTo(midA.x, midA.y);
      ctx.quadraticCurveTo(b.x, b.y, midB.x, midB.y);
      ctx.stroke();

      if (!hasStrokes) setHasStrokes(true);
    },
    [getPos, penWidth, resolvedPenColor, hasStrokes],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && points.current.length > 0 && points.current.length < 3) {
      const pt = points.current[0];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, penWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = resolvedPenColor;
      ctx.fill();
      if (!hasStrokes) setHasStrokes(true);
    }
    points.current = [];
  }, [penWidth, resolvedPenColor, hasStrokes]);

  /* ── Actions ── */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasStrokes(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave?.(canvas.toDataURL('image/png'));
    setIsOpen(false);
    setHasStrokes(false);
  }, [onSave]);

  const handleOpen = useCallback(() => {
    setHasStrokes(false);
    setIsOpen(true);
  }, []);

  /* ── Class ── */
  const containerClass = [
    'ju-sig',
    `ju-sig--${variant}`,
    isOpen ? 'ju-sig--open' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={containerRef} className={containerClass}>
      <div className="ju-sig__closed" onClick={handleOpen}>
        <svg
          className="ju-sig__closed-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        <span>{label}</span>
      </div>

      {isOpen && (
        <div className="ju-sig__content" role="dialog" aria-label={title}>
          <div className="ju-sig__header">
            <button
              type="button"
              className="ju-sig__header-btn"
              onClick={clearCanvas}
              aria-label="Clear signature"
              disabled={!hasStrokes}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>

            <span className="ju-sig__title">{title}</span>

            <button
              type="button"
              className="ju-sig__header-btn ju-sig__header-btn--close"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="ju-sig__canvas-wrap">
            <canvas
              ref={canvasRef}
              className="ju-sig__canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />
            {!hasStrokes && (
              <div className="ju-sig__hint" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
            )}
          </div>

          <button
            type="button"
            className="ju-sig__save"
            onClick={handleSave}
            disabled={!hasStrokes}
          >
            <svg
              className="ju-sig__save-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Finish Signing</span>
          </button>
        </div>
      )}
    </div>
  );
};