import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUSidebar } from './ju-sidebar';

describe('JUSidebar', () => {
  const sections = [{ title: 'Nav', items: [{ label: 'Home' }, { label: 'About' }] }];

  it('renders aside element', () => {
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

  it('renders header when provided', () => {
    render(<JUSidebar sections={sections} header={<span>My Header</span>} />);
    expect(screen.getByText('My Header')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<JUSidebar sections={sections} footer={<span>My Footer</span>} />);
    expect(screen.getByText('My Footer')).toBeInTheDocument();
  });

  it('renders active link with active class', () => {
    const activeSections = [{ items: [{ label: 'Active Item', active: true }] }];
    render(<JUSidebar sections={activeSections} />);
    const link = screen.getByText('Active Item');
    expect(link.className).toContain('ju-sb__link--active');
  });

  it('applies left position class by default', () => {
    const { container } = render(<JUSidebar sections={sections} />);
    expect(container.querySelector('.ju-sb--left')).toBeInTheDocument();
  });

  it('applies right position class', () => {
    const { container } = render(<JUSidebar sections={sections} position="right" />);
    expect(container.querySelector('.ju-sb--right')).toBeInTheDocument();
  });

  it('renders link as anchor when href is provided', () => {
    const linkSections = [{ items: [{ label: 'Link', href: '/test' }] }];
    render(<JUSidebar sections={linkSections} />);
    const link = screen.getByText('Link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders link as button when no href', () => {
    render(<JUSidebar sections={sections} />);
    const link = screen.getByText('Home');
    expect(link.tagName).toBe('BUTTON');
  });

  it('renders icons when provided', () => {
    const iconSections = [{ items: [{ label: 'With Icon', icon: <svg data-testid="icon" /> }] }];
    render(<JUSidebar sections={iconSections} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<JUSidebar sections={sections} className="custom" />);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });

  it('renders multiple sections', () => {
    const multi = [
      { title: 'Section A', items: [{ label: 'A1' }] },
      { title: 'Section B', items: [{ label: 'B1' }] },
    ];
    render(<JUSidebar sections={multi} />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('B1')).toBeInTheDocument();
  });
});
