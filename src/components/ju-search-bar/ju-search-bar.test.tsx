import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUSearchBar } from './ju-search-bar';

describe('JUSearchBar', () => {
  it('renders with default placeholder', () => {
    render(<JUSearchBar />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<JUSearchBar placeholder="Find files..." />);
    expect(screen.getByPlaceholderText('Find files...')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<JUSearchBar size="lg" />);
    expect(container.querySelector('.ju-search-bar')).toHaveClass('ju-search-bar--lg');
  });

  it('applies variant class', () => {
    const { container } = render(<JUSearchBar variant="dark" />);
    expect(container.querySelector('.ju-search-bar')).toHaveClass('ju-search-bar--dark');
  });

  it('shows Mac shortcut badge by default', () => {
    render(<JUSearchBar />);
    const keys = screen.getAllByText((_, el) => el?.tagName === 'KBD');
    expect(keys).toHaveLength(2);
    expect(keys[0]).toHaveTextContent('\u2318');
    expect(keys[1]).toHaveTextContent('K');
  });

  it('shows Windows shortcut badge', () => {
    render(<JUSearchBar platform="win" />);
    const keys = screen.getAllByText((_, el) => el?.tagName === 'KBD');
    expect(keys).toHaveLength(2);
    expect(keys[0]).toHaveTextContent('Ctrl');
    expect(keys[1]).toHaveTextContent('K');
  });

  it('hides shortcut badge when platform is none', () => {
    render(<JUSearchBar platform="none" />);
    const keys = screen.queryAllByText((_, el) => el?.tagName === 'KBD');
    expect(keys).toHaveLength(0);
  });

  it('fires onChange with input value', () => {
    const handler = vi.fn();
    render(<JUSearchBar onChange={handler} />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'hello' },
    });
    expect(handler).toHaveBeenCalledWith('hello');
  });

  it('fires onSubmit on Enter key', () => {
    const handler = vi.fn();
    render(<JUSearchBar onSubmit={handler} value="test query" />);
    fireEvent.keyDown(screen.getByPlaceholderText('Search...'), { key: 'Enter' });
    expect(handler).toHaveBeenCalledWith('test query');
  });

  it('applies disabled state', () => {
    const { container } = render(<JUSearchBar disabled />);
    expect(container.querySelector('.ju-search-bar')).toHaveClass('ju-search-bar--disabled');
    expect(screen.getByPlaceholderText('Search...')).toBeDisabled();
  });

  it('has accessible label', () => {
    render(<JUSearchBar />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('hides shortcut badge when input has value', () => {
    render(<JUSearchBar value="something" />);
    const keys = screen.queryAllByText((_, el) => el?.tagName === 'KBD');
    expect(keys).toHaveLength(0);
  });
});
