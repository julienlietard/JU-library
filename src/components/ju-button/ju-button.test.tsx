import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUButton } from './ju-button';

describe('JUButton', () => {
  it('renders with label', () => {
    render(<JUButton label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<JUButton label="Click" onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<JUButton label="Disabled" disabled onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('has aria-disabled when disabled', () => {
    render(<JUButton label="Disabled" disabled />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders icon left', () => {
    render(<JUButton label="With icon" iconLeft={<span data-testid="icon-left">←</span>} />);
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
  });

  it('renders icon right', () => {
    render(<JUButton label="With icon" iconRight={<span data-testid="icon-right">→</span>} />);
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });
});
