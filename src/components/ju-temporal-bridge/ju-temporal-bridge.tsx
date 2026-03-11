import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JUCard } from '../ju-card/ju-card';
import { JUButton } from '../ju-button/ju-button';
import './ju-temporal-bridge.css';

/* ── Types ── */

export interface JUMeeting {
  /** Unique identifier */
  id: string;
  /** Meeting title */
  title: string;
  /** ISO 8601 start date-time */
  startAt: string;
  /** Optional context / description sent to AI for brief generation */
  context?: string;
}

export interface JUTemporalBridgeProps {
  /** Upcoming meetings sorted by date (first = next) */
  meetings: JUMeeting[];
  /** n8n webhook URL for AI brief generation */
  webhookUrl: string;
  /** Callback when AI brief is received */
  onBrief?: (meetingId: string, brief: string) => void;
  /** Widget title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/* ── Helpers ── */

interface TimeLeft {
  total: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    total: diff,
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SparkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

/* ── Component ── */

export const JUTemporalBridge: React.FC<JUTemporalBridgeProps> = ({
  meetings,
  webhookUrl,
  onBrief,
  title = 'Temporal Bridge',
  className,
}) => {
  const nextMeeting = meetings.find((m) => new Date(m.startAt).getTime() > Date.now()) ?? null;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    nextMeeting ? computeTimeLeft(nextMeeting.startAt) : { total: 0, hours: 0, minutes: 0, seconds: 0 },
  );
  const [preparing, setPreparing] = useState(false);
  const [briefText, setBriefText] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Tick every second ── */
  useEffect(() => {
    if (!nextMeeting) return;

    const tick = () => setTimeLeft(computeTimeLeft(nextMeeting.startAt));
    tick();
    timerRef.current = setInterval(tick, 1_000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextMeeting]);

  /* ── Prepare brief ── */
  const handlePrepare = useCallback(async () => {
    if (!nextMeeting || preparing) return;
    setPreparing(true);
    setBriefText(null);
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId: nextMeeting.id,
          title: nextMeeting.title,
          startAt: nextMeeting.startAt,
          context: nextMeeting.context ?? '',
        }),
      });
      const data = await res.json();
      const brief = data.brief ?? data.output ?? data.message ?? JSON.stringify(data);
      setBriefText(brief);
      onBrief?.(nextMeeting.id, brief);
    } catch {
      setBriefText('Impossible de generer le brief.');
    } finally {
      setPreparing(false);
    }
  }, [nextMeeting, webhookUrl, preparing, onBrief]);

  const isLive = nextMeeting !== null && timeLeft.total === 0;

  const classNames = [
    'ju-temporal-bridge',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="chat" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-temporal-bridge__header">
        <span className="ju-temporal-bridge__title">{title}</span>
        <CalendarIcon />
      </div>

      <div className="ju-temporal-bridge__body">
        {!nextMeeting ? (
          <div className="ju-temporal-bridge__empty">Aucun meeting a venir</div>
        ) : (
          <>
            {/* Meeting info */}
            <div className="ju-temporal-bridge__meeting">
              <span className="ju-temporal-bridge__meeting-title">{nextMeeting.title}</span>
              <span className="ju-temporal-bridge__meeting-time">
                {formatTime(nextMeeting.startAt)}
              </span>
            </div>

            {/* Countdown */}
            <div className={`ju-temporal-bridge__countdown ${isLive ? 'ju-temporal-bridge__countdown--live' : ''}`}>
              {isLive ? (
                <span className="ju-temporal-bridge__live">En cours</span>
              ) : (
                <>
                  <div className="ju-temporal-bridge__digit-group">
                    <span className="ju-temporal-bridge__digit">{pad(timeLeft.hours)}</span>
                    <span className="ju-temporal-bridge__unit">h</span>
                  </div>
                  <span className="ju-temporal-bridge__sep">:</span>
                  <div className="ju-temporal-bridge__digit-group">
                    <span className="ju-temporal-bridge__digit">{pad(timeLeft.minutes)}</span>
                    <span className="ju-temporal-bridge__unit">m</span>
                  </div>
                  <span className="ju-temporal-bridge__sep">:</span>
                  <div className="ju-temporal-bridge__digit-group">
                    <span className="ju-temporal-bridge__digit">{pad(timeLeft.seconds)}</span>
                    <span className="ju-temporal-bridge__unit">s</span>
                  </div>
                </>
              )}
            </div>

            {/* Prepare button */}
            <JUButton
              label={preparing ? 'Generation...' : 'Preparer avec l\'IA'}
              variant="ai"
              size="sm"
              icon={<SparkIcon />}
              isFullWidth
              onClick={handlePrepare}
              disabled={preparing}
              className="ju-temporal-bridge__prepare"
            />

            {/* Brief result */}
            {briefText && (
              <div className="ju-temporal-bridge__brief">
                <span className="ju-temporal-bridge__brief-label">Brief AI</span>
                <p className="ju-temporal-bridge__brief-text">{briefText}</p>
              </div>
            )}
          </>
        )}
      </div>
    </JUCard>
  );
};
