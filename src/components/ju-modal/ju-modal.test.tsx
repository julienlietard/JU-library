import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUModal } from './ju-modal';

// Note: dialog.showModal() not supported in jsdom, so we test structure
describe('JUModal', () => {
  it('renders dialog element', () => {
    const { container } = render(<JUModal open={false} onClose={() => {}}>content</JUModal>);
    expect(container.querySelector('dialog')).toBeInTheDocument();
  });
  it('renders title', () => {
    render(<JUModal open={false} onClose={() => {}} title="Test">content</JUModal>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  it('renders close button', () => {
    render(<JUModal open={false} onClose={() => {}}>content</JUModal>);
    expect(screen.getByLabelText('Fermer')).toBeInTheDocument();
  });
  it('renders children', () => {
    render(<JUModal open={false} onClose={() => {}}>Hello modal</JUModal>);
    expect(screen.getByText('Hello modal')).toBeInTheDocument();
  });
  it('renders footer', () => {
    render(<JUModal open={false} onClose={() => {}} footer={<button>OK</button>}>content</JUModal>);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });
});