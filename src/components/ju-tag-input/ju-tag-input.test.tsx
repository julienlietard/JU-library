import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUTagInput } from './ju-tag-input';

describe('JUTagInput', () => {
  it('renders default tags', () => {
    render(<JUTagInput defaultValue={['React', 'TS']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TS')).toBeInTheDocument();
  });
  it('renders label', () => {
    render(<JUTagInput label="Tags" />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });
  it('shows error', () => {
    render(<JUTagInput error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
  it('shows remove buttons for each tag', () => {
    render(<JUTagInput defaultValue={['A', 'B']} />);
    expect(screen.getByLabelText('Remove A')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove B')).toBeInTheDocument();
  });
});