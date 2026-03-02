import React, { useRef, useState, useEffect, useCallback } from 'react';
import './ju-carousel.css';

export interface JUCarouselProps {
  /** Slides to display */
  children: React.ReactNode;
  /** Enable auto-scroll */
  autoPlay?: boolean;
  /** Auto-scroll interval in ms */
  interval?: number;
  /** Number of items visible per slide on desktop (mobile always shows 1) */
  itemsPerSlide?: number;
  /** Mobile breakpoint in px */
  mobileBreakpoint?: number;
  /** Show play/pause button */
  showPlayButton?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Custom play icon (defaults to ▶) */
  playIcon?: React.ReactNode;
  /** Custom pause icon (defaults to ⏸) */
  pauseIcon?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

export const JUCarousel: React.FC<JUCarouselProps> = ({
  children,
  autoPlay = true,
  interval = 6000,
  itemsPerSlide = 3,
  mobileBreakpoint = 768,
  showPlayButton = true,
  showDots = true,
  playIcon,
  pauseIcon,
  className,
}) => {
  const items = React.Children.toArray(children);

  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);

  const perSlide = isMobile ? 1 : itemsPerSlide;
  const slideW = 100 / perSlide;
  const totalSlides = Math.max(1, Math.ceil(items.length / perSlide));

  // Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, [mobileBreakpoint]);

  // Reset index when slide count changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, totalSlides - 1));
  }, [totalSlides]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(
      () => setCurrentIndex((p) => (p + 1) % totalSlides),
      interval,
    );
    return () => clearInterval(id);
  }, [isPlaying, interval, totalSlides]);

  const goTo = useCallback(
    (i: number) => setCurrentIndex(Math.max(0, Math.min(i, totalSlides - 1))),
    [totalSlides],
  );

  // ── Drag handlers ─────────────────────────────────────────────────────
  const onStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
  }, []);

  const onMove = useCallback(
    (clientX: number) => {
      if (!isDragging || startXRef.current === null) return;
      setDragOffset(clientX - startXRef.current);
    },
    [isDragging],
  );

  const onEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const width = containerRef.current?.offsetWidth ?? 1;
    const threshold = width * 0.15;
    if (dragOffset < -threshold) goTo(currentIndex + 1);
    else if (dragOffset > threshold) goTo(currentIndex - 1);
    setDragOffset(0);
    startXRef.current = null;
  }, [isDragging, dragOffset, currentIndex, goTo]);

  const translateX = isDragging
    ? `calc(${-currentIndex * slideW}% + ${dragOffset}px)`
    : `${-currentIndex * slideW}%`;

  const carouselClass = ['ju-carousel', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={carouselClass}
      onMouseDown={(e) => onStart(e.clientX)}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      onTouchStart={(e) => onStart(e.touches[0].clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onTouchEnd={onEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
    >
      <div
        className={`${'ju-carousel__viewport'}${isDragging ? ` ${'ju-carousel__viewport--grabbing'}` : ''}`}
        ref={containerRef}
      >
        <div
          className={'ju-carousel__track'}
          style={{
            transform: `translateX(${translateX})`,
            transition: isDragging
              ? 'none'
              : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          aria-live="polite"
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={'ju-carousel__slide'}
              style={{ flex: `0 0 ${slideW}%` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${items.length}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {(showDots || showPlayButton) && (
        <div className={'ju-carousel__controls'}>
          {showPlayButton && !isMobile && (
            <button
              className={'ju-carousel__play-btn'}
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
            >
              {isPlaying
                ? (pauseIcon ?? <PauseIcon />)
                : (playIcon ?? <PlayIcon />)}
            </button>
          )}
          {showDots && (
            <div className={'ju-carousel__dots'} role="tablist">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  className={`${'ju-carousel__dot'}${i === currentIndex ? ` ${'ju-carousel__dot--active'}` : ''}`}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Default SVG icons (no react-icons dependency) ── */

const PlayIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
    <path d="M0 0v12l10-6z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
    <rect x="0" y="0" width="3" height="12" />
    <rect x="7" y="0" width="3" height="12" />
  </svg>
);
