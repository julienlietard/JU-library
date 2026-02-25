import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUCodeBlock } from './ju-code-block';

describe('JUCodeBlock', () => {
  it('renders code content', () => {
    render(<JUCodeBlock code="const x = 1;" language="js" />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });
  it('shows language label', () => {
    render(<JUCodeBlock code="test" language="python" />);
    expect(screen.getByText('python')).toBeInTheDocument();
  });
  it('renders copy button', () => {
    render(<JUCodeBlock code="test" copyable />);
    expect(screen.getByLabelText('Copy code')).toBeInTheDocument();
  });
});