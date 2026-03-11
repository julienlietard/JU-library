import React, { useState, useId } from 'react';
import './ju-input.css';

export interface JUInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Leading icon (left side) */
  icon?: React.ReactNode;
  /** Trailing icon (right side, e.g. eye toggle) */
  trailingIcon?: React.ReactNode;
  /** Handler for trailing icon click */
  onTrailingClick?: () => void;
  /** Visual error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
}

export const JUInput: React.FC<JUInputProps> = ({
  icon,
  trailingIcon,
  onTrailingClick,
  error = false,
  fullWidth = false,
  className,
  disabled,
  onFocus,
  onBlur,
  ...rest
}) => {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const cls = [
    'ju-input',
    focused ? 'ju-input--focused' : '',
    error ? 'ju-input--error' : '',
    disabled ? 'ju-input--disabled' : '',
    fullWidth ? 'ju-input--full' : '',
    icon ? 'ju-input--has-icon' : '',
    trailingIcon ? 'ju-input--has-trailing' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {icon && (
        <span className="ju-input__icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <input
        id={id}
        className="ju-input__field"
        disabled={disabled}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        aria-invalid={error || undefined}
        {...rest}
      />

      {trailingIcon && (
        <button
          type="button"
          className="ju-input__trailing"
          onClick={onTrailingClick}
          tabIndex={-1}
          aria-label="Toggle visibility"
        >
          {trailingIcon}
        </button>
      )}
    </div>
  );
};
