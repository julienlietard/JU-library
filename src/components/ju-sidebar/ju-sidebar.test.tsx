import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUSidebar } from './ju-sidebar';

describe('JUSidebar', () => {
  const sections = [{ title: 'Nav', items: [{ label: 'Home' }, { label: 'About' }] }];
  it('renders aside', () => {
    render(<JUSidebar sections={sections} />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });
  it('renders items', () => {
    render(<JUSidebar sections={sections} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });
  it('renders section title', () => {
    render(<JUSidebar sections={sections} />);
    expect(screen.getByText('Nav')).toBeInTheDocument();
  });
  it('toggle button exists', () => {
    render(<JUSidebar sections={sections} />);
    expect(screen.getByLabelText('Fermer le panneau')).toBeInTheDocument();
  });
  it('calls onOpenChange', () => {
    const fn = vi.fn();
    render(<JUSidebar sections={sections} onOpenChange={fn} />);
    fireEvent.click(screen.getByLabelText('Fermer le panneau'));
    expect(fn).toHaveBeenCalledWith(false);
  });
});