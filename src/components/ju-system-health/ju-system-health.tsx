import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JUCard } from '../ju-card/ju-card';
import { JUPingDot } from '../ju-ping-dot/ju-ping-dot';
import './ju-system-health.css';

export interface JUSystemHealthService {
  /** Display name */
  name: string;
  /** Health-check URL (will be fetched with GET) */
  url: string;
}

export type JUServiceStatus = 'online' | 'offline' | 'checking';

export interface JUSystemHealthProps {
  /** Services to monitor */
  services?: JUSystemHealthService[];
  /** Auto-refresh interval in ms (default 30000). Set to 0 to disable. */
  interval?: number;
  /** Widget title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

const defaultServices: JUSystemHealthService[] = [
  { name: 'n8n', url: 'http://localhost:5678/healthz' },
  { name: 'Ollama', url: 'http://localhost:11434/api/version' },
  { name: 'Tailscale', url: 'http://localhost:41112/localapi/v0/status' },
];

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export const JUSystemHealth: React.FC<JUSystemHealthProps> = ({
  services = defaultServices,
  interval = 30_000,
  title = 'System Health',
  className,
}) => {
  const [statuses, setStatuses] = useState<Record<string, JUServiceStatus>>(() => {
    const init: Record<string, JUServiceStatus> = {};
    services.forEach((s) => { init[s.name] = 'checking'; });
    return init;
  });
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkAll = useCallback(async () => {
    setRefreshing(true);
    const results = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const res = await fetch(service.url, { mode: 'no-cors' });
          // no-cors returns opaque response (status 0) which is still a success
          return { name: service.name, online: res.ok || res.type === 'opaque' };
        } catch {
          return { name: service.name, online: false };
        }
      }),
    );

    const next: Record<string, JUServiceStatus> = {};
    results.forEach((r) => {
      if (r.status === 'fulfilled') {
        next[r.value.name] = r.value.online ? 'online' : 'offline';
      }
    });
    setStatuses(next);
    setRefreshing(false);
  }, [services]);

  useEffect(() => {
    checkAll();
    if (interval > 0) {
      intervalRef.current = setInterval(checkAll, interval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkAll, interval]);

  const classNames = [
    'ju-system-health',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="chat" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-system-health__header">
        <span className="ju-system-health__title">{title}</span>
        <button
          className={`ju-system-health__refresh ${refreshing ? 'ju-system-health__refresh--spin' : ''}`}
          onClick={checkAll}
          disabled={refreshing}
          aria-label="Refresh All"
        >
          <RefreshIcon />
        </button>
      </div>

      {/* Service list */}
      <ul className="ju-system-health__list">
        {services.map((service) => {
          const status = statuses[service.name] ?? 'checking';
          const dotColor = status === 'online' ? 'green' : status === 'offline' ? 'red' : 'gray';
          const pulse = status === 'online';

          return (
            <li key={service.name} className="ju-system-health__row">
              <JUPingDot
                color={dotColor}
                size={8}
                pulse={pulse}
                label={`${service.name}: ${status}`}
              />
              <span className="ju-system-health__name">{service.name}</span>
              <span className={`ju-system-health__status ju-system-health__status--${status}`}>
                {status === 'checking' ? '...' : status}
              </span>
            </li>
          );
        })}
      </ul>
    </JUCard>
  );
};
