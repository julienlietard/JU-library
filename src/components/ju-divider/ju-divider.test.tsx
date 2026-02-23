import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUDivider } from './ju-divider';

describe('JUDivider', () => {
  it('renders as separator', () => {
    render(<JUDivider />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<JUDivider label="Section" />);
    expect(screen.getByText('Section')).toBeInTheDocument();
  });
});
