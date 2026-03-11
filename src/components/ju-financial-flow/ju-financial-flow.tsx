import React from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-financial-flow.css';

/* ── Types ── */

export interface JUFinancialFlowProps {
  /** Current amount reached */
  current: number;
  /** Monthly target amount */
  goal: number;
  /** Currency symbol */
  currency?: string;
  /** Widget title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/* ── Helpers ── */

function formatAmount(value: number, currency: string): string {
  return `${currency}${value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/* ── Component ── */

export const JUFinancialFlow: React.FC<JUFinancialFlowProps> = ({
  current,
  goal,
  currency = '\u20AC',
  title = 'Financial Flow',
  className,
}) => {
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const exceeded = current >= goal;
  const remaining = Math.max(0, goal - current);
  const surplus = Math.max(0, current - goal);

  const classNames = [
    'ju-financial-flow',
    exceeded ? 'ju-financial-flow--exceeded' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="chat" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-financial-flow__header">
        <span className="ju-financial-flow__title">{title}</span>
        <span className="ju-financial-flow__ratio">
          {formatAmount(current, currency)} / {formatAmount(goal, currency)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="ju-financial-flow__bar-track">
        <div
          className="ju-financial-flow__bar-fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-label={`${Math.round(percent)}%`}
        />
      </div>

      {/* Footer */}
      <div className="ju-financial-flow__footer">
        {exceeded ? (
          <span className="ju-financial-flow__surplus">
            +{formatAmount(surplus, currency)} au-dela de l'objectif
          </span>
        ) : (
          <span className="ju-financial-flow__remaining">
            {formatAmount(remaining, currency)} restants
          </span>
        )}
        <span className="ju-financial-flow__percent">{Math.round(percent)}%</span>
      </div>
    </JUCard>
  );
};
