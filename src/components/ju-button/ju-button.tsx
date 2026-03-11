import React, { useMemo } from 'react';
import './ju-button.css';

export type JUButtonSize = 'sm' | 'md' | 'lg';
export type JUButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'outline' | 'ai' | 'danger';
export type JUButtonEffect = 'none' | 'glass' | 'aurora' | 'glow';
export type JUButtonBorder = 'none' | 'subtle' | 'bold' | 'raised' | 'accent';

export interface JUButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: JUButtonSize;
  variant?: JUButtonVariant;
  effect?: JUButtonEffect;
  /** Border style applied on top of any variant */
  borderStyle?: JUButtonBorder;
  /** Custom overrides for deep styling */
  customColors?: {
    bg?: string;
    text?: string;
    border?: string;
    glow?: string;
  };
  icon?: React.ReactNode;
  iconPlacement?: 'left' | 'right';
  /** Render as a square icon-only button (label becomes aria-label) */
  iconOnly?: boolean;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  isFullWidth?: boolean;
}

/** Utility to determine contrast */
function getContrastColor(hexColor: string): string {
  if (!hexColor || hexColor.includes('gradient')) return '#ffffff';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#111111' : '#ffffff';
}

const Spinner: React.FC = () => (
  <svg
    className="ju-button__spinner"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
    <path
      d="M14.5 8a6.5 6.5 0 00-6.5-6.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const JUButton: React.FC<JUButtonProps> = ({
  label,
  size = 'md',
  variant = 'primary',
  effect,
  borderStyle = 'none',
  customColors,
  icon,
  iconPlacement = 'left',
  iconOnly = false,
  loading = false,
  isFullWidth = false,
  disabled,
  className,
  style,
  ...rest
}) => {
  // Logic: AI variant defaults to aurora effect + magic icon
  const finalEffect = effect ?? (variant === 'ai' ? 'aurora' : 'none');
  const isDisabled = disabled || loading;

  const aiIcon = variant === 'ai' && !icon ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
  ) : icon;

  const classNames = [
    'ju-button',
    `ju-button--${size}`,
    `ju-button--${variant}`,
    `ju-effect--${finalEffect}`,
    borderStyle !== 'none' ? `ju-border--${borderStyle}` : '',
    isFullWidth ? 'ju-button--full' : '',
    iconOnly ? 'ju-button--icon-only' : '',
    loading ? 'ju-button--loading' : '',
    isDisabled ? 'ju-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const customStyle = useMemo(() => {
    if (!customColors) return style;
    return {
      ...style,
      '--ju-btn-bg': customColors.bg,
      '--ju-btn-text': customColors.text ?? (customColors.bg ? getContrastColor(customColors.bg) : undefined),
      '--ju-btn-border': customColors.border,
      '--ju-btn-glow': customColors.glow,
    } as React.CSSProperties;
  }, [customColors, style]);

  return (
    <button
      className={classNames}
      style={customStyle}
      disabled={isDisabled}
      aria-label={iconOnly ? label : undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className={`ju-button__content${loading ? ' ju-button__content--hidden' : ''}`}>
        {aiIcon && iconPlacement === 'left' && (
          <span className="ju-button__icon ju-button__icon--left">{aiIcon}</span>
        )}
        {!iconOnly && <span className="ju-button__label">{label}</span>}
        {aiIcon && iconPlacement === 'right' && (
          <span className="ju-button__icon ju-button__icon--right">{aiIcon}</span>
        )}
      </span>
      {loading && (
        <span className="ju-button__loader">
          <Spinner />
        </span>
      )}
      {/* Layer pour l'effet de brillance/glow interne */}
      <span className="ju-button__overlay" />
    </button>
  );
};