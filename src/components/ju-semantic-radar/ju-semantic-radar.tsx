import React, { useMemo } from 'react';
import { JUBadge } from '../ju-badge/ju-badge';
import type { JUBadgeColor } from '../ju-badge/ju-badge';
import { JUCard } from '../ju-card/ju-card';
import './ju-semantic-radar.css';

/* ── Types ── */

export interface JUSemanticTag {
  /** Tag label (e.g. "react", "architecture") */
  label: string;
  /** Occurrence count from ChromaDB */
  count: number;
  /** Optional color override */
  color?: JUBadgeColor;
}

export interface JUSemanticRadarProps {
  /** Tags with their frequency */
  tags: JUSemanticTag[];
  /** Called when a tag is clicked — sends the label for MemoryStream filtering */
  onFilter?: (tag: string) => void;
  /** Widget title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

/* ── Helpers ── */

/** Map a value from [inMin, inMax] to [outMin, outMax] */
function lerp(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return (outMin + outMax) / 2;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

const SIZE_MIN = 0.7;
const SIZE_MAX = 1.35;

const PALETTE: JUBadgeColor[] = ['blue', 'purple', 'green', 'orange', 'pink', 'red'];

/* ── Component ── */

export const JUSemanticRadar: React.FC<JUSemanticRadarProps> = ({
  tags,
  onFilter,
  title = 'Semantic Radar',
  className,
}) => {
  const { sorted, minCount, maxCount } = useMemo(() => {
    const s = [...tags].sort((a, b) => b.count - a.count);
    const counts = s.map((t) => t.count);
    return {
      sorted: s,
      minCount: Math.min(...counts, 0),
      maxCount: Math.max(...counts, 1),
    };
  }, [tags]);

  const classNames = [
    'ju-semantic-radar',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="chat" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-semantic-radar__header">
        <span className="ju-semantic-radar__title">{title}</span>
        <span className="ju-semantic-radar__count">{tags.length} tags</span>
      </div>

      {/* Cloud */}
      <div className="ju-semantic-radar__cloud">
        {sorted.length === 0 ? (
          <span className="ju-semantic-radar__empty">Aucun tag indexe</span>
        ) : (
          sorted.map((tag, i) => {
            const scale = lerp(tag.count, minCount, maxCount, SIZE_MIN, SIZE_MAX);
            const color = tag.color ?? PALETTE[i % PALETTE.length];

            return (
              <button
                key={tag.label}
                type="button"
                className="ju-semantic-radar__tag"
                style={{ fontSize: `${scale}rem` }}
                onClick={() => onFilter?.(tag.label)}
                title={`${tag.label} (${tag.count})`}
              >
                <JUBadge label={tag.label} color={color} />
                <span className="ju-semantic-radar__tag-count">{tag.count}</span>
              </button>
            );
          })
        )}
      </div>
    </JUCard>
  );
};
