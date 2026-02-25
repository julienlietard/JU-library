import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUBreadcrumbs } from './ju-breadcrumbs';

describe('JUBreadcrumbs', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Article' },
  ];
  it('renders navigation', () => {
    render(<JUBreadcrumbs items={items} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
  });
  it('renders all items', () => {
    render(<JUBreadcrumbs items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Article')).toBeInTheDocument();
  });
  it('marks last item as current', () => {
    render(<JUBreadcrumbs items={items} />);
    expect(screen.getByText('Article')).toHaveAttribute('aria-current', 'page');
  });
  it('collapses with maxItems', () => {
    render(<JUBreadcrumbs items={[...items, { label: 'Sub' }, { label: 'Deep' }]} maxItems={3} />);
    expect(screen.getByText('…')).toBeInTheDocument();
  });
});