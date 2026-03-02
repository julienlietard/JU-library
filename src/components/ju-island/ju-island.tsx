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
  /** Links shown when the island is expanded */
  links?: JUIslandLink[];
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
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="status"
      aria-label={`${sectionLabel} — ${Math.round(clampedProgress)}% scrolled`}
    >
      {/* Progress ring */}
      <svg
        width="30"
        height="30"
        className={'ju-island__ring'}
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

      {/* Section name */}
      <div className={'ju-island__label'}>
        {sectionLabel}
      </div>

      {/* Progress badge */}
      <div className={'ju-island__progress'}>
        {Math.round(clampedProgress)}%
      </div>

      {/* Expanded links */}
      {isOpen && links.length > 0 && (
        <nav
          className={'ju-island__links'}
          aria-label="Page sections"
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={'ju-island__link'}
              onClick={(e) => handleLinkClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
};
