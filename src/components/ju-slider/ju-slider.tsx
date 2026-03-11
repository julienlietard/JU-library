import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
} from 'react';
import './ju-slider.css';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export type JUSliderVariant = 'default' | 'gradient' | 'minimal';
export type JUSliderSize = 'sm' | 'md' | 'lg';
export type JUSliderTooltip = 'hover' | 'always' | 'never';

export interface JUSliderMark {
  value: number;
  label?: string;
}

export interface JUSliderProps {
  /** Current value (single mode) or [min, max] (range mode) */
  value?: number | [number, number];
  /** Uncontrolled initial value */
  defaultValue?: number | [number, number];
  /** Change callback */
  onChange?: (value: number | [number, number]) => void;
  /** Minimum */
  min?: number;
  /** Maximum */
  max?: number;
  /** Step increment (0 for continuous) */
  step?: number;
  /** Range mode — two thumbs */
  range?: boolean;
  /** Format the displayed value */
  formatValue?: (v: number) => string;
  /** Visual variant */
  variant?: JUSliderVariant;
  /** Size */
  size?: JUSliderSize;
  /** Tooltip visibility mode */
  showTooltip?: JUSliderTooltip;
  /** Show marks on the track */
  marks?: boolean | number[] | JUSliderMark[];
  /** Show min/max labels at ends */
  showMinMax?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Accessible label */
  'aria-label'?: string;
  /** Accessible label for range min thumb */
  'aria-label-min'?: string;
  /** Accessible label for range max thumb */
  'aria-label-max'?: string;
}

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

function snapToStep(v: number, min: number, step: number) {
  if (!step || step <= 0) return v;
  return min + Math.round((v - min) / step) * step;
}

function pct(v: number, min: number, max: number) {
  if (max === min) return 0;
  return ((v - min) / (max - min)) * 100;
}

