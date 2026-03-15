import React, { useState } from 'react';
import { JUCard } from '../ju-card/ju-card';
import { JUBadge } from '../ju-badge/ju-badge';
import { JUButton } from '../ju-button/ju-button';
import './ju-priority-horizon.css';

export interface JUPriorityEmail {
  /** Unique identifier */
  id: string;
  /** Sender name or email */
  sender: string;
  /** Email subject */
  subject: string;
  /** AI-generated summary */
  aiSummary: string;
}

export interface JUPriorityHorizonProps {
  /** List of high-priority emails */
  emails: JUPriorityEmail[];
  /** n8n webhook URL for archiving */
  webhookUrl: string;
  /** Callback after successful archive */
  onArchive?: (id: string) => void;
  /** Widget title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

const SparkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const JUPriorityHorizon: React.FC<JUPriorityHorizonProps> = ({
  emails,
  webhookUrl,
  onArchive,
  title = 'Priority Horizon',
  className,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());

  const handleArchive = async (id: string) => {
    if (archiving) return;
    setArchiving(id);
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive', emailId: id }),
      });
      setArchivedIds((prev) => new Set(prev).add(id));
      onArchive?.(id);
    } catch {
      // silently fail — could add toast later
    } finally {
      setArchiving(null);
    }
  };

  const visibleEmails = emails.filter((e) => !archivedIds.has(e.id));

  const classNames = [
    'ju-priority-horizon',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-priority-horizon__header">
        <span className="ju-priority-horizon__title">{title}</span>
        <span className="ju-priority-horizon__count">{visibleEmails.length}</span>
      </div>

      {/* Email list */}
      <div className="ju-priority-horizon__list">
        {visibleEmails.length === 0 && (
          <div className="ju-priority-horizon__empty">Aucun email prioritaire</div>
        )}

        {visibleEmails.map((email) => {
          const isExpanded = expandedId === email.id;
          const isArchiving = archiving === email.id;

          return (
            <div
              key={email.id}
              className={`ju-priority-horizon__mail ${isExpanded ? 'ju-priority-horizon__mail--expanded' : ''}`}
              onMouseEnter={() => setExpandedId(email.id)}
              onMouseLeave={() => setExpandedId(null)}
            >
              {/* Top row */}
              <div className="ju-priority-horizon__mail-top">
                <div className="ju-priority-horizon__mail-info">
                  <span className="ju-priority-horizon__sender">{email.sender}</span>
                  <span className="ju-priority-horizon__subject">{email.subject}</span>
                </div>
                <div className="ju-priority-horizon__mail-actions">
                  <JUBadge label="Résumé AI" color="purple" glass icon={<SparkIcon />} />
                  <JUButton
                    label=""
                    variant="ghost"
                    size="sm"
                    className="ju-priority-horizon__check"
                    icon={<CheckIcon />}
                    onClick={() => handleArchive(email.id)}
                    disabled={isArchiving}
                    aria-label={`Archiver l'email de ${email.sender}`}
                  />
                </div>
              </div>

              {/* AI Summary — revealed on hover */}
              <div className="ju-priority-horizon__summary">
                <p className="ju-priority-horizon__summary-text">{email.aiSummary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </JUCard>
  );
};
