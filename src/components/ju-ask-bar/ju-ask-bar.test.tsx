import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUAskBar } from './ju-ask-bar';

describe('JUAskBar', () => {
  // --- Basic rendering ---
  it('renders with default placeholder', () => {
    render(<JUAskBar />);
    expect(screen.getByPlaceholderText('Ask a Question..')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(<JUAskBar placeholder="Write something..." />);
    expect(screen.getByPlaceholderText('Write something...')).toBeInTheDocument();
  });

  it('applies the main container class', () => {
    const { container } = render(<JUAskBar />);
    expect(container.querySelector('.ju-ask-bar')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<JUAskBar />);
    expect(screen.getByLabelText('Submit')).toBeInTheDocument();
  });

  it('has accessible label on input', () => {
    render(<JUAskBar />);
    expect(screen.getByLabelText('Ask a question')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<JUAskBar className="my-custom" />);
    expect(container.querySelector('.ju-ask-bar')).toHaveClass('my-custom');
  });

  // --- Events ---
  it('fires onChange with input value', () => {
    const handler = vi.fn();
    render(<JUAskBar onChange={handler} />);
    fireEvent.change(screen.getByPlaceholderText('Ask a Question..'), {
      target: { value: 'hello' },
    });
    expect(handler).toHaveBeenCalledWith('hello');
  });

  it('fires onSubmit on Enter key when value is not empty', () => {
    const handler = vi.fn();
    render(<JUAskBar onSubmit={handler} value="test query" />);
    fireEvent.keyDown(screen.getByPlaceholderText('Ask a Question..'), {
      key: 'Enter',
    });
    expect(handler).toHaveBeenCalledWith('test query');
  });

  it('does not fire onSubmit on Enter when value is empty', () => {
    const handler = vi.fn();
    render(<JUAskBar onSubmit={handler} value="" />);
    fireEvent.keyDown(screen.getByPlaceholderText('Ask a Question..'), {
      key: 'Enter',
    });
    expect(handler).not.toHaveBeenCalled();
  });

  it('fires onSubmit when button is clicked', () => {
    const handler = vi.fn();
    render(<JUAskBar onSubmit={handler} value="click submit" />);
    fireEvent.click(screen.getByLabelText('Submit'));
    expect(handler).toHaveBeenCalledWith('click submit');
  });

  // --- Sizes ---
  it('applies size class (sm)', () => {
    const { container } = render(<JUAskBar size="sm" />);
    expect(container.querySelector('.ju-ask-bar--sm')).toBeInTheDocument();
  });

  it('applies size class (md) by default', () => {
    const { container } = render(<JUAskBar />);
    expect(container.querySelector('.ju-ask-bar--md')).toBeInTheDocument();
  });

  it('applies size class (lg)', () => {
    const { container } = render(<JUAskBar size="lg" />);
    expect(container.querySelector('.ju-ask-bar--lg')).toBeInTheDocument();
  });

  // --- Variants ---
  it('applies raised variant by default', () => {
    const { container } = render(<JUAskBar />);
    expect(container.querySelector('.ju-ask-bar--raised')).toBeInTheDocument();
  });

  it('applies flat variant', () => {
    const { container } = render(<JUAskBar variant="flat" />);
    expect(container.querySelector('.ju-ask-bar--flat')).toBeInTheDocument();
  });

  it('applies outline variant', () => {
    const { container } = render(<JUAskBar variant="outline" />);
    expect(container.querySelector('.ju-ask-bar--outline')).toBeInTheDocument();
  });

  // --- Loading ---
  it('shows spinner when loading', () => {
    const { container } = render(<JUAskBar loading />);
    expect(container.querySelector('.ju-ask-bar__spinner')).toBeInTheDocument();
    expect(container.querySelector('.ju-ask-bar--loading')).toBeInTheDocument();
  });

  it('disables input and button when loading', () => {
    render(<JUAskBar loading />);
    expect(screen.getByPlaceholderText('Ask a Question..')).toBeDisabled();
    expect(screen.getByLabelText('Submit')).toBeDisabled();
  });

  it('does not fire onSubmit on Enter when loading', () => {
    const handler = vi.fn();
    render(<JUAskBar onSubmit={handler} value="test" loading />);
    fireEvent.keyDown(screen.getByPlaceholderText('Ask a Question..'), {
      key: 'Enter',
    });
    expect(handler).not.toHaveBeenCalled();
  });

  // --- Disabled ---
  it('applies disabled state', () => {
    const { container } = render(<JUAskBar disabled />);
    expect(container.querySelector('.ju-ask-bar')).toHaveClass('ju-ask-bar--disabled');
    expect(screen.getByPlaceholderText('Ask a Question..')).toBeDisabled();
    expect(screen.getByLabelText('Submit')).toBeDisabled();
  });

  // --- Shortcut ---
  it('renders shortcut hint by default', () => {
    const { container } = render(<JUAskBar />);
    expect(container.querySelector('.ju-ask-bar__shortcut')).toBeInTheDocument();
  });

  it('renders custom shortcut text', () => {
    const { container } = render(<JUAskBar shortcut="Enter" />);
    const shortcut = container.querySelector('.ju-ask-bar__shortcut');
    expect(shortcut).toBeInTheDocument();
    expect(shortcut?.textContent).toBe('Enter');
  });

  it('hides shortcut when shortcut is false', () => {
    const { container } = render(<JUAskBar shortcut={false} />);
    expect(container.querySelector('.ju-ask-bar__shortcut')).not.toBeInTheDocument();
  });

  // --- Max length ---
  it('renders character counter when maxLength is set', () => {
    const { container } = render(<JUAskBar maxLength={100} />);
    const counter = container.querySelector('.ju-ask-bar__counter');
    expect(counter).toBeInTheDocument();
    expect(counter?.textContent).toBe('0/100');
  });

  it('shows current length in counter', () => {
    const { container } = render(<JUAskBar maxLength={100} value="hello" />);
    const counter = container.querySelector('.ju-ask-bar__counter');
    expect(counter?.textContent).toBe('5/100');
  });

  it('applies limit class when at max length', () => {
    const { container } = render(<JUAskBar maxLength={5} value="hello" />);
    expect(container.querySelector('.ju-ask-bar__counter--limit')).toBeInTheDocument();
  });

  it('does not render counter without maxLength', () => {
    const { container } = render(<JUAskBar />);
    expect(container.querySelector('.ju-ask-bar__counter')).not.toBeInTheDocument();
  });

  // --- Custom icon ---
  it('renders custom icon in submit button', () => {
    render(<JUAskBar icon={<span data-testid="custom-ico">X</span>} />);
    expect(screen.getByTestId('custom-ico')).toBeInTheDocument();
  });
});
