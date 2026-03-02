import React from 'react';
import './ju-callout.css';

export type JUCalloutVariant = 'note' | 'info' | 'warning' | 'success' | 'danger';

const DEFAULT_ICONS: Record<JUCalloutVariant, React.ReactNode> = {
  note: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  info: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  warning: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  success: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
  danger: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
};

export interface JUCalloutProps {
  /** Visual variant */
  variant?: JUCalloutVariant;
  /** Optional title */
  title?: string;
  /** Custom icon (overrides default) */
  icon?: React.ReactNode;
  /** Hide icon */
  hideIcon?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const JUCallout: React.FC<JUCalloutProps> = ({
  variant = 'note',
  title,
  icon,
  hideIcon = false,
  children,
  className,
}) => {
  const cls = [
    'ju-callout',
    `ju-callout--${variant}`,
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={cls} role="note">
      {!hideIcon && (
        <span className={'ju-callout__icon'} aria-hidden="true">
          {icon ?? DEFAULT_ICONS[variant]}
        </span>
      )}
      <div className={'ju-callout__body'}>
        {title && <strong className={'ju-callout__title'}>{title}</strong>}
        <div className={'ju-callout__text'}>{children}</div>
      </div>
    </aside>
  );
};