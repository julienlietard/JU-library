import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-git-pulse.css';

export interface JUGitCommit {
  /** Commit hash (short) */
  hash: string;
  /** Commit message */
  message: string;
  /** ISO date string */
  date: string;
  /** Author name */
  author?: string;
}

export interface JUGitPulseData {
  /** Recent commits */
  commits: JUGitCommit[];
  /**
   * Activity map: array of 7×N entries (weeks × days).
   * Each value = number of commits that day (0+).
   * Ordered chronologically, oldest first.
   */
  activity: number[];
  /** Number of consecutive days with at least 1 commit */
  streak: number;
}

export interface JUGitPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Endpoint that returns JUGitPulseData JSON */
  endpoint: string;
  /** Polling interval in ms (default 30000) */
  interval?: number;
  /** Number of weeks to display in the heatmap (default 12) */
  weeks?: number;
  /** Optional title */
  title?: string;
}

/* ---- Heatmap cell colour ---- */

function cellLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/* ---- Component ---- */

export const JUGitPulse: React.FC<JUGitPulseProps> = ({
  endpoint,
  interval = 30000,
  weeks = 12,
  title = 'Git Pulse',
  className,
  ...rest
}) => {
  const [data, setData] = useState<JUGitPulseData | null>(null);
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      const json: JUGitPulseData = await res.json();
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

  /* Build grid: 7 rows (Mon→Sun) × N weeks */
  const totalCells = weeks * 7;
  const activity = data?.activity ?? [];
  /* Pad / trim to fit the grid */
  const cells = Array.from({ length: totalCells }, (_, i) => activity[i] ?? 0);

  const cls = ['ju-git-pulse', className ?? ''].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="md" className={cls} {...rest}>
      {/* Header */}
      <div className="ju-git-pulse__header">
        <span className="ju-git-pulse__title">{title}</span>
        {data && (
          <span className="ju-git-pulse__streak">
            <span className="ju-git-pulse__streak-icon">&#x1f525;</span>
            <span className="ju-git-pulse__streak-count">{data.streak}</span>
            <span className="ju-git-pulse__streak-label">
              {data.streak === 1 ? 'jour' : 'jours'}
            </span>
          </span>
        )}
      </div>

      {/* Heatmap */}
      <div
        className="ju-git-pulse__heatmap"
        style={{ gridTemplateColumns: `repeat(${weeks}, 14px)` }}
        role="img"
        aria-label="Activité Git sur les dernières semaines"
      >
        {cells.map((count, i) => (
          <div
            key={i}
            className={`ju-git-pulse__cell ju-git-pulse__cell--l${cellLevel(count)}`}
            title={`${count} commit${count !== 1 ? 's' : ''}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="ju-git-pulse__legend">
        <span className="ju-git-pulse__legend-label">Moins</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`ju-git-pulse__cell ju-git-pulse__cell--l${l}`} />
        ))}
        <span className="ju-git-pulse__legend-label">Plus</span>
      </div>

      {/* Recent commits */}
      {data && data.commits.length > 0 && (
        <div className="ju-git-pulse__commits">
          {data.commits.slice(0, 5).map((c) => (
            <div className="ju-git-pulse__commit" key={c.hash}>
              <code className="ju-git-pulse__hash">{c.hash}</code>
              <span className="ju-git-pulse__msg">{c.message}</span>
              <span className="ju-git-pulse__date">
                {new Date(c.date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && !data && (
        <div className="ju-git-pulse__error">Connexion perdue</div>
      )}
    </JUCard>
  );
};
