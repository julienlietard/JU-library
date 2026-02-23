import React from 'react';
import styles from './ju-button.module.css';

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
    styles['ju-button'],
    styles[`ju-button--${size}`],
    styles[`ju-button--${variant}`],
    disabled ? styles['ju-button--disabled'] : '',
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
      {iconLeft && <span className={styles['ju-button__icon']} aria-hidden="true">{iconLeft}</span>}
      <span>{label}</span>
      {iconRight && <span className={styles['ju-button__icon']} aria-hidden="true">{iconRight}</span>}
    </button>
  );
};