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
  /** Custom background color (overrides variant) */
  color?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Optional icon displayed before the label */
  iconLeft?: React.ReactNode;
  /** Optional icon displayed after the label */
  iconRight?: React.ReactNode;
}

function contrastText(color: string): string {
  const hex = color.replace('#', '');
  if (!/^[0-9a-f]{3,8}$/i.test(hex)) return '#ffffff';
  const full = hex.length <= 4
    ? hex.slice(0, 3).split('').map((c) => c + c).join('')
    : hex.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#111111' : '#ffffff';
}

export const JUButton: React.FC<JUButtonProps> = ({
  label,
  size = 'm',
  variant = 'primary',
  color,
  disabled = false,
  iconLeft,
  iconRight,
  className,
  style,
  ...rest
}) => {
  const classNames = [
    'ju-button',
    `ju-button--${size}`,
    color ? 'ju-button--custom' : `ju-button--${variant}`,
    disabled ? 'ju-button--disabled' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const colorStyle = color
    ? {
        ...style,
        '--ju-btn-color': color,
        '--ju-btn-text': contrastText(color),
      } as React.CSSProperties
    : style;

  return (
    <button
      className={classNames}
      style={colorStyle}
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