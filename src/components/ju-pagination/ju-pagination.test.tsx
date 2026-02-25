import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUPagination } from './ju-pagination';

describe('JUPagination', () => {
  it('renders navigation', () => {
    render(<JUPagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination');
  });
  it('marks current page', () => {
    render(<JUPagination page={3} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Page 3')).toHaveAttribute('aria-current', 'page');
  });
  it('disables prev on first page', () => {
    render(<JUPagination page={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Page précédente')).toBeDisabled();
  });
  it('disables next on last page', () => {
    render(<JUPagination page={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByLabelText('Page suivante')).toBeDisabled();
  });
  it('calls onPageChange', () => {
    const fn = vi.fn();
    render(<JUPagination page={3} totalPages={5} onPageChange={fn} />);
    fireEvent.click(screen.getByLabelText('Page 4'));
    expect(fn).toHaveBeenCalledWith(4);
  });
  it('returns null for single page', () => {
    const { container } = render(<JUPagination page={1} totalPages={1} onPageChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});