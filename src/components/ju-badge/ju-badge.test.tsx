import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUBadge } from './ju-badge';
describe('JUBadge', () => {
  it('renders label', () => { render(<JUBadge label="React" />); expect(screen.getByText('React')).toBeInTheDocument(); });
  it('renders icon', () => { render(<JUBadge label="X" icon={<span data-testid="ico">💻</span>} />); expect(screen.getByTestId('ico')).toBeInTheDocument(); });
});
