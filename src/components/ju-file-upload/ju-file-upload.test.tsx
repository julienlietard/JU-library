import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUFileUpload } from './ju-file-upload';

describe('JUFileUpload', () => {
  it('renders drop zone', () => {
    render(<JUFileUpload />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('shows custom label', () => {
    render(<JUFileUpload label="Upload here" />);
    expect(screen.getByText('Upload here')).toBeInTheDocument();
  });
  it('shows hint text', () => {
    render(<JUFileUpload hint="Max 5 MB" />);
    expect(screen.getByText('Max 5 MB')).toBeInTheDocument();
  });
  it('renders hidden file input', () => {
    const { container } = render(<JUFileUpload accept="image/*" />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('accept', 'image/*');
  });
});