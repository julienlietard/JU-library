import React, { useEffect, useRef, useCallback } from 'react';
import './ju-modal.css';

export interface JUModalProps {
  /** Open state */
  open: boolean;
  /** On close request */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Footer actions */
  footer?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Close on backdrop click (default true) */
  closeOnBackdrop?: boolean;
  /** Close on Escape (default true) */
  closeOnEscape?: boolean;
  /** Show close button (default true) */
  showClose?: boolean;
  className?: string;
}

export const JUModal: React.FC<JUModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showClose = true,
  className,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !prevOpen.current) {
      dialog.showModal();
    } else if (!open && prevOpen.current) {
      dialog.close();
    }
    prevOpen.current = open;
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!closeOnEscape) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, closeOnEscape, onClose]);

  const onBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === dialogRef.current) onClose();
  }, [closeOnBackdrop, onClose]);

  // Prevent dialog's native cancel event
  const onCancel = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    if (closeOnEscape) onClose();
  }, [closeOnEscape, onClose]);

  const cls = [
    'ju-modal',
    `ju-modal--${size}`,
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <dialog
      ref={dialogRef}
      className={cls}
      onClick={onBackdropClick}
      onCancel={onCancel}
      aria-labelledby={title ? 'ju-modal-title' : undefined}
    >
      <div className={'ju-modal__container'}>
        {/* Header */}
        {(title || showClose) && (
          <div className={'ju-modal__header'}>
            {title && <h2 id="ju-modal-title" className={'ju-modal__title'}>{title}</h2>}
            {showClose && (
              <button className={'ju-modal__close'} onClick={onClose} aria-label="Fermer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        )}
        {/* Body */}
        <div className={'ju-modal__body'}>{children}</div>
        {/* Footer */}
        {footer && <div className={'ju-modal__footer'}>{footer}</div>}
      </div>
    </dialog>
  );
};