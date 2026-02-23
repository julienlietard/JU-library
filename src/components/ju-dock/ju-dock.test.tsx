import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUDock, JUDockItem } from './ju-dock';

const items: JUDockItem[] = [
  { id: 'home', icon: <span>🏠</span>, label: 'Home' },
  { id: 'about', icon: <span>👤</span>, label: 'About' },
  { id: 'skills', icon: <span>⚡</span>, label: 'Skills' },
];

describe('JUDock', () => {
  it('renders all dock items', () => {
    render(<JUDock items={items} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('renders items with accessible labels', () => {
    render(<JUDock items={items} />);
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('About')).toBeInTheDocument();
    expect(screen.getByLabelText('Skills')).toBeInTheDocument();
  });

  it('marks active item with aria-current', () => {
    render(<JUDock items={items} activeId="about" />);
    const aboutBtn = screen.getByLabelText('About');
    expect(aboutBtn).toHaveAttribute('aria-current', 'page');

    const homeBtn = screen.getByLabelText('Home');
    expect(homeBtn).not.toHaveAttribute('aria-current');
  });

  it('calls onItemClick with the correct id', () => {
    const handleClick = vi.fn();
    render(<JUDock items={items} onItemClick={handleClick} />);

    fireEvent.click(screen.getByLabelText('Skills'));
    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith('skills');
  });

  it('applies visible class when visible', () => {
    const { container } = render(<JUDock items={items} visible />);
    expect((container.firstChild as HTMLElement).className).toContain('visible');
  });

  it('does not apply visible class when hidden', () => {
    const { container } = render(<JUDock items={items} visible={false} />);
    expect((container.firstChild as HTMLElement).className).not.toContain('visible');
  });

  it('has navigation role', () => {
    render(<JUDock items={items} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('applies theme class', () => {
    const { container, rerender } = render(<JUDock items={items} theme="light" />);
    expect((container.firstChild as HTMLElement).className).toContain('light');

    rerender(<JUDock items={items} theme="dark" />);
    expect((container.firstChild as HTMLElement).className).toContain('dark');
  });
});
