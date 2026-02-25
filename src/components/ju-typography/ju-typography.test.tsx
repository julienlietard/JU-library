import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUTypography } from './ju-typography';

describe('JUTypography', () => {
  it('renders correct tag for each variant', () => {
    const { container: c1 } = render(<JUTypography variant="h1">Test</JUTypography>);
    expect(c1.querySelector('h1')).toBeInTheDocument();
    const { container: c2 } = render(<JUTypography variant="body">Test</JUTypography>);
    expect(c2.querySelector('p')).toBeInTheDocument();
  });
  it('allows tag override with as prop', () => {
    const { container } = render(<JUTypography variant="h1" as="span">Test</JUTypography>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });
  it('applies muted class', () => {
    const { container } = render(<JUTypography muted>Test</JUTypography>);
    expect(container.firstElementChild?.className).toContain('muted');
  });
});