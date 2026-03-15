import React, { useState, useCallback } from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-workflow-trigger.css';

export interface JUWorkflowAction {
  /** Button label (shown below icon) */
  label: string;
  /** Icon element (SVG or ReactNode) */
  icon: React.ReactNode;
  /** n8n webhook URL to call on click */
  webhookUrl: string;
}

export interface JUWorkflowTriggerProps {
  /** List of workflow actions */
  actions: JUWorkflowAction[];
  /** Callback after a workflow is triggered */
  onTrigger?: (label: string, success: boolean) => void;
  /** Widget title */
  title?: string;
  /** Number of columns in the grid (default 3) */
  columns?: number;
  /** Additional CSS class */
  className?: string;
}

export const JUWorkflowTrigger: React.FC<JUWorkflowTriggerProps> = ({
  actions,
  onTrigger,
  title = 'Workflows',
  columns = 3,
  className,
}) => {
  const [loadingSet, setLoadingSet] = useState<Set<string>>(new Set());

  const handleTrigger = useCallback(async (action: JUWorkflowAction) => {
    const key = `${action.label}::${action.webhookUrl}`;
    if (loadingSet.has(key)) return;

    setLoadingSet((prev) => new Set(prev).add(key));

    let success = false;
    try {
      await fetch(action.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: action.label }),
      });
      success = true;
    } catch {
      // silent
    } finally {
      setLoadingSet((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      onTrigger?.(action.label, success);
    }
  }, [loadingSet, onTrigger]);

  const classNames = [
    'ju-workflow-trigger',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-workflow-trigger__header">
        <span className="ju-workflow-trigger__title">{title}</span>
      </div>

      {/* Grid */}
      <div
        className="ju-workflow-trigger__grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {actions.map((action) => {
          const key = `${action.label}::${action.webhookUrl}`;
          const isLoading = loadingSet.has(key);

          return (
            <button
              key={key}
              className={`ju-workflow-trigger__btn ${isLoading ? 'ju-workflow-trigger__btn--loading' : ''}`}
              onClick={() => handleTrigger(action)}
              disabled={isLoading}
              aria-label={action.label}
            >
              <span className="ju-workflow-trigger__btn-icon">
                {isLoading ? <SpinnerIcon /> : action.icon}
              </span>
              <span className="ju-workflow-trigger__btn-label">{action.label}</span>
            </button>
          );
        })}
      </div>
    </JUCard>
  );
};

/* ── Inline spinner ── */

const SpinnerIcon = () => (
  <svg className="ju-workflow-trigger__spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);