/** Resolve marks prop into JUSliderMark[] */
function resolveMarks(
  marks: boolean | number[] | JUSliderMark[] | undefined,
  min: number,
  max: number,
  step: number,
): JUSliderMark[] {
  if (!marks) return [];
  if (marks === true) {
    // Auto-generate marks at each step
    if (!step || step <= 0) return [];
    const result: JUSliderMark[] = [];
    for (let v = min; v <= max; v += step) {
      result.push({ value: v });
    }
    return result;
  }
  if (Array.isArray(marks)) {
    if (marks.length === 0) return [];
    if (typeof marks[0] === 'number') {
      return (marks as number[]).map((v) => ({ value: v }));
    }
    return marks as JUSliderMark[];
  }
  return [];
}

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export const JUSlider = forwardRef<HTMLDivElement, JUSliderProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      range = false,
      formatValue,
      variant = 'default',
      size = 'md',
      showTooltip = 'hover',
      marks: marksProp,
      showMinMax = false,
      disabled = false,
      className,
      'aria-label': ariaLabel,
      'aria-label-min': ariaLabelMin,
      'aria-label-max': ariaLabelMax,
    },
    ref,
  ) => {
    /* ── State ── */
    const isControlled = controlledValue !== undefined;
    const [internal, setInternal] = useState<[number, number]>(() => {
      const dv = defaultValue ?? (range ? [min, max] : min);
      if (typeof dv === 'number') return [dv, max];
      return dv;
    });

    const val: [number, number] = useMemo(() => {
      if (isControlled) {
        if (typeof controlledValue === 'number') return [controlledValue, max];
        return controlledValue;
      }
      return internal;
    }, [isControlled, controlledValue, internal, max]);

    const setVal = useCallback(
      (next: [number, number]) => {
        const clamped: [number, number] = [
          clamp(snapToStep(next[0], min, step), min, max),
          clamp(snapToStep(next[1], min, step), min, max),
        ];
        // Ensure min <= max in range mode
        if (range && clamped[0] > clamped[1]) return;

        if (!isControlled) setInternal(clamped);
        if (onChange) {
          onChange(range ? clamped : clamped[0]);
        }
      },
      [min, max, step, range, isControlled, onChange],
    );

    /* ── Refs ── */
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
    const [hovering, setHovering] = useState<'min' | 'max' | null>(null);

    /* ── Marks ── */
    const marks = useMemo(() => resolveMarks(marksProp, min, max, step), [marksProp, min, max, step]);

    /* ── Format ── */
    const fmt = useCallback(
      (v: number) => (formatValue ? formatValue(v) : String(v)),
      [formatValue],
    );

    /* ── Position calc from mouse/touch ── */
    const getValueFromEvent = useCallback(
      (clientX: number): number => {
        if (!trackRef.current) return min;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
        return min + ratio * (max - min);
      },
      [min, max],
    );

    /* ── Determine which thumb to move ── */
    const closestThumb = useCallback(
      (rawValue: number): 'min' | 'max' => {
        if (!range) return 'min';
        const distMin = Math.abs(rawValue - val[0]);
        const distMax = Math.abs(rawValue - val[1]);
        if (distMin < distMax) return 'min';
        if (distMax < distMin) return 'max';
        // Equal distance — prefer the one that won't cross
        return rawValue <= val[0] ? 'min' : 'max';
      },
      [range, val],
    );

    /* ── Pointer handlers ── */
    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        const raw = getValueFromEvent(e.clientX);
        const thumb = closestThumb(raw);
        setDragging(thumb);

        const snapped = snapToStep(clamp(raw, min, max), min, step);
        const next: [number, number] = [...val];
        next[thumb === 'min' ? 0 : 1] = snapped;
        setVal(next);

        // Capture pointer for drag
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      },
      [disabled, getValueFromEvent, closestThumb, min, max, step, val, setVal],
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragging || disabled) return;
        const raw = getValueFromEvent(e.clientX);
        const snapped = snapToStep(clamp(raw, min, max), min, step);
        const next: [number, number] = [...val];
        next[dragging === 'min' ? 0 : 1] = snapped;
        setVal(next);
      },
      [dragging, disabled, getValueFromEvent, min, max, step, val, setVal],
    );

    const handlePointerUp = useCallback(() => {
      setDragging(null);
    }, []);

    /* ── Keyboard ── */
    const handleKeyDown = useCallback(
      (thumb: 'min' | 'max') => (e: React.KeyboardEvent) => {
        if (disabled) return;
        const idx = thumb === 'min' ? 0 : 1;
        const s = step || 1;
        let next: [number, number] = [...val];

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            next[idx] = clamp(val[idx] + s, min, max);
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            next[idx] = clamp(val[idx] - s, min, max);
            break;
          case 'Home':
            e.preventDefault();
            next[idx] = min;
            break;
          case 'End':
            e.preventDefault();
            next[idx] = max;
            break;
          default:
            return;
        }
        setVal(next);
      },
      [disabled, val, step, min, max, setVal],
    );

    /* ── Cleanup pointer on unmount ── */
    useEffect(() => {
      const up = () => setDragging(null);
      window.addEventListener('pointerup', up);
      return () => window.removeEventListener('pointerup', up);
    }, []);

    /* ── Tooltip visibility ── */
    const tooltipVisible = (thumb: 'min' | 'max') => {
      if (showTooltip === 'always') return true;
      if (showTooltip === 'never') return false;
      return dragging === thumb || hovering === thumb;
    };

    /* ── Compute positions ── */
    const p0 = pct(val[0], min, max);
    const p1 = pct(val[1], min, max);
    const fillLeft = range ? Math.min(p0, p1) : 0;
    const fillWidth = range ? Math.abs(p1 - p0) : p0;

    /* ── Classes ── */
    const rootCls = [
      'ju-slider',
      `ju-slider--${variant}`,
      `ju-slider--${size}`,
      disabled ? 'ju-slider--disabled' : '',
      dragging ? 'ju-slider--dragging' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    /* ── Thumb renderer ── */
    const renderThumb = (thumb: 'min' | 'max', position: number, value: number) => {
      const isActive = dragging === thumb;
      const label = thumb === 'min' ? (ariaLabelMin || ariaLabel || 'Slider value') : (ariaLabelMax || 'Slider max value');

      return (
        <div
          className={[
            'ju-slider__thumb-wrap',
            isActive ? 'ju-slider__thumb-wrap--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ left: `${position}%` }}
          onMouseEnter={() => setHovering(thumb)}
          onMouseLeave={() => setHovering(null)}
        >
          {/* Tooltip */}
          {tooltipVisible(thumb) && (
            <div className="ju-slider__tooltip">
              <span className="ju-slider__tooltip-text">{fmt(value)}</span>
              <span className="ju-slider__tooltip-arrow" />
            </div>
          )}

          {/* Thumb */}
          <div
            className={[
              'ju-slider__thumb',
              isActive ? 'ju-slider__thumb--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={fmt(value)}
            aria-label={label}
            aria-disabled={disabled}
            onKeyDown={handleKeyDown(thumb)}
          />
        </div>
      );
    };

    return (
      <div ref={ref} className={rootCls}>
        {/* Min/Max labels */}
        {showMinMax && (
          <span className="ju-slider__label ju-slider__label--min">{fmt(min)}</span>
        )}

        {/* Track area */}
        <div className="ju-slider__track-area">
          <div
            ref={trackRef}
            className="ju-slider__track"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Fill */}
            <div
              className="ju-slider__fill"
              style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
            />

            {/* Marks */}
            {marks.length > 0 && (
              <div className="ju-slider__marks">
                {marks.map((m) => {
                  const mp = pct(m.value, min, max);
                  const isFilled = range
                    ? m.value >= val[0] && m.value <= val[1]
                    : m.value <= val[0];
                  return (
                    <div
                      key={m.value}
                      className={[
                        'ju-slider__mark',
                        isFilled ? 'ju-slider__mark--filled' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ left: `${mp}%` }}
                    />
                  );
                })}
              </div>
            )}

            {/* Thumbs */}
            {range && renderThumb('min', p0, val[0])}
            {renderThumb(range ? 'max' : 'min', range ? p1 : p0, range ? val[1] : val[0])}
          </div>

          {/* Mark labels (below track) */}
          {marks.some((m) => m.label) && (
            <div className="ju-slider__mark-labels">
              {marks
                .filter((m) => m.label)
                .map((m) => (
                  <span
                    key={m.value}
                    className="ju-slider__mark-label"
                    style={{ left: `${pct(m.value, min, max)}%` }}
                  >
                    {m.label}
                  </span>
                ))}
            </div>
          )}
        </div>

        {showMinMax && (
          <span className="ju-slider__label ju-slider__label--max">{fmt(max)}</span>
        )}
      </div>
    );
  },
);

JUSlider.displayName = 'JUSlider';
