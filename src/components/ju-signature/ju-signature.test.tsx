import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUSignature } from './ju-signature';

describe('JUSignature', () => {
  it('renders trigger with default label', () => {
    render(<JUSignature />);
    expect(screen.getByText('Sign')).toBeInTheDocument();
  });

  it('renders trigger with custom label', () => {
    render(<JUSignature label="Add Signature" />);
    expect(screen.getByText('Add Signature')).toBeInTheDocument();
  });

  it('opens panel when trigger is clicked', () => {
    render(<JUSignature />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Sign'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('panel shows custom title', () => {
    render(<JUSignature title="Your Signature" />);
    fireEvent.click(screen.getByText('Sign'));
    expect(screen.getByText('Your Signature')).toBeInTheDocument();
  });

  it('shows clear and close buttons when open', () => {
    render(<JUSignature />);
    fireEvent.click(screen.getByText('Sign'));
    expect(screen.getByLabelText('Clear signature')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('clear button is disabled when no strokes', () => {
    render(<JUSignature />);
    fireEvent.click(screen.getByText('Sign'));
    expect(screen.getByLabelText('Clear signature')).toBeDisabled();
  });

  it('save button is disabled when no strokes', () => {
    render(<JUSignature />);
    fireEvent.click(screen.getByText('Sign'));
    const saveBtn = screen.getByText('Finish Signing').closest('button')!;
    expect(saveBtn).toBeDisabled();
  });

  it('renders canvas element when open', () => {
    const { container } = render(<JUSignature />);
    fireEvent.click(screen.getByText('Sign'));
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('closes panel when close button is clicked', () => {
    render(<JUSignature />);
    fireEvent.click(screen.getByText('Sign'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes panel on Escape key', () => {
    render(<JUSignature />);
    fireEvent.click(screen.getByText('Sign'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes panel on click outside', () => {
    render(
      <div>
        <div data-testid="outside">outside</div>
        <JUSignature />
      </div>,
    );
    fireEvent.click(screen.getByText('Sign'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies light variant class by default', () => {
    const { container } = render(<JUSignature />);
    expect(container.querySelector('.ju-sig--light')).toBeInTheDocument();
  });

  it('applies dark variant class', () => {
    const { container } = render(<JUSignature variant="dark" />);
    expect(container.querySelector('.ju-sig--dark')).toBeInTheDocument();
  });

  it('applies white variant class', () => {
    const { container } = render(<JUSignature variant="white" />);
    expect(container.querySelector('.ju-sig--white')).toBeInTheDocument();
  });

  it('applies open class when opened', () => {
    const { container } = render(<JUSignature />);
    expect(container.querySelector('.ju-sig--open')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Sign'));
    expect(container.querySelector('.ju-sig--open')).toBeInTheDocument();
  });
});