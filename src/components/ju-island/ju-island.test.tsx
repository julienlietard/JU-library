import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUIsland } from './ju-island';

const links = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
];

describe('JUIsland', () => {
  it('renders section label', () => {
    render(<JUIsland sectionLabel="Compétences" progress={50} />);
    expect(screen.getByText('Compétences')).toBeInTheDocument();
  });

  it('renders progress percentage', () => {
    render(<JUIsland progress={42} />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('clamps progress to 0-100', () => {
    const { rerender } = render(<JUIsland progress={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<JUIsland progress={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('returns null when not visible', () => {
    const { container } = render(<JUIsland visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows links when clicked (opened)', () => {
    render(<JUIsland links={links} />);
    expect(screen.queryByText('About')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('status'));
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  it('closes on second click', () => {
    render(<JUIsland links={links} />);
    const island = screen.getByRole('status');

    fireEvent.click(island);
    expect(screen.getByText('About')).toBeInTheDocument();

    fireEvent.click(island);
    expect(screen.queryByText('About')).not.toBeInTheDocument();
  });

  it('calls onLinkClick with correct id and href', () => {
    const handleClick = vi.fn();
    render(<JUIsland links={links} onLinkClick={handleClick} />);

    fireEvent.click(screen.getByRole('status'));
    fireEvent.click(screen.getByText('Skills'));

    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith('skills', '#skills');
  });

  it('has accessible role and label', () => {
    render(<JUIsland sectionLabel="Home" progress={25} />);
    const island = screen.getByRole('status');
    expect(island).toHaveAttribute('aria-label', 'Home — 25% scrolled');
  });

  it('renders TOC nav with aria-label when open', () => {
    render(<JUIsland links={links} />);
    fireEvent.click(screen.getByRole('status'));
    expect(screen.getByRole('navigation', { name: /table of contents/i })).toBeInTheDocument();
  });

  it('marks active link with aria-current', () => {
    render(<JUIsland links={links} activeId="about" />);
    fireEvent.click(screen.getByRole('status'));
    const activeLink = screen.getByText('About');
    expect(activeLink).toHaveAttribute('aria-current', 'location');
    expect(activeLink).toHaveClass('ju-island__toc-item--active');
  });

  it('does not mark inactive links with aria-current', () => {
    render(<JUIsland links={links} activeId="about" />);
    fireEvent.click(screen.getByRole('status'));
    const inactiveLink = screen.getByText('Skills');
    expect(inactiveLink).not.toHaveAttribute('aria-current');
    expect(inactiveLink).not.toHaveClass('ju-island__toc-item--active');
  });
});
