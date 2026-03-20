import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { JUStatCard } from './ju-stat-card';

describe('JUStatCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /* ── rendering ──────────────────────────────────── */

  it('renders label', () => {
    render(<JUStatCard value={100} label="Users" animated={false} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders formatted value', () => {
    render(<JUStatCard value={1234} label="Count" animated={false} />);
    // fr-FR locale formats with spaces/non-breaking spaces
    const el = screen.getByText((_, node) =>
      node?.classList.contains('ju-stat-card__value') ?? false
    );
    expect(el).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<JUStatCard value={10} label="X" subtitle="This month" animated={false} />);
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(<JUStatCard value={10} label="X" animated={false} />);
    expect(container.querySelector('.ju-stat-card__subtitle')).toBeNull();
  });

  /* ── classes ────────────────────────────────────── */

  it('applies default classes', () => {
    const { container } = render(<JUStatCard value={0} label="L" animated={false} />);
    const el = container.firstChild as HTMLElement;
    expect(el.classList.contains('ju-stat-card')).toBe(true);
    expect(el.classList.contains('ju-stat-card--default')).toBe(true);
    expect(el.classList.contains('ju-stat-card--md')).toBe(true);
  });

  it('applies variant class', () => {
    const { container } = render(<JUStatCard value={0} label="L" variant="glass" animated={false} />);
    expect((container.firstChild as HTMLElement).classList.contains('ju-stat-card--glass')).toBe(true);
  });

  it('applies gradient variant class', () => {
    const { container } = render(<JUStatCard value={0} label="L" variant="gradient" animated={false} />);
    expect((container.firstChild as HTMLElement).classList.contains('ju-stat-card--gradient')).toBe(true);
  });

  it('applies size classes', () => {
    const { container: sm } = render(<JUStatCard value={0} label="L" size="sm" animated={false} />);
    expect((sm.firstChild as HTMLElement).classList.contains('ju-stat-card--sm')).toBe(true);

    const { container: lg } = render(<JUStatCard value={0} label="L" size="lg" animated={false} />);
    expect((lg.firstChild as HTMLElement).classList.contains('ju-stat-card--lg')).toBe(true);
  });

  it('merges custom className', () => {
    const { container } = render(<JUStatCard value={0} label="L" className="custom" animated={false} />);
    expect((container.firstChild as HTMLElement).classList.contains('custom')).toBe(true);
  });

  /* ── icon ───────────────────────────────────────── */

  it('renders icon', () => {
    const { container } = render(
      <JUStatCard value={0} label="L" icon={<span data-testid="ic">★</span>} animated={false} />
    );
    expect(screen.getByTestId('ic')).toBeInTheDocument();
    expect(container.querySelector('.ju-stat-card__icon')).not.toBeNull();
  });

  it('does not render icon container when no icon', () => {
    const { container } = render(<JUStatCard value={0} label="L" animated={false} />);
    expect(container.querySelector('.ju-stat-card__icon')).toBeNull();
  });

  it('applies iconColor as CSS custom property', () => {
    const { container } = render(
      <JUStatCard value={0} label="L" icon={<span>★</span>} iconColor="#ff0000" animated={false} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue('--_stat-icon-color')).toBe('#ff0000');
  });

  /* ── trend ──────────────────────────────────────── */

  it('computes positive trend from previousValue', () => {
    const { container } = render(
      <JUStatCard value={120} previousValue={100} label="L" animated={false} />
    );
    const trend = container.querySelector('.ju-stat-card__trend');
    expect(trend).not.toBeNull();
    expect(trend!.classList.contains('ju-stat-card__trend--up')).toBe(true);
    expect(trend!.textContent).toContain('20.0%');
  });

  it('computes negative trend from previousValue', () => {
    const { container } = render(
      <JUStatCard value={80} previousValue={100} label="L" animated={false} />
    );
    const trend = container.querySelector('.ju-stat-card__trend');
    expect(trend).not.toBeNull();
    expect(trend!.classList.contains('ju-stat-card__trend--down')).toBe(true);
    expect(trend!.textContent).toContain('20.0%');
  });

  it('uses trend prop over computed trend', () => {
    const { container } = render(
      <JUStatCard
        value={100}
        previousValue={90}
        label="L"
        trend={{ value: -5.5, label: 'vs last week' }}
        animated={false}
      />
    );
    const trend = container.querySelector('.ju-stat-card__trend');
    expect(trend!.classList.contains('ju-stat-card__trend--down')).toBe(true);
    expect(trend!.textContent).toContain('5.5%');
    expect(screen.getByText('vs last week')).toBeInTheDocument();
  });

  it('does not render trend when no previousValue or trend prop', () => {
    const { container } = render(<JUStatCard value={100} label="L" animated={false} />);
    expect(container.querySelector('.ju-stat-card__trend')).toBeNull();
  });

  it('renders trend label', () => {
    render(
      <JUStatCard value={100} label="L" trend={{ value: 10, label: 'vs prior' }} animated={false} />
    );
    expect(screen.getByText('vs prior')).toBeInTheDocument();
  });

  /* ── sparkline ──────────────────────────────────── */

  it('renders sparkline when data provided', () => {
    const { container } = render(
      <JUStatCard value={0} label="L" sparklineData={[1, 2, 3, 4]} animated={false} />
    );
    expect(container.querySelector('.ju-stat-card__sparkline')).not.toBeNull();
  });

  it('does not render sparkline with fewer than 2 points', () => {
    const { container } = render(
      <JUStatCard value={0} label="L" sparklineData={[1]} animated={false} />
    );
    expect(container.querySelector('.ju-stat-card__sparkline')).toBeNull();
  });

  it('does not render sparkline when no data', () => {
    const { container } = render(<JUStatCard value={0} label="L" animated={false} />);
    expect(container.querySelector('.ju-stat-card__sparkline')).toBeNull();
  });

  /* ── formatValue ────────────────────────────────── */

  it('uses custom formatValue', () => {
    render(
      <JUStatCard
        value={42}
        label="L"
        formatValue={(v) => `$${v}`}
        animated={false}
      />
    );
    expect(screen.getByText('$42')).toBeInTheDocument();
  });

  /* ── HTML attributes passthrough ────────────────── */

  it('passes extra HTML attributes', () => {
    const { container } = render(
      <JUStatCard value={0} label="L" data-testid="stat" animated={false} />
    );
    expect(container.querySelector('[data-testid="stat"]')).not.toBeNull();
  });

  it('merges custom style', () => {
    const { container } = render(
      <JUStatCard value={0} label="L" style={{ opacity: 0.5 }} animated={false} />
    );
    expect((container.firstChild as HTMLElement).style.opacity).toBe('0.5');
  });
});
