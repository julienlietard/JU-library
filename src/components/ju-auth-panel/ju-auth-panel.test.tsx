import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUAuthPanel } from './ju-auth-panel';

describe('JUAuthPanel', () => {
  it('renders sign-in mode by default', () => {
    render(<JUAuthPanel />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders sign-up mode with name field', () => {
    render(<JUAuthPanel mode="signup" />);
    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('toggles between sign-in and sign-up', () => {
    render(<JUAuthPanel />);
    expect(screen.queryByPlaceholderText('Full Name')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Create an account'));
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
  });

  it('calls onSubmit with email and password', () => {
    const handler = vi.fn();
    render(<JUAuthPanel onSubmit={handler} />);
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByText('Login'));
    expect(handler).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret123',
    });
  });

  it('toggles password visibility', () => {
    render(<JUAuthPanel />);
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByLabelText('Toggle visibility'));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('displays error message', () => {
    render(<JUAuthPanel error="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('calls onSocialLogin with provider name', () => {
    const handler = vi.fn();
    render(<JUAuthPanel onSocialLogin={handler} />);
    fireEvent.click(screen.getByText('Continue with Google'));
    expect(handler).toHaveBeenCalledWith('google');
    fireEvent.click(screen.getByText('Continue with Apple'));
    expect(handler).toHaveBeenCalledWith('apple');
  });

  it('shows loading text on submit button', () => {
    render(<JUAuthPanel loading />);
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  it('shows forgot password link in sign-in mode', () => {
    const handler = vi.fn();
    render(<JUAuthPanel onForgotPassword={handler} />);
    fireEvent.click(screen.getByText('Forgot password?'));
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
