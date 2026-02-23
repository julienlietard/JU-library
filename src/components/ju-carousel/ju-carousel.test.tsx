import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { JUCarousel } from './ju-carousel';

const renderCarousel = (props = {}) =>
  render(
    <JUCarousel autoPlay={false} {...props}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </JUCarousel>,
  );

describe('JUCarousel', () => {
  it('renders all slides', () => {
    renderCarousel();
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });

  it('has carousel role', () => {
    renderCarousel();
    expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('renders dot indicators', () => {
    renderCarousel({ itemsPerSlide: 1 });
    const dots = screen.getAllByRole('tab');
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });

  it('first dot is active by default', () => {
    renderCarousel({ itemsPerSlide: 1 });
    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking a dot navigates to the corresponding slide', () => {
    renderCarousel({ itemsPerSlide: 1 });
    const dots = screen.getAllByRole('tab');
    if (dots.length > 1) {
      fireEvent.click(dots[1]);
      expect(dots[1]).toHaveAttribute('aria-selected', 'true');
    }
  });

  it('hides dots when showDots is false', () => {
    renderCarousel({ showDots: false, showPlayButton: false });
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('renders play/pause button', () => {
    renderCarousel({ showPlayButton: true });
    expect(screen.getByLabelText(/auto-play/i)).toBeInTheDocument();
  });

  it('toggles play/pause on click', () => {
    renderCarousel({ showPlayButton: true });
    const btn = screen.getByLabelText(/start auto-play/i);
    fireEvent.click(btn);
    expect(screen.getByLabelText(/pause auto-play/i)).toBeInTheDocument();
  });

  it('hides play button when showPlayButton is false', () => {
    renderCarousel({ showPlayButton: false });
    expect(screen.queryByLabelText(/auto-play/i)).not.toBeInTheDocument();
  });

  it('auto-plays when enabled', () => {
    vi.useFakeTimers();
    renderCarousel({ autoPlay: true, interval: 1000, itemsPerSlide: 1 });

    const dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
    vi.useRealTimers();
  });

  it('each slide has proper aria attributes', () => {
    renderCarousel();
    const slides = screen.getAllByRole('group');
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide');
  });
});
