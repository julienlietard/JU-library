import React from 'react';
import './ju-pagination.css';

export interface JUPaginationProps {
  /** Current page (1-based) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Max visible page buttons (default 5) */
  maxVisible?: number;
  /** Show prev/next labels */
  showLabels?: boolean;
  className?: string;
}

export const JUPagination: React.FC<JUPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  maxVisible = 5,
  showLabels = true,
  className,
}) => {
  if (totalPages <= 1) return null;

  const getPages = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(2, page - half);
    let end = Math.min(totalPages - 1, page + half);
    if (page <= half + 1) end = maxVisible - 1;
    if (page >= totalPages - half) start = totalPages - maxVisible + 2;
    const pages: (number | 'ellipsis')[] = [1];
    if (start > 2) pages.push('ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav aria-label="Pagination" className={`${'ju-pg'} ${className ?? ''}`}>
      <button
        className={`${'ju-pg__btn'} ${'ju-pg__nav'}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Page précédente"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        {showLabels && <span className={'ju-pg__nav-label'}>Préc.</span>}
      </button>

      <div className={'ju-pg__pages'}>
        {getPages().map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className={'ju-pg__ellipsis'}>…</span>
          ) : (
            <button
              key={p}
              className={`${'ju-pg__btn'} ${'ju-pg__page'} ${p === page ? 'ju-pg__page--active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={`${'ju-pg__btn'} ${'ju-pg__nav'}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Page suivante"
      >
        {showLabels && <span className={'ju-pg__nav-label'}>Suiv.</span>}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </nav>
  );
};