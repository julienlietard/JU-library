import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JUSkeleton } from './ju-skeleton';

describe('JUSkeleton', () => {
  it('renders hidden element', () => {
    const { container } = render(<JUSkeleton />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
  it('renders multiple lines', () => {
    const { container } = render(<JUSkeleton variant="text" lines={3} />);
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(0); // lines wrapper not aria-hidden
    const skeletons = container.querySelectorAll('div > div');
    expect(skeletons.length).toBe(4);
  });
  it('applies custom dimensions', () => {
    const { container } = render(<JUSkeleton width={200} height={100} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('100px');
  });
});