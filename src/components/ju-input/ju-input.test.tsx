import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUInput } from './ju-input';

describe('JUInput', () => {
  it('renders with placeholder', () => {
    render(<JUInput placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('displays leading icon', () => {
    const { container } = render(
      <JUInput placeholder="test" icon={<span data-testid="icon">@</span>} />,
    );
    expect(container.querySelector('.ju-input__icon')).toBeInTheDocument();
    expect(container.querySelector('.ju-input')).toHaveClass('ju-input--has-icon');
  });

  it('fires onChange', () => {
    const handler = vi.fn();
    render(<JUInput placeholder="test" onChange={handler} />);
    fireEvent.change(screen.getByPlaceholderText('test'), { target: { value: 'hello' } });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('applies error class', () => {
    const { container } = render(<JUInput placeholder="test" error />);
    expect(container.querySelector('.ju-input')).toHaveClass('ju-input--error');
  });

  it('applies fullWidth class', () => {
    const { container } = render(<JUInput placeholder="test" fullWidth />);
    expect(container.querySelector('.ju-input')).toHaveClass('ju-input--full');
  });

  it('calls onTrailingClick when trailing icon is clicked', () => {
    const handler = vi.fn();
    render(
      <JUInput
        placeholder="Password"
        trailingIcon={<span>eye</span>}
        onTrailingClick={handler}
      />,
    );
    fireEvent.click(screen.getByLabelText('Toggle visibility'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('sets aria-invalid when error is true', () => {
    render(<JUInput placeholder="test" error />);
    expect(screen.getByPlaceholderText('test')).toHaveAttribute('aria-invalid', 'true');
  });
});
