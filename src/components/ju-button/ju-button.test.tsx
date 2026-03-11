import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUButton } from './ju-button';

describe('JUButton', () => {
  it('renders label text', () => {
    render(<JUButton label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<JUButton label="Test" variant="dark" />);
    expect(container.querySelector('.ju-button--dark')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<JUButton label="Test" size="lg" />);
    expect(container.querySelector('.ju-button--lg')).toBeInTheDocument();
  });

  it('renders the magic icon automatically for AI variant', () => {
    render(<JUButton label="AI Mode" variant="ai" />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies full width class when isFullWidth is true', () => {
    render(<JUButton label="Full" isFullWidth />);
    expect(screen.getByRole('button')).toHaveClass('ju-button--full');
  });

  it('uses custom colors from props', () => {
    render(<JUButton label="Custom" customColors={{ bg: '#ff0000' }} />);
    const btn = screen.getByRole('button');
    expect(btn.style.getPropertyValue('--ju-btn-bg')).toBe('#ff0000');
  });

  it('renders icon when provided', () => {
    render(<JUButton label="Add" icon={<span data-testid="ico">+</span>} />);
    expect(screen.getByTestId('ico')).toBeInTheDocument();
  });

  it('places icon on the right when iconPlacement is right', () => {
    const { container } = render(
      <JUButton label="Go" icon={<span data-testid="ico">+</span>} iconPlacement="right" />
    );
    expect(container.querySelector('.ju-button__icon--right')).toBeInTheDocument();
  });

  // --- Icon Only ---
  it('renders as icon-only button with aria-label', () => {
    render(<JUButton label="Add" icon={<span>+</span>} iconOnly />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('ju-button--icon-only');
    expect(btn).toHaveAttribute('aria-label', 'Add');
    expect(btn.querySelector('.ju-button__label')).not.toBeInTheDocument();
  });

  // --- Loading ---
  it('shows loading spinner and disables button', () => {
    const { container } = render(<JUButton label="Save" loading />);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveClass('ju-button--loading');
    expect(container.querySelector('.ju-button__spinner')).toBeInTheDocument();
  });

  it('hides content when loading', () => {
    const { container } = render(<JUButton label="Save" loading />);
    expect(container.querySelector('.ju-button__content--hidden')).toBeInTheDocument();
  });

  it('is not disabled when not loading', () => {
    render(<JUButton label="Save" />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  // --- Dark variant ---
  it('applies dark variant class', () => {
    const { container } = render(<JUButton label="Dark" variant="dark" />);
    expect(container.querySelector('.ju-button--dark')).toBeInTheDocument();
  });

  // --- Disabled ---
  it('applies disabled class and attribute', () => {
    render(<JUButton label="Nope" disabled />);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('ju-button--disabled');
  });

  // --- Border styles ---
  it('does not add border class when borderStyle is none', () => {
    const { container } = render(<JUButton label="Test" />);
    const btn = container.querySelector('.ju-button');
    expect(btn?.className).not.toMatch(/ju-border--/);
  });

  it('applies subtle border class', () => {
    const { container } = render(<JUButton label="Test" borderStyle="subtle" />);
    expect(container.querySelector('.ju-border--subtle')).toBeInTheDocument();
  });

  it('applies bold border class', () => {
    const { container } = render(<JUButton label="Test" borderStyle="bold" />);
    expect(container.querySelector('.ju-border--bold')).toBeInTheDocument();
  });

  it('applies raised border class', () => {
    const { container } = render(<JUButton label="Test" borderStyle="raised" />);
    expect(container.querySelector('.ju-border--raised')).toBeInTheDocument();
  });

  it('applies accent border class', () => {
    const { container } = render(<JUButton label="Test" variant="primary" borderStyle="accent" />);
    expect(container.querySelector('.ju-border--accent')).toBeInTheDocument();
  });

  it('combines border style with any variant', () => {
    const { container } = render(<JUButton label="Test" variant="dark" borderStyle="raised" />);
    const btn = container.querySelector('.ju-button');
    expect(btn).toHaveClass('ju-button--dark');
    expect(btn).toHaveClass('ju-border--raised');
  });

  // --- All variants render ---
  it('renders all variant types without errors', () => {
    const variants = ['primary', 'secondary', 'dark', 'ghost', 'outline', 'ai', 'danger'] as const;
    variants.forEach((v) => {
      const { container } = render(<JUButton label={v} variant={v} />);
      expect(container.querySelector(`.ju-button--${v}`)).toBeInTheDocument();
    });
  });
});
