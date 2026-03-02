import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ju-tooltip.css';

/* ── Types ── */

export type JUTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface JUTooltipProps {
  /** Tooltip content (text or JSX) */
  content: React.ReactNode;
  /** Placement relative to trigger */
  placement?: JUTooltipPlacement;
  /** Delay before showing (ms) */
  delay?: number;
  /** Delay before hiding (ms) */
  hideDelay?: number;
  /** Disabled state — tooltip won't show */
  disabled?: boolean;
  /** Max width (px) */
  maxWidth?: number;
  /** Trigger element (must accept ref / mouse events) */
  children: React.ReactElement;
  /** Extra CSS class on the tooltip */
  className?: string;
}

export const JUTooltip: React.FC<JUTooltipProps> = ({
  content,
  placement = 'top',
  delay = 200,
  hideDelay = 100,
  disabled = false,
  maxWidth = 240,
  children,
  className,
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Position calculation ── */
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const tRect = trigger.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const gap = 8;

    const positions: Record<JUTooltipPlacement, { top: number; left: number }> = {
      top: {
        top: tRect.top - ttRect.height - gap,
        left: tRect.left + (tRect.width - ttRect.width) / 2,
      },
      bottom: {
        top: tRect.bottom + gap,
        left: tRect.left + (tRect.width - ttRect.width) / 2,
      },
      left: {
        top: tRect.top + (tRect.height - ttRect.height) / 2,
        left: tRect.left - ttRect.width - gap,
      },
      right: {
        top: tRect.top + (tRect.height - ttRect.height) / 2,
        left: tRect.right + gap,
      },
    };

    /* Flip if out of viewport */
    let best = placement;
    const pos = positions[placement];
    if (pos.top < 4 && placement === 'top') best = 'bottom';
    else if (pos.top + ttRect.height > window.innerHeight - 4 && placement === 'bottom') best = 'top';
    else if (pos.left < 4 && placement === 'left') best = 'right';
    else if (pos.left + ttRect.width > window.innerWidth - 4 && placement === 'right') best = 'left';

    const final = positions[best];
    /* Clamp within viewport */
    final.left = Math.max(4, Math.min(final.left, window.innerWidth - ttRect.width - 4));
    final.top = Math.max(4, Math.min(final.top, window.innerHeight - ttRect.height - 4));

    setActualPlacement(best);
    setCoords(final);
  }, [placement]);

  /* ── Show / hide with delays ── */
  const show = useCallback(() => {
    if (disabled) return;
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
    showTimer.current = setTimeout(() => setVisible(true), delay);
  }, [disabled, delay]);

  const hide = useCallback(() => {
    if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null; }
    hideTimer.current = setTimeout(() => setVisible(false), hideDelay);
  }, [hideDelay]);

  /* ── Update position when visible ── */
  useEffect(() => {
    if (visible) {
      /* Run on next frame so tooltip has rendered */
      requestAnimationFrame(updatePosition);
    }
  }, [visible, updatePosition]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  /* ── Clone child to attach events + ref ── */
  const trigger = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      children.props.onBlur?.(e);
    },
    'aria-describedby': visible ? 'ju-tooltip-content' : undefined,
  });

  return (
    <>
      {trigger}
      {visible && (
        <div
          ref={tooltipRef}
          id="ju-tooltip-content"
          role="tooltip"
          className={[
            'ju-tooltip',
            `ju-tooltip--${actualPlacement}`,
            className ?? '',
          ].filter(Boolean).join(' ')}
          style={{
            top: coords.top,
            left: coords.left,
            maxWidth,
          }}
          onMouseEnter={() => {
            /* Keep tooltip open when hovering it */
            if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
          }}
          onMouseLeave={hide}
        >
          <div className={'ju-tooltip__content'}>{content}</div>
          <div className={'ju-tooltip__arrow'} />
        </div>
      )}
    </>
  );
};