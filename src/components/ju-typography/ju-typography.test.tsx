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

  it('applies gradient class', () => {
    const { container } = render(<JUTypography gradient>Test</JUTypography>);
    expect(container.firstElementChild?.className).toContain('gradient');
  });

  it('applies balance class', () => {
    const { container } = render(<JUTypography balance>Test</JUTypography>);
    expect(container.firstElementChild?.className).toContain('balance');
  });

  it('applies text alignment via inline style', () => {
    const { container } = render(<JUTypography align="center">Test</JUTypography>);
    expect(container.firstElementChild).toHaveStyle({ textAlign: 'center' });
  });

  it('renders children text content', () => {
    render(<JUTypography>Hello World</JUTypography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<JUTypography className="custom">Test</JUTypography>);
    expect(container.firstElementChild?.className).toContain('custom');
  });

  it('maps variants to correct default tags', () => {
    const { container: cLead } = render(<JUTypography variant="lead">Test</JUTypography>);
    expect(cLead.querySelector('p')).toBeInTheDocument();

    const { container: cSmall } = render(<JUTypography variant="small">Test</JUTypography>);
    expect(cSmall.querySelector('p')).toBeInTheDocument();

    const { container: cCaption } = render(<JUTypography variant="caption">Test</JUTypography>);
    expect(cCaption.querySelector('span')).toBeInTheDocument();
  });
});
