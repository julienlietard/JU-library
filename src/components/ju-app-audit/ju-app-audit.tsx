import React from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-app-audit.css';

export interface JUAppAuditEntry {
  /** Application name */
  name: string;
  /** Application URL or identifier */
  url?: string;
  /** Current status */
  status: 'up' | 'down';
  /** Current latency in ms */
  latency: number;
  /** Latency history for the last hour (array of ms values) */
  history: number[];
}

export interface JUAppAuditProps extends React.HTMLAttributes<HTMLDivElement> {
  /** List of applications to monitor */
  apps: JUAppAuditEntry[];
  /** Optional title */
  title?: string;
}

/* ---- Sparkline (pure SVG, no deps) ---- */

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (data.length < 2) return null;

  const w = 120;
  const h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg
      className="ju-app-audit__sparkline"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ---- Helpers ---- */

function latencyColor(ms: number): string {
  if (ms < 200) return 'var(--ju-color-success, #22c55e)';
  if (ms > 500) return 'var(--ju-color-warning, #f59e0b)';
  return 'var(--ju-color-text)';
}

function latencyClass(ms: number): string {
  if (ms < 200) return 'ju-app-audit__latency--good';
  if (ms > 500) return 'ju-app-audit__latency--slow';
  return '';
}

/* ---- Component ---- */

export const JUAppAudit: React.FC<JUAppAuditProps> = ({
  apps,
  title = 'App Audit',
  className,
  ...rest
}) => {
  const cls = ['ju-app-audit', className ?? ''].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="md" className={cls} {...rest}>
      {title && <h3 className="ju-app-audit__title">{title}</h3>}

      <div className="ju-app-audit__list" role="list">
        {apps.map((app) => (
          <div className="ju-app-audit__row" role="listitem" key={app.name}>
            {/* Status dot */}
            <span
              className={[
                'ju-app-audit__dot',
                app.status === 'up' ? 'ju-app-audit__dot--up' : 'ju-app-audit__dot--down',
              ].join(' ')}
              aria-label={app.status === 'up' ? 'Online' : 'Offline'}
            />

            {/* Name + URL */}
            <div className="ju-app-audit__info">
              <span className="ju-app-audit__name">{app.name}</span>
              {app.url && <span className="ju-app-audit__url">{app.url}</span>}
            </div>

            {/* Sparkline */}
            <Sparkline data={app.history} color={latencyColor(app.latency)} />

            {/* Latency */}
            <span
              className={[
                'ju-app-audit__latency',
                latencyClass(app.latency),
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {app.status === 'up' ? `${app.latency} ms` : '—'}
            </span>

            {/* Status label */}
            <span
              className={[
                'ju-app-audit__status',
                app.status === 'up' ? 'ju-app-audit__status--up' : 'ju-app-audit__status--down',
              ].join(' ')}
            >
              {app.status === 'up' ? 'Up' : 'Down'}
            </span>
          </div>
        ))}
      </div>
    </JUCard>
  );
};
