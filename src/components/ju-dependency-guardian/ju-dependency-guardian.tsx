import React, { useState } from 'react';
import { JUCard } from '../ju-card/ju-card';
import './ju-dependency-guardian.css';

export type JUDepSeverity = 'vulnerability' | 'outdated';

export interface JUDepPackage {
  /** Package name */
  name: string;
  /** Currently installed version */
  currentVersion: string;
  /** Latest available version */
  latestVersion: string;
  /** Severity: vulnerability or outdated */
  severity: JUDepSeverity;
  /** Optional short description */
  reason?: string;
}

export interface JUDependencyGuardianProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Health score from 0 (critical) to 100 (perfect) */
  score: number;
  /** Top packages to update (only the first 3 are shown) */
  packages: JUDepPackage[];
  /** Optional title */
  title?: string;
}

/* ---- Score ring (SVG) ---- */

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? 'var(--ju-color-success, #22c55e)'
      : score >= 50
        ? 'var(--ju-color-warning, #f59e0b)'
        : 'var(--ju-color-error, var(--ju-color-danger, #ef4444))';

  return (
    <svg className="ju-dep-guardian__ring" viewBox="0 0 96 96" aria-hidden="true">
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="var(--ju-color-border, rgba(0,0,0,0.08))"
        strokeWidth="6"
      />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 48 48)"
        className="ju-dep-guardian__ring-fill"
      />
      <text
        x="48"
        y="44"
        textAnchor="middle"
        className="ju-dep-guardian__ring-score"
        fill={color}
      >
        {score}
      </text>
      <text
        x="48"
        y="60"
        textAnchor="middle"
        className="ju-dep-guardian__ring-label"
      >
        / 100
      </text>
    </svg>
  );
};

/* ---- Component ---- */

export const JUDependencyGuardian: React.FC<JUDependencyGuardianProps> = ({
  score,
  packages,
  title = 'Dependency Guardian',
  className,
  ...rest
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const top3 = packages.slice(0, 3);

  const handleCopy = async (pkg: JUDepPackage, idx: number) => {
    const cmd = `npm install ${pkg.name}@latest`;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const cls = ['ju-dep-guardian', className ?? ''].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="md" className={cls} {...rest}>
      {/* Header */}
      <div className="ju-dep-guardian__header">
        <div className="ju-dep-guardian__header-text">
          <h3 className="ju-dep-guardian__title">{title}</h3>
          <span className="ju-dep-guardian__subtitle">
            {top3.length === 0
              ? 'Toutes les dépendances sont à jour'
              : `${packages.length} dépendance${packages.length > 1 ? 's' : ''} à vérifier`}
          </span>
        </div>
        <ScoreRing score={score} />
      </div>

      {/* Package list */}
      {top3.length > 0 && (
        <div className="ju-dep-guardian__list" role="list">
          {top3.map((pkg, i) => (
            <div
              className="ju-dep-guardian__pkg"
              role="listitem"
              key={pkg.name}
            >
              {/* Severity indicator */}
              <span
                className={[
                  'ju-dep-guardian__severity',
                  `ju-dep-guardian__severity--${pkg.severity}`,
                ].join(' ')}
              >
                {pkg.severity === 'vulnerability' ? 'CVE' : 'OLD'}
              </span>

              {/* Package info */}
              <div className="ju-dep-guardian__pkg-info">
                <span className="ju-dep-guardian__pkg-name">{pkg.name}</span>
                <span className="ju-dep-guardian__pkg-versions">
                  <code>{pkg.currentVersion}</code>
                  <span className="ju-dep-guardian__arrow" aria-hidden="true">→</span>
                  <code>{pkg.latestVersion}</code>
                </span>
                {pkg.reason && (
                  <span className="ju-dep-guardian__pkg-reason">{pkg.reason}</span>
                )}
              </div>

              {/* Copy button */}
              <button
                className="ju-dep-guardian__copy"
                onClick={() => handleCopy(pkg, i)}
                aria-label={`Copier npm install ${pkg.name}@latest`}
                type="button"
              >
                {copiedIdx === i ? 'Copié !' : 'Copy Update'}
              </button>
            </div>
          ))}
        </div>
      )}
    </JUCard>
  );
};
