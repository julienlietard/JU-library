import React, { useEffect, useRef, useState } from 'react';
import './ju-feed-layout.css';

export type JUFeedLayoutColumns = 1 | 2 | 3 | 4;
export type JUFeedLayoutGap = 'sm' | 'md' | 'lg';

export interface JUFeedLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (responsive: collapses on small screens) */
  columns?: JUFeedLayoutColumns;
  /** Gap between items */
  gap?: JUFeedLayoutGap;
  /** Whether more items can be loaded */
  hasMore?: boolean;
  /** Callback fired when the user scrolls near the bottom */
  onLoadMore?: () => void | Promise<void>;
  /** Distance from bottom (in px) to trigger onLoadMore (default 200) */
  threshold?: number;
  /** Show a loading indicator at the bottom */
  loading?: boolean;
  /** Optional header rendered above the feed */
  header?: React.ReactNode;
  /** Feed items */
  children?: React.ReactNode;
}

export const JUFeedLayout: React.FC<JUFeedLayoutProps> = ({
  columns = 2,
  gap = 'md',
  hasMore = false,
  onLoadMore,
  threshold = 200,
  loading = false,
  header,
  children,
  className,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingInternal, setLoadingInternal] = useState(false);
  const isLoading = loading || loadingInternal;
  const loadingRef = useRef(isLoading);
  loadingRef.current = isLoading;
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  /* Scroll-based infinite loading (works in iframes & all contexts) */
  useEffect(() => {
    const check = () => {
      if (!hasMoreRef.current || loadingRef.current || !onLoadMoreRef.current) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const distanceToBottom = rect.bottom - viewportH;

      if (distanceToBottom <= threshold) {
        loadingRef.current = true;
        setLoadingInternal(true);
        Promise.resolve(onLoadMoreRef.current()).finally(() => {
          setLoadingInternal(false);
          loadingRef.current = false;
        });
      }
    };

    // Check immediately (content may already be short enough)
    check();

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [threshold, hasMore, loadingInternal]);

  const cls = [
    'ju-feed-layout',
    className ?? '',
  ].filter(Boolean).join(' ');

  const gridCls = [
    'ju-feed-layout__grid',
    `ju-feed-layout__grid--cols-${columns}`,
    `ju-feed-layout__grid--gap-${gap}`,
  ].join(' ');

  return (
    <div className={cls} ref={containerRef} {...rest}>
      {header && <div className="ju-feed-layout__header">{header}</div>}

      <div className={gridCls}>
        {children}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="ju-feed-layout__loader" aria-live="polite">
          <div className="ju-feed-layout__spinner" />
          <span className="ju-feed-layout__loader-text">Chargement…</span>
        </div>
      )}

      {/* End-of-feed message */}
      {!hasMore && !isLoading && React.Children.count(children) > 0 && (
        <div className="ju-feed-layout__end" aria-live="polite">
          Tout est chargé
        </div>
      )}
    </div>
  );
};
