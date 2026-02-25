import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUCard } from './ju-card';

describe('JUCard', () => {
  it('renders children', () => {
    render(<JUCard><p>Hello</p></JUCard>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders top image when provided', () => {
    render(<JUCard image={{ src: '/test.png', alt: 'Test' }}>Content</JUCard>);
    expect(screen.getByRole('img', { name: 'Test' })).toBeInTheDocument();
  });

  it('visual variant uses background image style', () => {
    const { container } = render(
      <JUCard variant="visual" backgroundImage="/bg.png">
        <p>Overlay</p>
      </JUCard>
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.style.backgroundImage).toContain('/bg.png');
  });

  it('visual variant wraps children in overlay', () => {
    render(
      <JUCard variant="visual" backgroundImage="/bg.png">
        <p>Over it</p>
      </JUCard>
    );
    expect(screen.getByText('Over it')).toBeInTheDocument();
  });

  it('does not render top image in visual variant', () => {
    render(
      <JUCard variant="visual" image={{ src: '/top.png', alt: 'Top' }}>
        <p>Visual</p>
      </JUCard>
    );
    expect(screen.queryByRole('img', { name: 'Top' })).not.toBeInTheDocument();
  });

  it('applies aspect ratio style', () => {
    const { container } = render(<JUCard aspectRatio="1/1">X</JUCard>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.style.aspectRatio).toBe('1/1');
  });
});