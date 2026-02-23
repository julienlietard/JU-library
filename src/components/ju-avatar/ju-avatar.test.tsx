import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUAvatar } from './ju-avatar';

describe('JUAvatar', () => {
  it('renders image when src provided', () => {
    render(<JUAvatar src="/test.png" alt="Test user" />);
    expect(screen.getByRole('img', { name: 'Test user' })).toBeInTheDocument();
  });

  it('renders initials when no src', () => {
    render(<JUAvatar initials="JL" />);
    expect(screen.getByText('JL')).toBeInTheDocument();
  });

  it('renders status dot', () => {
    render(<JUAvatar initials="JL" status="online" />);
    expect(screen.getByLabelText('online')).toBeInTheDocument();
  });

  it('renders fallback ? when no src and no initials', () => {
    render(<JUAvatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });
});
