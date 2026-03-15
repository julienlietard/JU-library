import React, { useEffect, useRef, useState, useCallback } from 'react';
import './ju-stat-card.css';

export type JUStatCardVariant = 'default' | 'glass' | 'gradient';
export type JUStatCardSize = 'sm' | 'md' | 'lg';

export interface JUStatCardTrend {
  /** Trend percentage value (positive = up, negative = down) */
  value: number;
  /** Optional label like "vs last month" */
  label?: string;
}

export interface JUStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main numeric value */
  value: number;
  /** Previous value for automatic delta calculation */
  previousValue?: number;
  /** Descriptive label */
  label: string;
  /** Optional subtitle / secondary info */
  subtitle?: string;
  /** Decorative icon */
  icon?: React.ReactNode;
  /** Icon circle background color */
  iconColor?: string;
  /** Array of data points for mini sparkline chart */
  sparklineData?: number[];
  /** Override trend (instead of auto-calculated from previousValue) */
  trend?: JUStatCardTrend;
  /** Custom value formatter */
  formatValue?: (v: number) => string;
  /** Visual variant */
  variant?: JUStatCardVariant;
  /** Card size */
  size?: JUStatCardSize;
  /** Enable count-up and sparkline animations (default true) */
  animated?: boolean;
}

/* ── helpers ─────────────────────────────────────────── */

function useCountUp(
  target: number,
  animated: boolean,
  duration = 800,
) {
  const [display, setDisplay] = useState(animated ? 0 : target);
  const rafRef = useRef<number>(0);
  const prevTarget = useRef(target);

  const animate = useCallback(
    (from: number, to: number) => {
      if (!animated) {
        setDisplay(to);
        return;
      }
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(from + (to - from) * eased);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    },
    [animated, duration],
  );

  useEffect(() => {
    animate(prevTarget.current !== target ? prevTarget.current : 0, target);
    prevTarget.current = target;
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, animate]);

  return display;
}

function defaultFormat(v: number): string {
  if (Number.isInteger(v)) return v.toLocaleString('fr-FR');
  return v.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
}

/* ── sparkline ───────────────────────────────────────── */

interface SparklineProps {
  data: number[];
  color: string;
  animated: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, color, animated }) => {
  const pathRef = useRef<SVGPathElement>(null);

  if (data.length < 2) return null;

  const width = 100;
  const height = 32;
  const padding = 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (v - min) / range) * (height - padding * 2),
  }));

  const d = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  const areaD = `${d} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  return (
    <svg
      className="ju-stat-card__sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-fill-${color.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill={`url(#spark-fill-${color.replace(/[^a-zA-Z0-9]/g, '')})`}
      />
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'ju-stat-card__sparkline-stroke' : undefined}
      />
    </svg>
  );
};

/* ── main component ──────────────────────────────────── */

export const JUStatCard: React.FC<JUStatCardProps> = ({
  value,
  previousValue,
  label,
  subtitle,
  icon,
  iconColor = 'var(--ju-color-primary, #1b82ff)',
  sparklineData,
  trend,
  formatValue,
  variant = 'default',
  size = 'md',
  animated = true,
  className,
  style,
  ...rest
}) => {
  const displayValue = useCountUp(value, animated);
  const formatter = formatValue ?? defaultFormat;

  // Compute trend
  const computedTrend: JUStatCardTrend | null = trend
    ? trend
    : previousValue != null && previousValue !== 0
      ? { value: ((value - previousValue) / Math.abs(previousValue)) * 100 }
      : null;

  const trendPositive = computedTrend ? computedTrend.value >= 0 : null;
  const sparkColor = trendPositive === false
    ? 'var(--ju-color-danger, #ef4444)'
    : 'var(--ju-color-primary, #1b82ff)';

  const classNames = [
    'ju-stat-card',
    `ju-stat-card--${variant}`,
    `ju-stat-card--${size}`,
    className ?? '',
  ].filter(Boolean).join(' ');

  const customStyle: React.CSSProperties = {
    ...style,
    ...(iconColor ? { '--_stat-icon-color': iconColor } as React.CSSProperties : {}),
  };

  return (
    <div className={classNames} style={customStyle} {...rest}>
      {/* Header row: icon + trend */}
      <div className="ju-stat-card__header">
        {icon && (
          <span className="ju-stat-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {computedTrend && (
          <span
            className={[
              'ju-stat-card__trend',
              trendPositive ? 'ju-stat-card__trend--up' : 'ju-stat-card__trend--down',
            ].join(' ')}
          >
            <span className="ju-stat-card__trend-arrow" aria-hidden="true">
              {trendPositive ? '↑' : '↓'}
            </span>
            {Math.abs(computedTrend.value).toFixed(1)}%
            {computedTrend.label && (
              <span className="ju-stat-card__trend-label">{computedTrend.label}</span>
            )}
          </span>
        )}
      </div>

      {/* Value */}
      <span className="ju-stat-card__value">
        {formatter(animated ? displayValue : value)}
      </span>

      {/* Label + subtitle */}
      <span className="ju-stat-card__label">{label}</span>
      {subtitle && <span className="ju-stat-card__subtitle">{subtitle}</span>}

      {/* Sparkline */}
      {sparklineData && sparklineData.length >= 2 && (
        <Sparkline data={sparklineData} color={sparkColor} animated={animated} />
      )}
    </div>
  );
};
