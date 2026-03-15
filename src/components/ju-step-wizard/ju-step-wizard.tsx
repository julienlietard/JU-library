import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import './ju-step-wizard.css';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type JUStepStatus = 'pending' | 'active' | 'completed' | 'error';
export type JUStepWizardVariant = 'horizontal' | 'compact';
export type JUStepWizardSize = 'sm' | 'md' | 'lg';

export interface JUStepDef {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  optional?: boolean;
}

export interface JUStepWizardProps {
  steps: JUStepDef[];
  /** Controlled active step index */
  activeStep?: number;
  /** Uncontrolled default */
  defaultActiveStep?: number;
  onStepChange?: (index: number) => void;
  /** Validate before advancing. Return false or reject to block. */
  onStepValidate?: (stepId: string, index: number) => boolean | Promise<boolean>;
  /** Must complete steps in order. @default true */
  linear?: boolean;
  variant?: JUStepWizardVariant;
  size?: JUStepWizardSize;
  /** Show a thin progress bar under the steps. @default false */
  showProgressBar?: boolean;
  /** Labels for navigation buttons */
  prevLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  /** Hide navigation buttons (if you handle navigation externally) */
  hideNav?: boolean;
  /** Called when "Finish" is clicked on the last step */
  onFinish?: () => void;
  children: React.ReactNode;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Resolve step statuses from the active index and error set */
function resolveStatus(
  index: number,
  activeIndex: number,
  completedSet: Set<number>,
  errorSet: Set<number>,
): JUStepStatus {
  if (errorSet.has(index)) return 'error';
  if (index === activeIndex) return 'active';
  if (completedSet.has(index)) return 'completed';
  return 'pending';
}

// ─────────────────────────────────────────────────────────────────────────────
// Step Indicator (circle + label)
// ─────────────────────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  step: JUStepDef;
  index: number;
  status: JUStepStatus;
  variant: JUStepWizardVariant;
  size: JUStepWizardSize;
  clickable: boolean;
  onClick: () => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  index,
  status,
  variant,
  size,
  clickable,
  onClick,
}) => {
  const cls = [
    'jusw-step',
    `jusw-step--${status}`,
    `jusw-step--${size}`,
    clickable && 'jusw-step--clickable',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={cls}
      onClick={clickable ? onClick : undefined}
      type="button"
      role="tab"
      aria-selected={status === 'active'}
      aria-current={status === 'active' ? 'step' : undefined}
      tabIndex={clickable ? 0 : -1}
      disabled={!clickable}
    >
      <span className="jusw-step__circle">
        {status === 'completed' ? (
          <svg
            className="jusw-step__check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : status === 'error' ? (
          <AlertCircle size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} strokeWidth={2} />
        ) : step.icon ? (
          <span className="jusw-step__icon">{step.icon}</span>
        ) : (
          <span className="jusw-step__number">{index + 1}</span>
        )}
      </span>
      {variant === 'horizontal' && (
        <div className="jusw-step__text">
          <span className="jusw-step__label">{step.label}</span>
          {step.description && (
            <span className="jusw-step__desc">{step.description}</span>
          )}
          {step.optional && (
            <span className="jusw-step__optional">Optional</span>
          )}
        </div>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Connector line between steps
// ─────────────────────────────────────────────────────────────────────────────

interface ConnectorProps {
  filled: boolean;
  size: JUStepWizardSize;
}

const Connector: React.FC<ConnectorProps> = ({ filled, size }) => (
  <div className={`jusw-connector jusw-connector--${size}`}>
    <div className={`jusw-connector__track`} />
    <div
      className={`jusw-connector__fill ${filled ? 'jusw-connector__fill--active' : ''}`}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const JUStepWizard: React.FC<JUStepWizardProps> = ({
  steps,
  activeStep: controlledStep,
  defaultActiveStep = 0,
  onStepChange,
  onStepValidate,
  linear = true,
  variant = 'horizontal',
  size = 'md',
  showProgressBar = false,
  prevLabel = 'Back',
  nextLabel = 'Next',
  finishLabel = 'Finish',
  hideNav = false,
  onFinish,
  children,
  className = '',
}) => {
  const isControlled = controlledStep !== undefined;
  const [internalStep, setInternalStep] = useState(defaultActiveStep);
  const current = isControlled ? controlledStep : internalStep;

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errorSteps, setErrorSteps] = useState<Set<number>>(new Set());
  const [validating, setValidating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const contentRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(current);

  // Track direction for slide animation
  useEffect(() => {
    if (current !== prevStepRef.current) {
      setDirection(current > prevStepRef.current ? 'forward' : 'backward');
      prevStepRef.current = current;
    }
  }, [current]);

  const goTo = useCallback(
    (index: number) => {
      if (!isControlled) setInternalStep(index);
      onStepChange?.(index);
    },
    [isControlled, onStepChange],
  );

  const handleNext = useCallback(async () => {
    if (current >= steps.length - 1) {
      // Last step — validate then finish
      if (onStepValidate) {
        setValidating(true);
        try {
          const ok = await onStepValidate(steps[current].id, current);
          if (!ok) {
            setErrorSteps((s) => new Set(s).add(current));
            setValidating(false);
            return;
          }
        } catch {
          setErrorSteps((s) => new Set(s).add(current));
          setValidating(false);
          return;
        }
        setValidating(false);
      }
      setCompletedSteps((s) => new Set(s).add(current));
      setErrorSteps((s) => {
        const next = new Set(s);
        next.delete(current);
        return next;
      });
      onFinish?.();
      return;
    }

    if (onStepValidate) {
      setValidating(true);
      try {
        const ok = await onStepValidate(steps[current].id, current);
        if (!ok) {
          setErrorSteps((s) => new Set(s).add(current));
          setValidating(false);
          return;
        }
      } catch {
        setErrorSteps((s) => new Set(s).add(current));
        setValidating(false);
        return;
      }
      setValidating(false);
    }

    // Mark current as completed, clear error
    setCompletedSteps((s) => new Set(s).add(current));
    setErrorSteps((s) => {
      const next = new Set(s);
      next.delete(current);
      return next;
    });
    goTo(current + 1);
  }, [current, steps, onStepValidate, goTo, onFinish]);

  const handlePrev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  const handleStepClick = useCallback(
    (index: number) => {
      if (linear) {
        // In linear mode, can only click completed steps or the next step
        if (index > current && !completedSteps.has(index) && index !== current + 1) return;
        // Can't skip ahead past current+1
        if (index > current + 1) return;
      }
      goTo(index);
    },
    [linear, current, completedSteps, goTo],
  );

  const isStepClickable = (index: number): boolean => {
    if (index === current) return false;
    if (!linear) return true;
    // In linear: can go back to completed, or go to current+1
    if (completedSteps.has(index)) return true;
    if (index === current + 1) return false; // must use Next button
    return false;
  };

  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;
  const isLast = current === steps.length - 1;

  // Get children as array
  const childArray = React.Children.toArray(children);

  const rootCls = [
    'jusw',
    `jusw--${variant}`,
    `jusw--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootCls}>
      {/* Step indicators */}
      <div className="jusw-header" role="tablist" aria-label="Steps">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            {i > 0 && (
              <Connector
                filled={completedSteps.has(i - 1) || i <= current}
                size={size}
              />
            )}
            <StepIndicator
              step={step}
              index={i}
              status={resolveStatus(i, current, completedSteps, errorSteps)}
              variant={variant}
              size={size}
              clickable={isStepClickable(i)}
              onClick={() => handleStepClick(i)}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Progress bar */}
      {showProgressBar && (
        <div className={`jusw-progress jusw-progress--${size}`}>
          <div
            className="jusw-progress__fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* Content panel */}
      <div className="jusw-content" ref={contentRef}>
        <div
          key={current}
          className={`jusw-panel jusw-panel--${direction}`}
          role="tabpanel"
          aria-label={steps[current]?.label}
        >
          {childArray[current]}
        </div>
      </div>

      {/* Navigation */}
      {!hideNav && (
        <div className="jusw-nav">
          <button
            className="jusw-nav__btn jusw-nav__btn--prev"
            onClick={handlePrev}
            disabled={current === 0}
            type="button"
          >
            <ChevronLeft size={16} strokeWidth={2} />
            {prevLabel}
          </button>
          <button
            className={`jusw-nav__btn jusw-nav__btn--next ${isLast ? 'jusw-nav__btn--finish' : ''}`}
            onClick={handleNext}
            disabled={validating}
            type="button"
          >
            {validating ? (
              <span className="jusw-nav__spinner" />
            ) : (
              <>
                {isLast ? finishLabel : nextLabel}
                {!isLast && <ChevronRight size={16} strokeWidth={2} />}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
