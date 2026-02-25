import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JUTooltip } from './ju-tooltip';

describe('JUTooltip', () => {
  it('does not render tooltip content initially', () => {
    render(
      <JUTooltip content="Tip text">
        <button>Hover me</button>
      </JUTooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter after delay', async () => {
    render(
      <JUTooltip content="Tip text" delay={0}>
        <button>Hover me</button>
      </JUTooltip>
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
    expect(screen.getByText('Tip text')).toBeInTheDocument();
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <JUTooltip content="Tip text" delay={0} hideDelay={0}>
        <button>Hover me</button>
      </JUTooltip>
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    fireEvent.mouseLeave(screen.getByText('Hover me'));
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('does not show when disabled', async () => {
    render(
      <JUTooltip content="Tip text" delay={0} disabled>
        <button>Hover me</button>
      </JUTooltip>
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('applies custom maxWidth', async () => {
    render(
      <JUTooltip content="Tip text" delay={0} maxWidth={180}>
        <button>Hover me</button>
      </JUTooltip>
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.maxWidth).toBe('180px');
    });
  });

  it('sets aria-describedby on trigger when visible', async () => {
    render(
      <JUTooltip content="Tip text" delay={0}>
        <button>Hover me</button>
      </JUTooltip>
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByText('Hover me').getAttribute('aria-describedby')).toBe('ju-tooltip-content');
    });
  });
});