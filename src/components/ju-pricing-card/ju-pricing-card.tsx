import React from 'react';
import { JUCard } from '../ju-card/ju-card';
import { JUButton } from '../ju-button/ju-button';
import './ju-pricing-card.css';

export type JUPricingCardTier = 'free' | 'pro' | 'enterprise';
export type JUPricingCardBilling = 'monthly' | 'yearly';

export interface JUPricingFeature {
  /** Feature label */
  label: string;
  /** Whether this feature is included */
  included: boolean;
  /** Optional highlight text (e.g. "Unlimited", "10 GB") */
  detail?: string;
}

export interface JUPricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan name */
  name: string;
  /** Tier determines visual treatment */
  tier?: JUPricingCardTier;
  /** Price amount (e.g. 29) */
  price: number;
  /** Currency symbol */
  currency?: string;
  /** Billing cycle */
  billing?: JUPricingCardBilling;
  /** Short tagline under the plan name */
  tagline?: string;
  /** Feature list */
  features: JUPricingFeature[];
  /** CTA button label */
  ctaLabel?: string;
  /** CTA callback */
  onCtaClick?: () => void;
  /** Whether this card is the recommended/popular one */
  popular?: boolean;
}

export const JUPricingCard: React.FC<JUPricingCardProps> = ({
  name,
  tier = 'free',
  price,
  currency = '€',
  billing = 'monthly',
  tagline,
  features,
  ctaLabel = 'Get started',
  onCtaClick,
  popular = false,
  className,
  ...rest
}) => {
  const cls = [
    'ju-pricing-card',
    `ju-pricing-card--${tier}`,
    popular ? 'ju-pricing-card--popular' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const billingLabel = billing === 'monthly' ? '/mo' : '/yr';

  return (
    <div className={cls} {...rest}>
      {/* Popular ribbon */}
      {popular && (
        <span className="ju-pricing-card__ribbon">Most popular</span>
      )}

      <JUCard
        variant={popular ? 'solid' : 'glass'}
        padding="none"
        className="ju-pricing-card__card"
      >
        <div className="ju-pricing-card__inner">
          {/* Header */}
          <div className="ju-pricing-card__header">
            <span className="ju-pricing-card__tier-icon" aria-hidden="true">
              {tier === 'free' && '✦'}
              {tier === 'pro' && '◆'}
              {tier === 'enterprise' && '⬡'}
            </span>
            <h3 className="ju-pricing-card__name">{name}</h3>
            {tagline && <p className="ju-pricing-card__tagline">{tagline}</p>}
          </div>

          {/* Price */}
          <div className="ju-pricing-card__price-block">
            <span className="ju-pricing-card__currency">{currency}</span>
            <span className="ju-pricing-card__amount">{price}</span>
            <span className="ju-pricing-card__billing">{billingLabel}</span>
          </div>

          {/* CTA */}
          <JUButton
            label={ctaLabel}
            variant={popular ? 'ai' : 'secondary'}
            size="lg"
            isFullWidth
            onClick={onCtaClick}
            className="ju-pricing-card__cta"
          />

          {/* Divider */}
          <div className="ju-pricing-card__divider" />

          {/* Features */}
          <ul className="ju-pricing-card__features">
            {features.map((f, i) => (
              <li
                key={i}
                className={[
                  'ju-pricing-card__feature',
                  f.included ? '' : 'ju-pricing-card__feature--disabled',
                ].filter(Boolean).join(' ')}
              >
                <span className="ju-pricing-card__check" aria-hidden="true">
                  {f.included ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span className="ju-pricing-card__feature-label">{f.label}</span>
                {f.detail && (
                  <span className="ju-pricing-card__feature-detail">{f.detail}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </JUCard>
    </div>
  );
};
