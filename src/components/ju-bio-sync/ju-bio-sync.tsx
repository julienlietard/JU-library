import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-bio-sync.css';

export interface JUBioSyncData {
  /** Sleep duration in hours (e.g. 7.5) */
  sleepHours: number;
  /** Step count */
  steps: number;
  /** AI-generated daily tip */
  tip: string;
}

export interface JUBioSyncProps {
  /** n8n webhook endpoint that returns Apple Health data */
  endpoint: string;
  /** Polling interval in ms (default 60000 — 1 min) */
  interval?: number;
  /** Sleep threshold below which advice turns blue (default 6) */
  sleepThreshold?: number;
  /** Step goal (default 10000) */
  stepGoal?: number;
  /** Widget title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/* ── Icons ── */

const MoonIcon = () => (
  <svg className="ju-bio-sync__icon ju-bio-sync__icon--moon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ShoeIcon = () => (
  <svg className="ju-bio-sync__icon ju-bio-sync__icon--shoe" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18h18v-2c0-1-1-2-2-2h-1l-2-5c-.3-.8-1-1.5-1.8-1.8L12 6.5C11.2 6.2 10 6 9 6.5L7 8 5 10c-1.1 1.1-2 2.9-2 4v4z" />
    <path d="M3 18c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2" />
  </svg>
);

/* ── Helpers ── */

function formatSleep(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function formatSteps(steps: number): string {
  return steps >= 1000 ? `${(steps / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(steps);
}

type TipTone = 'neutral' | 'warn-sleep' | 'warn-steps' | 'success';

function getTipTone(data: JUBioSyncData, sleepThreshold: number, stepGoal: number): TipTone {
  if (data.sleepHours >= sleepThreshold && data.steps >= stepGoal) return 'success';
  if (data.sleepHours < sleepThreshold) return 'warn-sleep';
  if (data.steps < stepGoal) return 'warn-steps';
  return 'neutral';
}

/* ── Component ── */

export const JUBioSync: React.FC<JUBioSyncProps> = ({
  endpoint,
  interval = 60_000,
  sleepThreshold = 6,
  stepGoal = 10_000,
  title = 'BioSync',
  className,
}) => {
  const [data, setData] = useState<JUBioSyncData | null>(null);
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      const json: JUBioSyncData = await res.json();
      setData(json);
      setError(false);
    } catch {
      setError(true);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchData, interval]);

  const tone: TipTone = data ? getTipTone(data, sleepThreshold, stepGoal) : 'neutral';
  const sleepPercent = data ? Math.min((data.sleepHours / 9) * 100, 100) : 0;
  const stepPercent = data ? Math.min((data.steps / stepGoal) * 100, 100) : 0;

  const classNames = [
    'ju-bio-sync',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="chat" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-bio-sync__header">
        <span className="ju-bio-sync__title">{title}</span>
        <span className="ju-bio-sync__date">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Metrics */}
      <div className="ju-bio-sync__body">
        {error && !data && (
          <div className="ju-bio-sync__error">Impossible de charger les données</div>
        )}

        {/* Sleep */}
        <div className="ju-bio-sync__metric">
          <div className="ju-bio-sync__metric-row">
            <MoonIcon />
            <div className="ju-bio-sync__metric-info">
              <span className="ju-bio-sync__metric-label">Sommeil</span>
              <span className="ju-bio-sync__metric-value">
                {data ? formatSleep(data.sleepHours) : '--h'}
              </span>
            </div>
          </div>
          <div className="ju-bio-sync__bar">
            <div
              className="ju-bio-sync__bar-fill ju-bio-sync__bar-fill--sleep"
              style={{ width: `${sleepPercent}%` }}
              role="progressbar"
              aria-valuenow={data?.sleepHours ?? 0}
              aria-valuemin={0}
              aria-valuemax={9}
              aria-label="Durée de sommeil"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="ju-bio-sync__metric">
          <div className="ju-bio-sync__metric-row">
            <ShoeIcon />
            <div className="ju-bio-sync__metric-info">
              <span className="ju-bio-sync__metric-label">Pas</span>
              <span className="ju-bio-sync__metric-value">
                {data ? formatSteps(data.steps) : '--'}
              </span>
            </div>
          </div>
          <div className="ju-bio-sync__bar">
            <div
              className="ju-bio-sync__bar-fill ju-bio-sync__bar-fill--steps"
              style={{ width: `${stepPercent}%` }}
              role="progressbar"
              aria-valuenow={data?.steps ?? 0}
              aria-valuemin={0}
              aria-valuemax={stepGoal}
              aria-label="Nombre de pas"
            />
          </div>
        </div>
      </div>

      {/* Tip */}
      {data && (
        <div className={`ju-bio-sync__tip ju-bio-sync__tip--${tone}`}>
          <span className="ju-bio-sync__tip-text">{data.tip}</span>
        </div>
      )}
    </JUCard>
  );
};
