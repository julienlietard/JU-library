import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-gpu-pulse.css';

export interface JUGPUPulseMetrics {
  /** VRAM usage in percent (0-100) */
  vramPercent: number;
  /** VRAM used in MB */
  vramUsed: number;
  /** Total VRAM in MB */
  vramTotal: number;
  /** GPU temperature in Celsius */
  tempCelsius: number;
}

export interface JUGPUPulseProps {
  /** FastAPI endpoint URL (e.g. http://localhost:8000/metrics/gpu) */
  endpoint: string;
  /** Polling interval in ms (default 2000) */
  interval?: number;
  /** Temperature threshold for danger state in Celsius (default 80) */
  tempThreshold?: number;
  /** Optional title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

export const JUGPUPulse: React.FC<JUGPUPulseProps> = ({
  endpoint,
  interval = 2000,
  tempThreshold = 80,
  title = 'GPU Pulse',
  className,
}) => {
  const [metrics, setMetrics] = useState<JUGPUPulseMetrics | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      const data: JUGPUPulseMetrics = await res.json();
      setMetrics(data);
      setIsLive(true);
      setError(false);
    } catch {
      setError(true);
      setIsLive(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchMetrics();
    intervalRef.current = setInterval(fetchMetrics, interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMetrics, interval]);

  const tempDanger = metrics ? metrics.tempCelsius >= tempThreshold : false;
  const vramPercent = metrics?.vramPercent ?? 0;
  const tempPercent = metrics ? Math.min((metrics.tempCelsius / 100) * 100, 100) : 0;

  const classNames = [
    'ju-gpu-pulse',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="chat" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-gpu-pulse__header">
        <span className="ju-gpu-pulse__title">{title}</span>
        <span className={`ju-gpu-pulse__live ${isLive ? 'ju-gpu-pulse__live--active' : ''}`}>
          <span className="ju-gpu-pulse__live-dot" />
          Live
        </span>
      </div>

      {/* Content */}
      <div className="ju-gpu-pulse__body">
        {error && !metrics && (
          <div className="ju-gpu-pulse__error">Connexion perdue</div>
        )}

        {/* VRAM Gauge */}
        <div className="ju-gpu-pulse__gauge">
          <div className="ju-gpu-pulse__gauge-header">
            <span className="ju-gpu-pulse__gauge-label">VRAM</span>
            <span className="ju-gpu-pulse__gauge-value">
              {metrics ? `${metrics.vramUsed} / ${metrics.vramTotal} MB` : '-- / -- MB'}
            </span>
          </div>
          <div className="ju-gpu-pulse__bar">
            <div
              className="ju-gpu-pulse__bar-fill"
              style={{ width: `${vramPercent}%` }}
              role="progressbar"
              aria-valuenow={vramPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="VRAM usage"
            />
          </div>
          <span className="ju-gpu-pulse__gauge-percent">{metrics ? `${Math.round(vramPercent)}%` : '--%'}</span>
        </div>

        {/* Temperature Gauge */}
        <div className="ju-gpu-pulse__gauge">
          <div className="ju-gpu-pulse__gauge-header">
            <span className="ju-gpu-pulse__gauge-label">Temp</span>
            <span className={`ju-gpu-pulse__gauge-value ${tempDanger ? 'ju-gpu-pulse__gauge-value--danger' : ''}`}>
              {metrics ? `${metrics.tempCelsius}°C` : '--°C'}
            </span>
          </div>
          <div className="ju-gpu-pulse__bar">
            <div
              className={`ju-gpu-pulse__bar-fill ${tempDanger ? 'ju-gpu-pulse__bar-fill--danger' : ''}`}
              style={{ width: `${tempPercent}%` }}
              role="progressbar"
              aria-valuenow={metrics?.tempCelsius ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="GPU temperature"
            />
          </div>
          <span className={`ju-gpu-pulse__gauge-percent ${tempDanger ? 'ju-gpu-pulse__gauge-percent--danger' : ''}`}>
            {metrics ? `${Math.round(tempPercent)}%` : '--%'}
          </span>
        </div>
      </div>
    </JUCard>
  );
};
