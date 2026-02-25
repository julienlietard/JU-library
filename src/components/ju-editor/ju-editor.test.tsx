import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUEditor } from './ju-editor';

describe('JUEditor', () => {
  it('renders textarea', () => {
    const { container } = render(<JUEditor />);
    expect(container.querySelector('textarea')).toBeInTheDocument();
  });
  it('shows toolbar', () => {
    render(<JUEditor />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });
  it('renders action buttons', () => {
    render(<JUEditor actions={['bold', 'italic']} />);
    expect(screen.getByLabelText('Gras')).toBeInTheDocument();
    expect(screen.getByLabelText('Italique')).toBeInTheDocument();
  });
  it('shows word count', () => {
    render(<JUEditor defaultValue="hello world test" />);
    expect(screen.getByText(/3 mots/)).toBeInTheDocument();
  });
  it('shows placeholder', () => {
    render(<JUEditor placeholder="Écrivez ici..." />);
    expect(screen.getByPlaceholderText('Écrivez ici...')).toBeInTheDocument();
  });
});