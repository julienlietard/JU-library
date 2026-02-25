import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUSwitch } from './ju-switch';

describe('JUSwitch', () => {
  it('renders with label', () => {
    render(<JUSwitch label="Toggle" />);
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });
  it('has switch role', () => {
    render(<JUSwitch label="Toggle" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });
  it('toggles on click', () => {
    const fn = vi.fn();
    render(<JUSwitch onChange={fn} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(fn).toHaveBeenCalledWith(true);
  });
  it('respects disabled', () => {
    const fn = vi.fn();
    render(<JUSwitch disabled onChange={fn} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(fn).not.toHaveBeenCalled();
  });
  it('aria-checked reflects state', () => {
    render(<JUSwitch checked={true} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});