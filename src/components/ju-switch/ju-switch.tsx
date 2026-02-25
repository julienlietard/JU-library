import React, { useId, useState } from 'react';
import styles from './ju-switch.module.css';

export interface JUSwitchProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Default checked (uncontrolled) */
  defaultChecked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Label placement */
  labelPosition?: 'left' | 'right';
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Accent color override */
  color?: string;
  className?: string;
}

export const JUSwitch: React.FC<JUSwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  labelPosition = 'right',
  disabled = false,
  size = 'md',
  color,
  className,
}) => {
  const id = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const controlled = checked !== undefined;
  const isOn = controlled ? checked : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!controlled) setInternalChecked(next);
    onChange?.(next);
  };

  const cls = [
    styles['ju-sw'],
    styles[`ju-sw--${size}`],
    isOn ? styles['ju-sw--on'] : '',
    disabled ? styles['ju-sw--disabled'] : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const cssVars = color ? { '--ju-sw-color': color } as React.CSSProperties : undefined;

  return (
    <div className={cls} style={cssVars}>
      {label && labelPosition === 'left' && (
        <label htmlFor={id} className={styles['ju-sw__label']}>{label}</label>
      )}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        className={styles['ju-sw__track']}
        onClick={toggle}
      >
        <span className={styles['ju-sw__thumb']} />
      </button>
      {label && labelPosition === 'right' && (
        <label htmlFor={id} className={styles['ju-sw__label']}>{label}</label>
      )}
    </div>
  );
};