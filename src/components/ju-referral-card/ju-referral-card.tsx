import React, { useState, useCallback } from 'react';
import './ju-referral-card.css';

export interface JUReferralStep {
  /** Icon (ReactNode — emoji or SVG) */
  icon: React.ReactNode;
  /** Step description — use <strong> for emphasis */
  text: React.ReactNode;
}

export interface JUReferralCardProps {
  /** Hero/banner image URL */
  heroImage?: string;
  /** Main title */
  title?: string;
  /** Label above the steps */
  stepsLabel?: string;
  /** Steps explaining how it works */
  steps?: JUReferralStep[];
  /** Label above the invite link */
  linkLabel?: string;
  /** The invite/referral link */
  inviteLink?: string;
  /** Copy button label */
  copyLabel?: string;
  /** Text shown after copying */
  copiedLabel?: string;
  /** Called when copy is clicked */
  onCopy?: (link: string) => void;
  /** Additional CSS class */
  className?: string;
}

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const JUReferralCard: React.FC<JUReferralCardProps> = ({
  heroImage,
  title = 'Invite & Profit',
  stepsLabel = 'How it works:',
  steps = [],
  linkLabel = 'Your invite link:',
  inviteLink = 'https://wimt/alexsmith',
  copyLabel = 'Copy',
  copiedLabel = 'Copied!',
  onCopy,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(inviteLink).catch(() => {});
    setCopied(true);
    onCopy?.(inviteLink);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteLink, onCopy]);

  const cls = ['ju-referral-card', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      {heroImage && (
        <div className="ju-referral-card__hero">
          <img src={heroImage} alt="" className="ju-referral-card__hero-img" />
        </div>
      )}

      <div className="ju-referral-card__body">
        <h2 className="ju-referral-card__title">{title}</h2>

        {steps.length > 0 && (
          <div className="ju-referral-card__steps">
            <span className="ju-referral-card__steps-label">{stepsLabel}</span>
            <ul className="ju-referral-card__step-list">
              {steps.map((step, i) => (
                <li key={i} className="ju-referral-card__step">
                  <span className="ju-referral-card__step-icon">{step.icon}</span>
                  <span className="ju-referral-card__step-text">{step.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="ju-referral-card__link-section">
          <span className="ju-referral-card__link-label">{linkLabel}</span>
          <div className="ju-referral-card__link-row">
            <span className="ju-referral-card__link-icon"><LinkIcon /></span>
            <span className="ju-referral-card__link-text">{inviteLink}</span>
            <button
              type="button"
              className="ju-referral-card__copy-btn"
              onClick={handleCopy}
            >
              {copied ? copiedLabel : copyLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
