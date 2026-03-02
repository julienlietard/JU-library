import React from 'react';
import './ju-button.css';

export type JUButtonSize = 's' | 'm' | 'l';
export type JUButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'glass' | 'danger';

export interface JUButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text label displayed in the button */
  label: string;
  /** Size variant */
  size?: JUButtonSize;
  /** Visual variant */
  variant?: JUButtonVariant;
  /** Disabled state */
  disabled?: boolean;
  /** Optional icon displayed before the label */
  iconLeft?: React.ReactNode;
  /** Optional icon displayed after the label */
  iconRight?: React.ReactNode;
}

export const JUButton: React.FC<JUButtonProps> = ({
  label,
  size = 'm',
  variant = 'primary',
  disabled = false,
  iconLeft,
  iconRight,
  className,
  ...rest
}) => {
  const classNames = [
    'ju-button',
    `ju-button--${size}`,
    `ju-button--${variant}`,
    disabled ? 'ju-button--disabled' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {iconLeft && <span className="ju-button__icon" aria-hidden="true">{iconLeft}</span>}
      <span>{label}</span>
      {iconRight && <span className="ju-button__icon" aria-hidden="true">{iconRight}</span>}
    </button>
  );
};