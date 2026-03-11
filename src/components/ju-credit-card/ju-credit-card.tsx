import React from 'react';
import './ju-credit-card.css';
import { JUUserPill } from '../ju-user-pill/ju-user-pill';

export type JUCreditCardVariant = 'default' | 'user';
export type JUCreditCardBackground = 'aurora' | 'solid' | 'image';

export interface JUCreditCardProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  variant?: JUCreditCardVariant;
  bgType?: JUCreditCardBackground;
  /** Utilisé si bgType = 'solid' */
  bgColor?: string;
  /** Utilisé si bgType = 'image' */
  bgUrl?: string;
  /** Props pour la variante 'user' */
  userAvatarUrl?: string;
  onUserDismiss?: () => void;
  className?: string;
}

export const JUCreditCard: React.FC<JUCreditCardProps> = ({
  cardNumber,
  cardholderName,
  expiryDate,
  variant = 'default',
  bgType = 'aurora',
  bgColor = '#111827',
  bgUrl,
  userAvatarUrl,
  onUserDismiss,
  className = '',
}) => {
  // Formater le numéro de carte (ex: 1234 5678 9000 0000)
  const formattedNumber = cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();

  return (
    <div className={`ju-credit-card ju-credit-card--${bgType} ${className}`.trim()}>
      
      {/* Couche de fond (Couleurs, Image ou Gradient) */}
      <div 
        className="ju-credit-card__background"
        style={{
          ...(bgType === 'solid' ? { backgroundColor: bgColor } : {}),
          ...(bgType === 'image' && bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}),
        }}
      >
        {bgType === 'aurora' && (
          <>
            <div className="ju-credit-card__blob ju-credit-card__blob--1"></div>
            <div className="ju-credit-card__blob ju-credit-card__blob--2"></div>
          </>
        )}
      </div>

      {/* Couche Glassmorphism (Blur + Bordure 1.5px comme sur l'image) */}
      <div className="ju-credit-card__glass"></div>

      {/* Contenu de la carte */}
      <div className="ju-credit-card__content">
        
        {/* En-tête : Puce et Sans Contact */}
        <div className="ju-credit-card__header">
          <svg className="ju-credit-card__chip" viewBox="0 0 32 24" fill="none">
            <rect x="0.5" y="0.5" width="31" height="23" rx="3.5" stroke="currentColor" strokeWidth="1" fill="rgba(255,255,255,0.1)" />
            <path d="M0 8H10M0 16H10M22 8H32M22 16H32M10 0V24M22 0V24" stroke="currentColor" strokeWidth="1" />
          </svg>
          <svg className="ju-credit-card__contactless" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2C7.5 2 4 5.5 4 10" />
            <path d="M16 4.5C12.5 3 8 4 6 7.5" />
            <path d="M20 7C17 4.5 12.5 4.5 9.5 7.5" />
            <path d="M24 10C21 6.5 15.5 6.5 13 10" />
          </svg>
        </div>

        {/* Numéro de carte */}
        <div className="ju-credit-card__number">{formattedNumber}</div>

        {/* Pied de carte : Utilisateur/Nom + Date + Logo */}
        <div className="ju-credit-card__footer">
          <div className="ju-credit-card__info">
            {variant === 'user' ? (
              <JUUserPill 
                name={cardholderName} 
                avatarUrl={userAvatarUrl} 
                onDismiss={onUserDismiss}
                className="ju-credit-card__user-pill"
              />
            ) : (
              <div className="ju-credit-card__holder">{cardholderName.toUpperCase()}</div>
            )}
            <div className="ju-credit-card__expiry">{expiryDate}</div>
          </div>
          
          {/* Logo Mastercard stylisé */}
          <div className="ju-credit-card__logo">
            <div className="ju-credit-card__circle ju-credit-card__circle--left"></div>
            <div className="ju-credit-card__circle ju-credit-card__circle--right"></div>
          </div>
        </div>
      </div>
    </div>
  );
};