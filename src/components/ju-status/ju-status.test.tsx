import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUStatus } from './ju-status';
describe('JUStatus', () => {
  it('renders label', () => { render(<JUStatus label="Active" />); expect(screen.getByText('Active')).toBeInTheDocument(); });
  it('renders icon', () => { render(<JUStatus label="OK" icon={<span data-testid="ico">✓</span>} />); expect(screen.getByTestId('ico')).toBeInTheDocument(); });
  it('has status role', () => { render(<JUStatus label="Test" />); expect(screen.getByRole('status')).toBeInTheDocument(); });
});
