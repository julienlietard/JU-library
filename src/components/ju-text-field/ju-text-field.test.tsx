import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUTextField } from './ju-text-field';

describe('JUTextField', () => {
  it('renders input with label', () => {
    render(<JUTextField label="Name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });
  it('shows error message', () => {
    render(<JUTextField label="Email" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
  it('shows hint text', () => {
    render(<JUTextField label="Bio" hint="Write something" />);
    expect(screen.getByText('Write something')).toBeInTheDocument();
  });
  it('renders textarea when multiline', () => {
    const { container } = render(<JUTextField label="Desc" multiline />);
    expect(container.querySelector('textarea')).toBeInTheDocument();
  });
});