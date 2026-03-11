import React, { useState, useCallback } from 'react';
import { JUCard } from '../ju-card/ju-card';
import { JUButton } from '../ju-button/ju-button';
import { JUInput } from '../ju-input/ju-input';
import './ju-auth-panel.css';

/* ── Types ── */

export type JUAuthPanelMode = 'signin' | 'signup';

export interface JUAuthPanelProps {
  /** Current mode */
  mode?: JUAuthPanelMode;
  /** Called on form submission */
  onSubmit?: (data: { email: string; password: string; name?: string }) => void;
  /** Called when a social provider button is clicked */
  onSocialLogin?: (provider: 'google' | 'facebook' | 'x' | 'apple') => void;
  /** Called when "Forgot password?" is clicked */
  onForgotPassword?: () => void;
  /** Show loading state on submit button */
  loading?: boolean;
  /** Error message displayed below form */
  error?: string;
  /** Additional CSS class */
  className?: string;
}

/* ── Icons ── */

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

/* ── Social brand icons ── */

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

/* ── Component ── */

export const JUAuthPanel: React.FC<JUAuthPanelProps> = ({
  mode: controlledMode,
  onSubmit,
  onSocialLogin,
  onForgotPassword,
  loading = false,
  error,
  className,
}) => {
  const [internalMode, setInternalMode] = useState<JUAuthPanelMode>('signin');
  const mode = controlledMode ?? internalMode;
  const isSignUp = mode === 'signup';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.({ email, password, ...(isSignUp ? { name } : {}) });
    },
    [email, password, name, isSignUp, onSubmit],
  );

  const toggleMode = useCallback(() => {
    setInternalMode((m) => (m === 'signin' ? 'signup' : 'signin'));
  }, []);

  const cls = ['ju-auth-panel', className ?? ''].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="none" className={cls}>
      <form className="ju-auth-panel__form" onSubmit={handleSubmit} noValidate>
        {/* Header */}
        <div className="ju-auth-panel__header">
          <h2 className="ju-auth-panel__title">
            {isSignUp ? 'Sign up' : 'Sign in'}
          </h2>
          <p className="ju-auth-panel__switch">
            {isSignUp ? 'Already have an account?' : 'New user?'}{' '}
            <button
              type="button"
              className="ju-auth-panel__switch-link"
              onClick={toggleMode}
            >
              {isSignUp ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>

        {/* Fields */}
        <div className="ju-auth-panel__fields">
          {isSignUp && (
            <JUInput
              placeholder="Full Name"
              icon={<UserIcon />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              fullWidth
            />
          )}

          <JUInput
            type="email"
            placeholder="Email Address"
            icon={<MailIcon />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            autoComplete="email"
            fullWidth
          />

          <JUInput
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            icon={<LockIcon />}
            trailingIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
            onTrailingClick={() => setShowPassword((v) => !v)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            fullWidth
          />
        </div>

        {/* Forgot password */}
        {!isSignUp && (
          <button
            type="button"
            className="ju-auth-panel__forgot"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
        )}

        {/* Error message */}
        {error && (
          <p className="ju-auth-panel__error" role="alert">
            {error}
          </p>
        )}

        {/* Submit button */}
        <JUButton
          label={loading ? (isSignUp ? 'Creating...' : 'Signing in...') : (isSignUp ? 'Create account' : 'Login')}
          variant="dark"
          isFullWidth
          disabled={loading}
          type="submit"
        />

        {/* Separator */}
        <div className="ju-auth-panel__sep">
          <span className="ju-auth-panel__sep-text">or</span>
        </div>

        {/* Social logins */}
        <div className="ju-auth-panel__social">
          <button type="button" className="ju-auth-panel__social-btn" onClick={() => onSocialLogin?.('google')}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
          <button type="button" className="ju-auth-panel__social-btn" onClick={() => onSocialLogin?.('facebook')}>
            <FacebookIcon />
            <span>Continue with Facebook</span>
          </button>
          <button type="button" className="ju-auth-panel__social-btn" onClick={() => onSocialLogin?.('x')}>
            <XIcon />
            <span>Continue with X</span>
          </button>
          <button type="button" className="ju-auth-panel__social-btn" onClick={() => onSocialLogin?.('apple')}>
            <AppleIcon />
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Footer */}
        <p className="ju-auth-panel__footer">
          By signing in with an account, you agree to our{' '}
          <a href="#terms" className="ju-auth-panel__link">Terms of Service</a>
          {' '}and{' '}
          <a href="#privacy" className="ju-auth-panel__link">Privacy Policy</a>.
        </p>
      </form>
    </JUCard>
  );
};
