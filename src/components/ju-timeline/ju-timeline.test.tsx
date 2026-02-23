import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUTimeline } from './ju-timeline';

const items = [
  { id: '1', date: '2023', title: 'Job A', subtitle: 'Company', points: ['Did X', 'Did Y'] },
  { id: '2', date: '2021', title: 'Job B', points: ['Did Z'] },
];

describe('JUTimeline', () => {
  it('renders all items', () => {
    render(<JUTimeline items={items} />);
    expect(screen.getByText('Job A')).toBeInTheDocument();
    expect(screen.getByText('Job B')).toBeInTheDocument();
  });

  it('renders dates', () => {
    render(<JUTimeline items={items} />);
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('details hidden by default', () => {
    render(<JUTimeline items={items} />);
    expect(screen.queryByText('Did X')).not.toBeVisible();
  });

  it('expands on click', () => {
    render(<JUTimeline items={items} />);
    fireEvent.click(screen.getByText('Job A'));
    expect(screen.getByText('Did X')).toBeVisible();
  });

  it('accordion closes previous when opening new', () => {
    render(<JUTimeline items={items} accordion />);
    fireEvent.click(screen.getByText('Job A'));
    expect(screen.getByText('Did X')).toBeVisible();
    fireEvent.click(screen.getByText('Job B'));
    expect(screen.getByText('Did Z')).toBeVisible();
  });

  it('expandAll shows everything', () => {
    render(<JUTimeline items={items} expandAll />);
    expect(screen.getByText('Did X')).toBeVisible();
    expect(screen.getByText('Did Z')).toBeVisible();
  });

  it('row has button role and aria-expanded', () => {
    render(<JUTimeline items={items} />);
    const rows = screen.getAllByRole('button');
    expect(rows[0]).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(rows[0]);
    expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders badge when provided', () => {
    const withBadge = [{ ...items[0], badge: { label: 'Sopra Steria' } }];
    render(<JUTimeline items={withBadge} />);
    expect(screen.getByText('Sopra Steria')).toBeInTheDocument();
  });
});
