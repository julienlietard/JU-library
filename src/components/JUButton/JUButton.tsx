import React from 'react';
import styles from './JUButton.module.css';  // Utilisation de l'import via styles

// Définition des types pour les props du bouton
export type ButtonSize = 's' | 'm' | 'l'; // Tailles possibles : petit, moyen, grand
export type ButtonType = 'primary' | 'secondary' | 'info' | 'warning' | 'danger'; // Styles de bouton

export interface JUButtonProps {
  label: string;              // Le texte affiché sur le bouton
  size?: ButtonSize;          // Taille du bouton (optionnelle)
  type?: ButtonType;          // Type de bouton (optionnelle)
  disabled?: boolean;         // Si `true`, le bouton est désactivé
  onClick?: () => void;       // Fonction exécutée lors du clic (optionnelle)
}

// Le composant `JUButton` prend des props typées avec l'interface JUButtonProps
const JUButton: React.FC<JUButtonProps> = ({ label, size = 'm', type = 'primary', disabled = false, onClick }) => {
  // Génération de classes dynamiques en fonction des props
  const sizeClass = size ? styles[`ju-button--${size}`] : '';
  const typeClass = type ? styles[`ju-button--${type}`] : '';
  const disabledClass = disabled ? styles['ju-button--disabled'] : '';

  return (
    <button
      className={`${styles['ju-button']} ${sizeClass} ${typeClass} ${disabledClass}`}
      onClick={!disabled ? onClick : undefined} // Désactive le clic si `disabled`
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default JUButton;
