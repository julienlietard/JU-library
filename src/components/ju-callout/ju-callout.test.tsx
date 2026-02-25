import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUCallout } from './ju-callout';

describe('JUCallout', () => {
  it('renders children', () => {
    render(<JUCallout>Hello</JUCallout>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  it('renders title when provided', () => {
    render(<JUCallout title="Warning">Content</JUCallout>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
  it('has role note', () => {
    render(<JUCallout>Test</JUCallout>);
    expect(screen.getByRole('note')).toBeInTheDocument();
  });
  it('hides icon when hideIcon is true', () => {
    const { container } = render(<JUCallout hideIcon>Test</JUCallout>);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});