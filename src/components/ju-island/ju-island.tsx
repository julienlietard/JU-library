import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ju-island.css';

export interface JUIslandLink {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** URL or anchor (e.g. '#about') */
  href: string;
}

export interface JUIslandProps {
  /** Current section label displayed in the island */
  sectionLabel?: string;
  /** Scroll progress percentage (0-100) */
  progress?: number;
  /** Links shown when the island is expanded (table of contents) */
  links?: JUIslandLink[];
  /** ID of the currently active link (highlights in the TOC) */
  activeId?: string;
  /** Whether the island is visible */
  visible?: boolean;
  /** Auto-close delay in ms when mouse leaves (0 to disable) */
  autoCloseDelay?: number;
  /** Callback when a link is clicked */
  onLinkClick?: (id: string, href: string) => void;
  /** Progress ring color */
  progressColor?: string;
  /** Additional CSS class */
  className?: string;
}

export const JUIsland: React.FC<JUIslandProps> = ({
  sectionLabel = '',
  progress = 0,
  links = [],
  activeId,
  visible = true,
  autoCloseDelay = 2000,
  onLinkClick,
  progressColor = '#1b82ff',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);

  // SVG progress ring
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close when mouse leaves
  useEffect(() => {
    if (!isOpen || isHovered || autoCloseDelay <= 0) return;
    const timer = setTimeout(() => setIsOpen(false), autoCloseDelay);
    return () => clearTimeout(timer);
  }, [isOpen, isHovered, autoCloseDelay]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent, link: JUIslandLink) => {
      if (onLinkClick) {
        e.preventDefault();
        onLinkClick(link.id, link.href);
      }
      setIsOpen(false);
    },
    [onLinkClick],
  );

  if (!visible) return null;

  const containerClass = [
    'ju-island',
    isOpen ? 'ju-island--open' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={islandRef}
      className={containerClass}
      style={{ '--ju-island-color': progressColor } as React.CSSProperties}
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="status"
      aria-label={`${sectionLabel} — ${Math.round(clampedProgress)}% scrolled`}
    >
      {/* Closed bar — fades out when open via CSS */}
      <div className="ju-island__bar">
        <svg
          width="30"
          height="30"
          className="ju-island__ring"
          aria-hidden="true"
        >
          <circle
            cx="15"
            cy="15"
            r={radius}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="15"
            cy="15"
            r={radius}
            stroke={progressColor}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>

        <div className="ju-island__label">{sectionLabel}</div>

        <div className="ju-island__badge">{Math.round(clampedProgress)}%</div>
      </div>

      {/* TOC view — replaces bar content when open */}
      {isOpen && links.length > 0 && (
        <div
          className="ju-island__toc"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ju-island__toc-header">
            <span className="ju-island__toc-title">{sectionLabel}</span>
            <span className="ju-island__toc-percent">
              {Math.round(clampedProgress)}%
            </span>
          </div>

          <div className="ju-island__toc-track">
            <div
              className="ju-island__toc-fill"
              style={{
                width: `${clampedProgress}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>

          <nav
            className="ju-island__toc-list"
            aria-label="Table of contents"
          >
            {links.map((link, i) => (
              <a
                key={link.id}
                href={link.href}
                className={
                  'ju-island__toc-item' +
                  (activeId === link.id ? ' ju-island__toc-item--active' : '')
                }
                aria-current={activeId === link.id ? 'location' : undefined}
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};
