import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUToast, JUToastContainer } from './ju-toast';

describe('JUToast', () => {
  it('renders message', () => {
    render(<JUToast toast={{ id: '1', message: 'Hello' }} onDismiss={() => {}} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  it('has alert role', () => {
    render(<JUToast toast={{ id: '1', message: 'Alert' }} onDismiss={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
  it('renders close button', () => {
    render(<JUToast toast={{ id: '1', message: 'Test' }} onDismiss={() => {}} />);
    expect(screen.getByLabelText('Fermer')).toBeInTheDocument();
  });
});

describe('JUToastContainer', () => {
  it('renders multiple toasts', () => {
    const toasts = [
      { id: '1', message: 'First' },
      { id: '2', message: 'Second' },
    ];
    render(<JUToastContainer toasts={toasts} onDismiss={() => {}} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});