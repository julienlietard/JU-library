import React, { useState, useId } from 'react';
import styles from './ju-text-field.module.css';

export interface JUTextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint / helper text */
  hint?: string;
  /** Leading icon */
  icon?: React.ReactNode;
  /** Use textarea instead of input */
  multiline?: boolean;
  /** Number of rows for multiline */
  rows?: number;
  /** Floating label behavior (default true) */
  floatingLabel?: boolean;
  /** Full-width */
  fullWidth?: boolean;
  className?: string;
}

export const JUTextField: React.FC<JUTextFieldProps> = ({
  label,
  error,
  hint,
  icon,
  multiline = false,
  rows = 4,
  floatingLabel = true,
  fullWidth = false,
  className,
  disabled,
  value,
  defaultValue,
  ...rest
}) => {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [internalVal, setInternalVal] = useState(defaultValue ?? '');
  const controlled = value !== undefined;
  const currentVal = controlled ? value : internalVal;
  const hasValue = String(currentVal).length > 0;
  const elevated = focused || hasValue || !floatingLabel;

  const cls = [
    styles['ju-tf'],
    error ? styles['ju-tf--error'] : '',
    disabled ? styles['ju-tf--disabled'] : '',
    focused ? styles['ju-tf--focused'] : '',
    fullWidth ? styles['ju-tf--full'] : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const inputProps = {
    id,
    className: styles['ju-tf__input'],
    disabled,
    value: controlled ? value : undefined,
    defaultValue: controlled ? undefined : defaultValue,
    onFocus: (e: any) => { setFocused(true); rest.onFocus?.(e); },
    onBlur: (e: any) => { setFocused(false); rest.onBlur?.(e); },
    onChange: (e: any) => { if (!controlled) setInternalVal(e.target.value); rest.onChange?.(e); },
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined,
    ...rest,
  };

  return (
    <div className={cls}>
      <div className={styles['ju-tf__wrapper']}>
        {icon && <span className={styles['ju-tf__icon']} aria-hidden="true">{icon}</span>}
        {multiline ? <textarea {...inputProps} rows={rows} /> : <input {...inputProps} />}
        {label && (
          <label
            htmlFor={id}
            className={`${styles['ju-tf__label']} ${elevated ? styles['ju-tf__label--up'] : ''}`}
          >
            {label}
          </label>
        )}
        <div className={styles['ju-tf__border']} />
      </div>
      {error && <span id={`${id}-err`} className={styles['ju-tf__error']} role="alert">{error}</span>}
      {!error && hint && <span id={`${id}-hint`} className={styles['ju-tf__hint']}>{hint}</span>}
    </div>
  );
};