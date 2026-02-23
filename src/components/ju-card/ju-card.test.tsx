import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUCard } from './ju-card';

describe('JUCard', () => {
  it('renders children content', () => {
    render(<JUCard>Hello Card</JUCard>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('renders header image when provided', () => {
    render(
      <JUCard image={{ src: '/test.jpg', alt: 'Test image' }}>
        Content
      </JUCard>
    );
    const img = screen.getByRole('img', { name: /test image/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('does not render image when not provided', () => {
    render(<JUCard>No image</JUCard>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies interactive cursor style', () => {
    const { container } = render(<JUCard interactive>Click me</JUCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('interactive');
  });

  it('forwards onClick when interactive', () => {
    const handleClick = vi.fn();
    render(<JUCard interactive onClick={handleClick}>Clickable</JUCard>);
    fireEvent.click(screen.getByText('Clickable').closest('div')!);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('applies custom className', () => {
    const { container } = render(<JUCard className="custom-class">Content</JUCard>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('renders with different variants', () => {
    const { container, rerender } = render(<JUCard variant="glass">Glass</JUCard>);
    expect((container.firstChild as HTMLElement).className).toContain('glass');

    rerender(<JUCard variant="solid">Solid</JUCard>);
    expect((container.firstChild as HTMLElement).className).toContain('solid');

    rerender(<JUCard variant="outline">Outline</JUCard>);
    expect((container.firstChild as HTMLElement).className).toContain('outline');
  });
});
