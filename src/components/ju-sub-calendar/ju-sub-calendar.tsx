import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Package, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './ju-sub-calendar.css';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type JUBillingCycle = 'monthly' | 'yearly';

export interface JUSubscription {
  id: string;
  name: string;
  logoUrl: string | null;
  iconBg?: string;
  price: number;
  billing: JUBillingCycle;
  dayOfMonth: number;
}

export interface JUSubCalendarProps {
  year: number;
  /** 0-based (0 = January, 11 = December) */
  month: number;
  subscriptions: JUSubscription[];
  /** Max visible icons per cell before "+N" badge. @default 2 */
  maxIconsPerCell?: number;
  /** Locale for month names. @default 'en-US' */
  locale?: string;
  /** Currency code for formatting. @default 'USD' */
  currency?: string;
  /** Called when month changes via navigation arrows */
  onMonthChange?: (year: number, month: number) => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstWeekday = (year: number, month: number): number => {
  const jsDay = new Date(year, month, 1).getDay();
  return (jsDay + 6) % 7;
};

const formatCurrency = (value: number, currency: string, locale: string): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

const getMonthName = (month: number, locale: string): string => {
  const d = new Date(2024, month, 1);
  return d.toLocaleDateString(locale, { month: 'long' });
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Rect of a cell, used to animate detail panel from/to cell position */
interface CellRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Atoms
// ─────────────────────────────────────────────────────────────────────────────

const ServiceLogo: React.FC<{ sub: JUSubscription; size?: number }> = ({ sub, size = 28 }) => (
  <div
    className="jusc-logo"
    style={{
      width: size,
      height: size,
      background: sub.iconBg ?? 'var(--ju-color-gray-100)',
    }}
  >
    {sub.logoUrl ? (
      <img src={sub.logoUrl} alt={sub.name} className="jusc-logo__img" />
    ) : (
      <Package size={size * 0.55} color="white" strokeWidth={1.8} />
    )}
  </div>
);

const BillingDot: React.FC<{ billing: JUBillingCycle }> = ({ billing }) => (
  <span className={`jusc-dot jusc-dot--${billing}`} />
);

const IconWithDot: React.FC<{ sub: JUSubscription; size?: number }> = ({ sub, size = 28 }) => (
  <div className="jusc-icon-dot">
    <ServiceLogo sub={sub} size={size} />
    <BillingDot billing={sub.billing} />
  </div>
);

const OverflowBadge: React.FC<{ count: number }> = ({ count }) => (
  <div className="jusc-overflow">+{count}</div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Day Detail — expands FROM the clicked cell
// ─────────────────────────────────────────────────────────────────────────────

interface DayDetailProps {
  subscriptions: JUSubscription[];
  day: number;
  monthLabel: string;
  currency: string;
  locale: string;
  origin: CellRect;
  onClose: () => void;
}

const DayDetail: React.FC<DayDetailProps> = ({
  subscriptions,
  day,
  monthLabel,
  currency,
  locale,
  origin,
  onClose,
}) => {
  const total = subscriptions.reduce((acc, s) => acc + s.price, 0);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleClose = () => {
    setClosing(true);
    const el = panelRef.current;
    if (el) {
      el.addEventListener('animationend', onClose, { once: true });
    } else {
      onClose();
    }
  };

  // Compute the CSS custom properties for the expand-from-cell animation
  const panelWidth = 380;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
  const finalW = Math.min(panelWidth, vw * 0.9);

  // Scale: cell size → panel size
  const scaleX = origin.width / finalW;
  // Estimate final height (header + rows + footer)
  const estimatedH = 80 + subscriptions.length * 52 + 60;
  const scaleY = origin.height / estimatedH;

  // Origin center relative to viewport center
  const originCX = origin.left + origin.width / 2;
  const originCY = origin.top + origin.height / 2;
  const offsetX = originCX - vw / 2;
  const offsetY = originCY - vh / 2;

  const cssVars = {
    '--jusc-origin-x': `${offsetX}px`,
    '--jusc-origin-y': `${offsetY}px`,
    '--jusc-origin-sx': scaleX,
    '--jusc-origin-sy': scaleY,
  } as React.CSSProperties;

  const stateClass = closing ? 'jusc-detail--closing' : 'jusc-detail--open';
  const overlayState = closing ? 'jusc-overlay--closing' : 'jusc-overlay--open';

  return createPortal(
    <>
      <div
        className={`jusc-overlay ${overlayState}`}
        onClick={handleClose}
      />
      <div
        ref={panelRef}
        className={`jusc-detail ${stateClass}`}
        style={cssVars}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="jusc-detail__header">
          <div className="jusc-detail__date">
            <span className="jusc-detail__day">{day}</span>
            <span className="jusc-detail__month">{monthLabel}</span>
          </div>
          <button
            className="jusc-detail__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* List */}
        <div className="jusc-detail__list">
          {subscriptions.map((sub, i) => (
            <div
              key={sub.id}
              className={`jusc-detail__row ${closing ? '' : 'jusc-detail__row--enter'}`}
              style={{ animationDelay: closing ? '0ms' : `${80 + i * 50}ms` }}
            >
              <IconWithDot sub={sub} size={36} />
              <div className="jusc-detail__info">
                <span className="jusc-detail__name">{sub.name}</span>
                <span className="jusc-detail__cycle">
                  {sub.billing === 'monthly' ? 'Monthly' : 'Yearly'}
                </span>
              </div>
              <span className="jusc-detail__price">
                {formatCurrency(sub.price, currency, locale)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className={`jusc-detail__footer ${closing ? '' : 'jusc-detail__footer--enter'}`}
          style={{ animationDelay: closing ? '0ms' : `${80 + subscriptions.length * 50}ms` }}
        >
          <div className="jusc-detail__divider" />
          <div className="jusc-detail__total">
            <span className="jusc-detail__total-label">Total</span>
            <span className="jusc-detail__total-value">
              {formatCurrency(total, currency, locale)}
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Day Cell
// ─────────────────────────────────────────────────────────────────────────────

interface DayCellProps {
  day: number | null;
  subscriptions: JUSubscription[];
  maxIcons: number;
  isToday: boolean;
  isActive: boolean;
  onOpen: (rect: CellRect) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  subscriptions,
  maxIcons,
  isToday,
  isActive,
  onOpen,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasSubs = subscriptions.length > 0;
  const visible = subscriptions.slice(0, maxIcons);
  const overflow = subscriptions.length - maxIcons;

  const handleClick = () => {
    if (!hasSubs || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    onOpen({ top: r.top, left: r.left, width: r.width, height: r.height });
  };

  const cls = [
    'jusc-cell',
    !day && 'jusc-cell--empty',
    isToday && 'jusc-cell--today',
    hasSubs && 'jusc-cell--has-subs',
    isActive && 'jusc-cell--active',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={cls} onClick={handleClick}>
      {day !== null && (
        <>
          <span className="jusc-cell__number">{day}</span>
          {hasSubs && (
            <div className="jusc-cell__icons">
              {visible.map((sub) => (
                <IconWithDot key={sub.id} sub={sub} size={24} />
              ))}
              {overflow > 0 && <OverflowBadge count={overflow} />}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const JUSubCalendar: React.FC<JUSubCalendarProps> = ({
  year,
  month,
  subscriptions,
  maxIconsPerCell = 2,
  locale = 'en-US',
  currency = 'USD',
  onMonthChange,
  className = '',
}) => {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [cellRect, setCellRect] = useState<CellRect | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstWeekday(year, month);

  const subsByDay = useMemo<Record<number, JUSubscription[]>>(() => {
    return subscriptions.reduce<Record<number, JUSubscription[]>>((map, sub) => {
      const d = sub.dayOfMonth;
      if (!map[d]) map[d] = [];
      map[d].push(sub);
      return map;
    }, {});
  }, [subscriptions]);

  const monthTotal = useMemo(
    () => subscriptions.reduce((acc, s) => acc + s.price, 0),
    [subscriptions],
  );

  const cells = useMemo<(number | null)[]>(() => {
    const base: (number | null)[] = [
      ...Array<null>(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    const rem = base.length % 7;
    if (rem !== 0) base.push(...Array<null>(7 - rem).fill(null));
    return base;
  }, [firstDay, daysInMonth]);

  const todayRef = useMemo(() => new Date(), []);
  const isToday = useCallback(
    (day: number | null) =>
      day !== null &&
      todayRef.getFullYear() === year &&
      todayRef.getMonth() === month &&
      todayRef.getDate() === day,
    [year, month, todayRef],
  );

  const monthLabel = getMonthName(month, locale);

  const handlePrev = () => {
    if (!onMonthChange) return;
    onMonthChange(
      month === 0 ? year - 1 : year,
      month === 0 ? 11 : month - 1,
    );
  };

  const handleNext = () => {
    if (!onMonthChange) return;
    onMonthChange(
      month === 11 ? year + 1 : year,
      month === 11 ? 0 : month + 1,
    );
  };

  const handleOpenDay = (day: number, rect: CellRect) => {
    setCellRect(rect);
    setActiveDay(day);
  };

  const handleCloseDay = () => {
    setActiveDay(null);
    setCellRect(null);
  };

  const activeSubs = activeDay !== null ? (subsByDay[activeDay] ?? []) : [];

  return (
    <div className={`jusc ${className}`.trim()}>
      {/* Header */}
      <header className="jusc-header">
        <div className="jusc-header__left">
          <div className="jusc-header__nav">
            {onMonthChange && (
              <button
                className="jusc-header__arrow"
                onClick={handlePrev}
                aria-label="Previous month"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
            )}
            <h2 className="jusc-header__title">
              {monthLabel} {year}
            </h2>
            {onMonthChange && (
              <button
                className="jusc-header__arrow"
                onClick={handleNext}
                aria-label="Next month"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            )}
          </div>
          <div className="jusc-header__legend">
            <span className="jusc-legend">
              <span className="jusc-legend__dot jusc-legend__dot--monthly" />
              Monthly
            </span>
            <span className="jusc-legend">
              <span className="jusc-legend__dot jusc-legend__dot--yearly" />
              Yearly
            </span>
          </div>
        </div>
        <div className="jusc-header__right">
          <span className="jusc-header__total-label">Total</span>
          <span className="jusc-header__total-value">
            {formatCurrency(monthTotal, currency, locale)}
          </span>
        </div>
      </header>

      {/* Day names */}
      <div className="jusc-grid jusc-grid--head">
        {DAY_LABELS.map((d) => (
          <div key={d} className="jusc-day-name">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="jusc-grid jusc-grid--body">
        {cells.map((day, idx) => (
          <DayCell
            key={idx}
            day={day}
            subscriptions={day !== null ? (subsByDay[day] ?? []) : []}
            maxIcons={maxIconsPerCell}
            isToday={isToday(day)}
            isActive={day !== null && day === activeDay}
            onOpen={(rect) => day !== null && handleOpenDay(day, rect)}
          />
        ))}
      </div>

      {/* Day detail modal */}
      {activeDay !== null && cellRect !== null && (
        <DayDetail
          key={activeDay}
          subscriptions={activeSubs}
          day={activeDay}
          monthLabel={monthLabel}
          currency={currency}
          locale={locale}
          origin={cellRect}
          onClose={handleCloseDay}
        />
      )}
    </div>
  );
};
