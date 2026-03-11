import React from 'react';
import './ju-user-pill.css';

export interface JUUserPillProps {
  /** Nom de l'utilisateur */
  name: string;
  /** URL de l'avatar (optionnel, affiche la première lettre si absent) */
  avatarUrl?: string;
  /** Fonction appelée lors du clic sur la croix (masque la croix si non fourni) */
  onDismiss?: () => void;
  className?: string;
}

export const JUUserPill: React.FC<JUUserPillProps> = ({
  name,
  avatarUrl,
  onDismiss,
  className = '',
}) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`ju-user-pill ${className}`.trim()}>
      <div className="ju-user-pill__avatar-container">
        {avatarUrl ? (
          <img src={avatarUrl} alt={`Avatar de ${name}`} className="ju-user-pill__avatar" />
        ) : (
          <div className="ju-user-pill__avatar-fallback">{initial}</div>
        )}
      </div>
      <span className="ju-user-pill__name">{name}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ju-user-pill__dismiss"
          aria-label={`Supprimer ${name}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};