import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { JUQuoteFooter } from './ju-quote-footer';

const quotes = [
  { text: 'Quote one', author: 'Author A' },
  { text: 'Quote two', author: 'Author B' },
  { text: 'Quote three', author: 'Author C' },
];

describe('JUQuoteFooter', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('renders the first quote', () => {
    render(<JUQuoteFooter quotes={quotes} />);
    expect(screen.getByText(/Quote one/)).toBeInTheDocument();
    expect(screen.getByText(/Author A/)).toBeInTheDocument();
  });

  it('renders navigation dots', () => {
    render(<JUQuoteFooter quotes={quotes} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('renders logo when provided', () => {
    render(<JUQuoteFooter quotes={quotes} logo={{ src: '/logo.png', alt: 'Logo' }} />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('renders legal section', () => {
    render(
      <JUQuoteFooter
        quotes={quotes}
        legal={{ copyright: '© 2025 Julien', links: [{ label: 'Privacy', href: '#' }] }}
      />
    );
    expect(screen.getByText('© 2025 Julien')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  it('does not render dots for single quote', () => {
    render(<JUQuoteFooter quotes={[quotes[0]]} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<JUQuoteFooter quotes={quotes} />);
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Footer with quotes');
  });
});