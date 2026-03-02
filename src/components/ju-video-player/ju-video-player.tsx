import React, { useState, useRef, useCallback, useEffect } from 'react';
import './ju-video-player.css';

/* ── Types ── */

export interface JUVideoPlayerProps {
  /** Video source URL */
  src: string;
  /** Poster image (displayed before play) */
  poster?: string;
  /** Aspect ratio (default '16/9') */
  aspectRatio?: string;
  /** Border radius in px (default 24) */
  borderRadius?: number;
  /** Autoplay (default false) */
  autoPlay?: boolean;
  /** Loop (default false) */
  loop?: boolean;
  /** Muted (default false, true if autoPlay) */
  muted?: boolean;
  /** Accent color for play button glow (default '#ff3b30') */
  accentColor?: string;
  /** Skip amount in seconds (default 10) */
  skipAmount?: number;
  /** Additional CSS class */
  className?: string;
}

export const JUVideoPlayer: React.FC<JUVideoPlayerProps> = ({
  src,
  poster,
  aspectRatio = '16/9',
  borderRadius = 24,
  autoPlay = false,
  loop = false,
  muted,
  accentColor = '#ff3b30',
  skipAmount = 10,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(autoPlay);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Play / Pause ── */
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      setHasStarted(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  /* ── Skip ── */
  const skip = useCallback((delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
  }, []);

  /* ── Progress tracking ── */
  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  /* ── Seek on progress bar click ── */
  const onProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
  }, []);

  /* ── Ended ── */
  const onEnded = useCallback(() => {
    if (!loop) {
      setPlaying(false);
      setControlsVisible(true);
    }
  }, [loop]);

  /* ── Auto-hide controls ── */
  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setControlsVisible(true);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) setControlsVisible(true);
    else scheduleHide();
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [playing, scheduleHide]);

  const cssVars = {
    '--ju-vp-accent': accentColor,
    '--ju-vp-accent-glow': `${accentColor}66`,
  } as React.CSSProperties;

  return (
    <div
      className={`${'ju-vp'} ${className ?? ''}`}
      style={{ aspectRatio, borderRadius, ...cssVars }}
      onMouseMove={scheduleHide}
      onMouseLeave={() => playing && setControlsVisible(false)}
    >
      <video
        ref={videoRef}
        className={'ju-vp__video'}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted ?? autoPlay}
        playsInline
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onClick={togglePlay}
      />

      {/* Blurred backdrop when controls shown */}
      <div
        className={`${'ju-vp__backdrop'} ${controlsVisible ? 'ju-vp__backdrop--visible' : ''}`}
      />

      {/* Center controls: rewind · play · forward */}
      <div
        className={`${'ju-vp__center'} ${controlsVisible ? 'ju-vp__center--visible' : ''}`}
      >
        {/* Rewind */}
        <button
          className={'ju-vp__btn-side'}
          onClick={(e) => { e.stopPropagation(); skip(-skipAmount); }}
          aria-label={`Rewind ${skipAmount} seconds`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 105.64-8.36L1 10" />
          </svg>
        </button>

        {/* Play / Pause (big, accented) */}
        <button
          className={'ju-vp__btn-play'}
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="3" width="5" height="18" rx="1.5" />
              <rect x="14" y="3" width="5" height="18" rx="1.5" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 3.5L20 12L6 20.5V3.5Z" />
            </svg>
          )}
        </button>

        {/* Forward */}
        <button
          className={'ju-vp__btn-side'}
          onClick={(e) => { e.stopPropagation(); skip(skipAmount); }}
          aria-label={`Forward ${skipAmount} seconds`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-5.64-8.36L23 10" />
          </svg>
        </button>
      </div>

      {/* Bottom progress bar */}
      <div
        ref={progressRef}
        className={`${'ju-vp__progress'} ${controlsVisible || !hasStarted ? 'ju-vp__progress--visible' : ''}`}
        onClick={onProgressClick}
        role="slider"
        aria-label="Video progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={'ju-vp__progress-track'}>
          <div
            className={'ju-vp__progress-fill'}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};