import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUVideoPlayer } from './ju-video-player';

describe('JUVideoPlayer', () => {
  it('renders video element', () => {
    const { container } = render(<JUVideoPlayer src="/test.mp4" />);
    expect(container.querySelector('video')).toBeInTheDocument();
  });

  it('renders center controls with rewind, play, forward', () => {
    render(<JUVideoPlayer src="/test.mp4" />);
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
    expect(screen.getByLabelText('Rewind 10 seconds')).toBeInTheDocument();
    expect(screen.getByLabelText('Forward 10 seconds')).toBeInTheDocument();
  });

  it('renders progress slider', () => {
    render(<JUVideoPlayer src="/test.mp4" />);
    expect(screen.getByRole('slider', { name: 'Video progress' })).toBeInTheDocument();
  });

  it('applies custom border radius', () => {
    const { container } = render(<JUVideoPlayer src="/test.mp4" borderRadius={32} />);
    const player = container.firstElementChild as HTMLElement;
    expect(player.style.borderRadius).toBe('32px');
  });

  it('applies aspect ratio', () => {
    const { container } = render(<JUVideoPlayer src="/test.mp4" aspectRatio="1/1" />);
    const player = container.firstElementChild as HTMLElement;
    expect(player.style.aspectRatio).toBe('1/1');
  });

  it('applies custom accent color via CSS variable', () => {
    const { container } = render(<JUVideoPlayer src="/test.mp4" accentColor="#007aff" />);
    const player = container.firstElementChild as HTMLElement;
    expect(player.style.getPropertyValue('--ju-vp-accent')).toBe('#007aff');
  });

  it('respects custom skipAmount in aria labels', () => {
    render(<JUVideoPlayer src="/test.mp4" skipAmount={15} />);
    expect(screen.getByLabelText('Rewind 15 seconds')).toBeInTheDocument();
    expect(screen.getByLabelText('Forward 15 seconds')).toBeInTheDocument();
  });
});