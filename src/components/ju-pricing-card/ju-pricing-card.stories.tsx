// JUPricingCard stories
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { JUPricingCard } from './ju-pricing-card';
import type { JUPricingFeature } from './ju-pricing-card';

const freeFeatures: JUPricingFeature[] = [
  { label: 'Up to 3 projects', included: true, detail: '3' },
  { label: 'Basic analytics', included: true },
  { label: 'Community support', included: true },
  { label: 'Custom domains', included: false },
  { label: 'Priority support', included: false },
  { label: 'API access', included: false },
];

const proFeatures: JUPricingFeature[] = [
  { label: 'Unlimited projects', included: true, detail: '∞' },
  { label: 'Advanced analytics', included: true },
  { label: 'Priority support', included: true, detail: '24/7' },
  { label: 'Custom domains', included: true },
  { label: 'API access', included: true, detail: '10k/mo' },
  { label: 'White-label', included: false },
];

const enterpriseFeatures: JUPricingFeature[] = [
  { label: 'Unlimited everything', included: true, detail: '∞' },
  { label: 'Real-time analytics', included: true },
  { label: 'Dedicated account manager', included: true },
  { label: 'Custom domains', included: true, detail: '∞' },
  { label: 'API access', included: true, detail: 'Unlimited' },
  { label: 'White-label & SSO', included: true },
];

const meta: Meta<typeof JUPricingCard> = {
  title: 'Molecules/JUPricingCard',
  component: JUPricingCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    tier: { control: 'select', options: ['free', 'pro', 'enterprise'] },
    billing: { control: 'select', options: ['monthly', 'yearly'] },
    popular: { control: 'boolean' },
    price: { control: { type: 'number' } },
  },
};

export default meta;
type Story = StoryObj<typeof JUPricingCard>;

export const Free: Story = {
  args: {
    name: 'Starter',
    tier: 'free',
    price: 0,
    tagline: 'Perfect for side projects',
    features: freeFeatures,
    ctaLabel: 'Start free',
    onCtaClick: () => {},
  },
};

export const Pro: Story = {
  args: {
    name: 'Pro',
    tier: 'pro',
    price: 29,
    tagline: 'For growing teams & creators',
    features: proFeatures,
    ctaLabel: 'Upgrade to Pro',
    popular: true,
    onCtaClick: () => {},
  },
};

export const Enterprise: Story = {
  args: {
    name: 'Enterprise',
    tier: 'enterprise',
    price: 99,
    tagline: 'For organizations at scale',
    features: enterpriseFeatures,
    ctaLabel: 'Contact sales',
    onCtaClick: () => {},
  },
};

export const PricingGrid: Story = {
  decorators: [
    () => (
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        <JUPricingCard
          name="Starter"
          tier="free"
          price={0}
          tagline="Perfect for side projects"
          features={freeFeatures}
          ctaLabel="Start free"
        />
        <JUPricingCard
          name="Pro"
          tier="pro"
          price={29}
          tagline="For growing teams & creators"
          features={proFeatures}
          ctaLabel="Upgrade to Pro"
          popular
        />
        <JUPricingCard
          name="Enterprise"
          tier="enterprise"
          price={99}
          tagline="For organizations at scale"
          features={enterpriseFeatures}
          ctaLabel="Contact sales"
        />
      </div>
    ),
  ],
};

export const Yearly: Story = {
  args: {
    name: 'Pro',
    tier: 'pro',
    price: 290,
    currency: '€',
    billing: 'yearly',
    tagline: 'Save 17% with annual billing',
    features: proFeatures,
    ctaLabel: 'Upgrade to Pro',
    popular: true,
    onCtaClick: () => {},
  },
};
