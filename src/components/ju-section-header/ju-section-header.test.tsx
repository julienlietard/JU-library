import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUSectionHeader } from './ju-section-header';

describe('JUSectionHeader', () => {
  it('renders title', () => {
    render(<JUSectionHeader title="Workspace" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Workspace');
  });

  it('renders subtitle when provided', () => {
    render(<JUSectionHeader subtitle="Découvrez mon" title="Workspace" />);
    expect(screen.getByText('Découvrez mon')).toBeInTheDocument();
  });

  it('omits subtitle when not provided', () => {
    const { container } = render(<JUSectionHeader title="Test" />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
