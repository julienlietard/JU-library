import React from 'react';
import './ju-ping-dot.css';

export type JUPingDotColor = 'green' | 'orange' | 'red' | 'gray' | 'blue';

export interface JUPingDotProps {
  /** Dot color */
  color?: JUPingDotColor;
  /** Size in px */
  size?: number;
  /** Animate the radar pulse */
  pulse?: boolean;
  /** Accessible label */
  label?: string;
  /** Additional CSS class */
  className?: string;
}

export const JUPingDot: React.FC<JUPingDotProps> = ({
  color = 'green',
  size = 10,
  pulse = true,
  label = 'Status indicator',
  className,
}) => {
  const classNames = [
    'ju-ping-dot',
    `ju-ping-dot--${color}`,
    pulse ? 'ju-ping-dot--pulse' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <span
      className={classNames}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    />
  );
};