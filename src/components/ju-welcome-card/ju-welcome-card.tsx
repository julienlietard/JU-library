import React, { useState, useRef } from 'react';
import './ju-welcome-card.css';

export interface JUWelcomeCardProps {
  /** Hero image URL displayed at the top */
  heroImage?: string;
  /** Main title (supports line breaks via \n) */
  title?: string;
  /** Subtitle text below the title */
  subtitle?: string;
  /** Default avatar src */
  avatarSrc?: string;
  /** Photo upload label */
  uploadLabel?: string;
  /** Photo upload hint text */
  uploadHint?: string;
  /** Label for the display name field */
  nameLabel?: string;
  /** Placeholder for the display name input */
  namePlaceholder?: string;
  /** Submit button label */
  buttonLabel?: string;
  /** Called when user submits with username */
  onSubmit?: (data: { username: string; avatar?: File }) => void;
  /** Called when user selects a photo */
  onAvatarChange?: (file: File) => void;
  /** Loading state on submit button */
  loading?: boolean;
  /** Additional CSS class */
  className?: string;
}

const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export const JUWelcomeCard: React.FC<JUWelcomeCardProps> = ({
  heroImage,
  title = 'Welcome to Genesis,\nYour first journey here!',
  subtitle = 'Add your Photo and Pick a username',
  avatarSrc,
  uploadLabel = 'Your Photo',
  uploadHint = 'PNG or JPEG upto 5MB (500×500px)',
  nameLabel = 'Display Name',
  namePlaceholder = 'username',
  buttonLabel = 'Continue',
  onSubmit,
  onAvatarChange,
  loading = false,
  className,
}) => {
  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(avatarSrc);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    onAvatarChange?.(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ username, avatar: avatarFile });
  };

  const cls = ['ju-welcome-card', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      {heroImage && (
        <div className="ju-welcome-card__hero">
          <img src={heroImage} alt="" className="ju-welcome-card__hero-img" />
        </div>
      )}

      <form className="ju-welcome-card__body" onSubmit={handleSubmit}>
        <div className="ju-welcome-card__header">
          {title.split('\n').map((line, i) => (
            <h2 key={i} className="ju-welcome-card__title">{line}</h2>
          ))}
          {subtitle && <p className="ju-welcome-card__subtitle">{subtitle}</p>}
        </div>

        {/* Photo upload */}
        <div className="ju-welcome-card__upload">
          <div className="ju-welcome-card__avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="ju-welcome-card__avatar-img" />
            ) : (
              <span className="ju-welcome-card__avatar-placeholder">🦄</span>
            )}
          </div>
          <div className="ju-welcome-card__upload-info">
            <span className="ju-welcome-card__upload-label">{uploadLabel}</span>
            <span className="ju-welcome-card__upload-hint">{uploadHint}</span>
          </div>
          <button
            type="button"
            className="ju-welcome-card__upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <CameraIcon />
            <span>Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="ju-welcome-card__file-input"
            onChange={handleFileChange}
          />
        </div>

        {/* Display name */}
        <div className="ju-welcome-card__field">
          <label className="ju-welcome-card__label">{nameLabel}</label>
          <div className="ju-welcome-card__input-wrap">
            <span className="ju-welcome-card__input-prefix">@</span>
            <input
              type="text"
              className="ju-welcome-card__input"
              placeholder={namePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="ju-welcome-card__submit"
          disabled={loading}
        >
          {loading ? 'Loading...' : buttonLabel}
        </button>
      </form>
    </div>
  );
};
