import React, { useState, useMemo, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { Package, X, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
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
  <div className="jusc-icon-wrap">
    <ServiceLogo sub={sub} size={size} />
    <BillingDot billing={sub.billing} />
  </div>
);

const OverflowBadge: React.FC<{ count: number }> = ({ count }) => (
  <div className="jusc-overflow">+{count}</div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Expanded Cell — morphs from the day cell in-place
// ─────────────────────────────────────────────────────────────────────────────

interface ExpandedCellProps {
  subscriptions: JUSubscription[];
  day: number;
  monthLabel: string;
  currency: string;
  locale: string;
  origin: CellRect;
  containerRect: CellRect;
  onClose: () => void;
}

const ExpandedCell: React.FC<ExpandedCellProps> = ({
  subscriptions,
  day,
  monthLabel,
  currency,
  locale,
  origin,
  containerRect,
  onClose,
}) => {
  const total = subscriptions.reduce((acc, s) => acc + s.price, 0);
  const [phase, setPhase] = useState<'entering' | 'open' | 'leaving'>('entering');
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Position relative to the calendar container
  const relTop = origin.top - containerRect.top;
  const relLeft = origin.left - containerRect.left;

  // Final expanded size
  const expandedW = Math.min(340, containerRect.width - 24);
  const expandedH = 100 + subscriptions.length * 54 + 64;

  // Compute where the expanded panel should sit (anchored to cell, clamped inside container)
  const targetLeft = Math.max(12, Math.min(relLeft, containerRect.width - expandedW - 12));
  const targetTop = Math.max(12, Math.min(relTop, containerRect.height - expandedH - 12));

  useLayoutEffect(() => {
    // Trigger enter animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('open'));
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleClose = useCallback(() => {
    setPhase('leaving');
  }, []);

  // Close after the morph-back transition completes
  useEffect(() => {
    if (phase !== 'leaving') return;
    const t = setTimeout(onClose, 500); // matches transition duration
    return () => clearTimeout(t);
  }, [phase, onClose]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (phase === 'leaving' && e.propertyName === 'width') {
      onClose();
    }
  };

  // Styles for morphing states
  const isCollapsed = phase === 'entering' || phase === 'leaving';

  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    top: isCollapsed ? relTop : targetTop,
    left: isCollapsed ? relLeft : targetLeft,
    width: isCollapsed ? origin.width : expandedW,
    height: isCollapsed ? origin.height : expandedH,
    borderRadius: isCollapsed ? 'var(--ju-radius-md)' : 'var(--ju-radius-xl)',
    overflow: 'hidden',
  };

  return (
    <>
      {/* Scrim over the calendar */}
      <div
        className={`jusc-scrim ${isCollapsed ? '' : 'jusc-scrim--visible'}`}
        onClick={handleClose}
      />
      {/* Morphing panel */}
      <div
        ref={panelRef}
        className={`jusc-expand ${phase === 'open' ? 'jusc-expand--open' : ''}`}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Inner content — fades in */}
        <div
          ref={contentRef}
          className={`jusc-expand__content ${phase === 'open' ? 'jusc-expand__content--visible' : ''}`}
        >
          {/* Header */}
          <div className="jusc-expand__head">
            <div className="jusc-expand__date">
              <span className="jusc-expand__day-num">{day}</span>
              <span className="jusc-expand__month-name">{monthLabel}</span>
            </div>
            <button className="jusc-expand__close" onClick={handleClose} aria-label="Close">
              <X size={14} strokeWidth={2.4} />
            </button>
          </div>

          {/* Subscription list */}
          <ul className="jusc-expand__list">
            {subscriptions.map((sub, i) => (
              <li
                key={sub.id}
                className={`jusc-expand__item ${phase === 'open' ? 'jusc-expand__item--in' : ''}`}
                style={{ '--jusc-i': i } as React.CSSProperties}
              >
                <IconWithDot sub={sub} size={36} />
                <div className="jusc-expand__meta">
                  <span className="jusc-expand__name">{sub.name}</span>
                  <span className="jusc-expand__billing">
                    {sub.billing === 'monthly' ? 'Monthly' : 'Yearly'}
                  </span>
                </div>
                <span className="jusc-expand__price">
                  {formatCurrency(sub.price, currency, locale)}
                </span>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div
            className={`jusc-expand__foot ${phase === 'open' ? 'jusc-expand__foot--in' : ''}`}
            style={{ '--jusc-i': subscriptions.length } as React.CSSProperties}
          >
            <div className="jusc-expand__separator" />
            <div className="jusc-expand__total">
              <span className="jusc-expand__total-label">Total</span>
              <span className="jusc-expand__total-value">
                {formatCurrency(total, currency, locale)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
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
  index: number;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  subscriptions,
  maxIcons,
  isToday,
  isActive,
  onOpen,
  index,
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
    <div
      ref={ref}
      className={cls}
      onClick={handleClick}
      style={{ '--jusc-cell-i': index } as React.CSSProperties}
    >
      {day !== null && (
        <>
          <span className="jusc-cell__num">{day}</span>
          {hasSubs && (
            <div className="jusc-cell__icons">
              {visible.map((sub) => (
                <IconWithDot key={sub.id} sub={sub} size={22} />
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
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setSlideDir('right');
    onMonthChange(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
  };

  const handleNext = () => {
    if (!onMonthChange) return;
    setSlideDir('left');
    onMonthChange(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);
  };

  useEffect(() => {
    if (!slideDir) return;
    const t = setTimeout(() => setSlideDir(null), 400);
    return () => clearTimeout(t);
  }, [slideDir, month, year]);

  const handleOpenDay = (day: number, rect: CellRect) => {
    setCellRect(rect);
    setActiveDay(day);
  };

  const handleCloseDay = () => {
    setActiveDay(null);
    setCellRect(null);
  };

  const activeSubs = activeDay !== null ? (subsByDay[activeDay] ?? []) : [];
  const subsCount = subscriptions.length;

  // Get container rect for positioning the expanded panel
  const getContainerRect = (): CellRect => {
    if (!containerRef.current) return { top: 0, left: 0, width: 780, height: 600 };
    const r = containerRef.current.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  };

  return (
    <div ref={containerRef} className={`jusc ${className}`.trim()}>
      {/* Header */}
      <header className="jusc-header">
        <div className="jusc-header__left">
          <div className="jusc-header__nav">
            {onMonthChange && (
              <button className="jusc-nav-btn" onClick={handlePrev} aria-label="Previous month">
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
            )}
            <h2 className="jusc-header__title">
              <span className="jusc-header__month-text">{monthLabel}</span>
              <span className="jusc-header__year-text">{year}</span>
            </h2>
            {onMonthChange && (
              <button className="jusc-nav-btn" onClick={handleNext} aria-label="Next month">
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="jusc-legend-row">
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
          <div className="jusc-header__stat">
            <span className="jusc-header__stat-num">{subsCount}</span>
            <span className="jusc-header__stat-label">
              {subsCount === 1 ? 'subscription' : 'subscriptions'}
            </span>
          </div>
          <div className="jusc-header__total-pill">
            <span className="jusc-header__total-value">
              {formatCurrency(monthTotal, currency, locale)}
            </span>
            <span className="jusc-header__total-suffix">/mo</span>
          </div>
        </div>
      </header>

      {/* Weekday headers */}
      <div className="jusc-weekdays">
        {DAY_LABELS.map((d) => (
          <div key={d} className="jusc-weekday">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={`jusc-grid ${slideDir ? `jusc-grid--slide-${slideDir}` : ''}`}
        key={`${year}-${month}`}
      >
        {cells.map((day, idx) => (
          <DayCell
            key={idx}
            day={day}
            subscriptions={day !== null ? (subsByDay[day] ?? []) : []}
            maxIcons={maxIconsPerCell}
            isToday={isToday(day)}
            isActive={day !== null && day === activeDay}
            onOpen={(rect) => day !== null && handleOpenDay(day, rect)}
            index={idx}
          />
        ))}
      </div>

      {/* Empty state */}
      {subscriptions.length === 0 && (
        <div className="jusc-empty">
          <CalendarDays size={32} strokeWidth={1.4} />
          <span>No subscriptions this month</span>
        </div>
      )}

      {/* Expanded cell — morphs in-place over the grid */}
      {activeDay !== null && cellRect !== null && (
        <ExpandedCell
          key={activeDay}
          subscriptions={activeSubs}
          day={activeDay}
          monthLabel={monthLabel}
          currency={currency}
          locale={locale}
          origin={cellRect}
          containerRect={getContainerRect()}
          onClose={handleCloseDay}
        />
      )}
    </div>
  );
};
