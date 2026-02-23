import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUPingDot } from './ju-ping-dot';

describe('JUPingDot', () => {
  it('renders with accessible label', () => {
    render(<JUPingDot label="Available" />);
    expect(screen.getByRole('img', { name: 'Available' })).toBeInTheDocument();
  });

  it('respects custom size', () => {
    render(<JUPingDot size={16} label="test" />);
    const dot = screen.getByRole('img');
    expect(dot.style.width).toBe('16px');
    expect(dot.style.height).toBe('16px');
  });
});
