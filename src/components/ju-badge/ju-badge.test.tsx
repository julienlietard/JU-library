import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { createRef } from 'react';
import { JUBadge } from './ju-badge';

describe('JUBadge', () => {
  it('renders label text', () => {
    render(<JUBadge label="React" />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<JUBadge label="Test" />);
    const el = container.firstChild as HTMLElement;
    expect(el.classList.contains('ju-badge')).toBe(true);
    expect(el.classList.contains('ju-badge--default')).toBe(true);
    expect(el.classList.contains('ju-badge--md')).toBe(true);
    expect(el.classList.contains('ju-badge--soft')).toBe(true);
  });

  it('applies color, size, variant classes', () => {
    const { container } = render(<JUBadge label="X" color="blue" size="lg" variant="solid" />);
    const el = container.firstChild as HTMLElement;
    expect(el.classList.contains('ju-badge--blue')).toBe(true);
    expect(el.classList.contains('ju-badge--lg')).toBe(true);
    expect(el.classList.contains('ju-badge--solid')).toBe(true);
  });

  it('renders dot indicator', () => {
    const { container } = render(<JUBadge label="Dot" dot />);
    expect(container.querySelector('.ju-badge__dot')).not.toBeNull();
  });

  it('renders icon', () => {
    const { container } = render(<JUBadge label="Icon" icon={<span data-testid="ic">★</span>} />);
    expect(screen.getByTestId('ic')).toBeInTheDocument();
    expect(container.querySelector('.ju-badge__icon')).not.toBeNull();
  });

  it('applies iconBg class', () => {
    const { container } = render(<JUBadge label="Icon" icon={<span>★</span>} iconBg />);
    expect(container.querySelector('.ju-badge__icon--bg')).not.toBeNull();
  });

  it('applies glass class', () => {
    const { container } = render(<JUBadge label="Glass" glass />);
    expect((container.firstChild as HTMLElement).classList.contains('ju-badge--glass')).toBe(true);
  });

  it('applies pill class', () => {
    const { container } = render(<JUBadge label="Pill" pill />);
    expect((container.firstChild as HTMLElement).classList.contains('ju-badge--pill')).toBe(true);
  });

  it('applies effect class', () => {
    const { container } = render(<JUBadge label="Glow" effect="glow" />);
    expect((container.firstChild as HTMLElement).classList.contains('ju-badge--effect-glow')).toBe(true);
  });

  it('does not add effect class for none', () => {
    const { container } = render(<JUBadge label="None" effect="none" />);
    const el = container.firstChild as HTMLElement;
    expect([...el.classList].some(c => c.includes('effect'))).toBe(false);
  });

  it('renders shine overlay for shine effect', () => {
    const { container } = render(<JUBadge label="Shine" effect="shine" />);
    expect(container.querySelector('.ju-badge__shine')).not.toBeNull();
  });

  it('does not render shine overlay for other effects', () => {
    const { container } = render(<JUBadge label="Glow" effect="glow" />);
    expect(container.querySelector('.ju-badge__shine')).toBeNull();
  });

  it('renders remove button when removable', () => {
    const { container } = render(<JUBadge label="Remove" removable />);
    const btn = container.querySelector('.ju-badge__remove') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('aria-label')).toBe('Remove Remove');
  });

  it('calls onRemove when remove button clicked', () => {
    const onRemove = vi.fn();
    const { container } = render(<JUBadge label="Tag" removable onRemove={onRemove} />);
    fireEvent.click(container.querySelector('.ju-badge__remove')!);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('remove button stops propagation', () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(<JUBadge label="Tag" removable onRemove={onRemove} onClick={onClick} />);
    fireEvent.click(container.querySelector('.ju-badge__remove')!);
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies clickable class and role=button', () => {
    const { container } = render(<JUBadge label="Click" clickable />);
    const el = container.firstChild as HTMLElement;
    expect(el.classList.contains('ju-badge--clickable')).toBe(true);
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('applies clickable when onClick is provided', () => {
    const { container } = render(<JUBadge label="Click" onClick={() => {}} />);
    const el = container.firstChild as HTMLElement;
    expect(el.classList.contains('ju-badge--clickable')).toBe(true);
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<JUBadge label="Ref Test" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('accepts custom inline styles', () => {
    const { container } = render(<JUBadge label="Test" style={{ marginTop: '10px' }} />);
    expect((container.firstChild as HTMLElement).style.marginTop).toBe('10px');
  });

  it('passes generic HTML attributes', () => {
    render(<JUBadge label="Data" data-testid="custom-badge" />);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<JUBadge label="Custom" className="my-class" />);
    expect((container.firstChild as HTMLElement).classList.contains('my-class')).toBe(true);
  });
});
