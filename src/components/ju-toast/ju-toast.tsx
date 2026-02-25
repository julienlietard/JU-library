import React, { useEffect, useState, useCallback } from 'react';
import styles from './ju-toast.module.css';

export type JUToastVariant = 'info' | 'success' | 'warning' | 'error';
export type JUToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface JUToastData {
  id: string;
  message: string;
  variant?: JUToastVariant;
  duration?: number;
}

export interface JUToastProps {
  /** Toast data */
  toast: JUToastData;
  /** On dismiss */
  onDismiss: (id: string) => void;
  /** Position */
  position?: JUToastPosition;
}

const ICONS: Record<JUToastVariant, React.ReactNode> = {
  info: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  success: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  warning: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  error: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
};

export const JUToast: React.FC<JUToastProps> = ({
  toast,
  onDismiss,
}) => {
  const [exiting, setExiting] = useState(false);
  const variant = toast.variant ?? 'info';
  const duration = toast.duration ?? 4000;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  const cls = [
    styles['ju-toast'],
    styles[`ju-toast--${variant}`],
    exiting ? styles['ju-toast--exit'] : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls} role="alert">
      <span className={styles['ju-toast__icon']}>{ICONS[variant]}</span>
      <span className={styles['ju-toast__msg']}>{toast.message}</span>
      <button className={styles['ju-toast__close']} onClick={dismiss} aria-label="Fermer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
};

/* ── Toast Container (manages stack) ── */

export interface JUToastContainerProps {
  /** Active toasts */
  toasts: JUToastData[];
  /** On dismiss */
  onDismiss: (id: string) => void;
  /** Position */
  position?: JUToastPosition;
}

export const JUToastContainer: React.FC<JUToastContainerProps> = ({
  toasts,
  onDismiss,
  position = 'bottom-right',
}) => {
  return (
    <div className={`${styles['ju-toast-container']} ${styles[`ju-toast-container--${position}`]}`}>
      {toasts.map((t) => (
        <JUToast key={t.id} toast={t} onDismiss={onDismiss} position={position} />
      ))}
    </div>
  );
};