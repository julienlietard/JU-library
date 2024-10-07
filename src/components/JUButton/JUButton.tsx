import React from 'react';
import styles from './JUButton.module.css';

export type ButtonSize = 's' | 'm' | 'l';
export type ButtonType = 'primary' | 'secondary' | 'info' | 'warning' | 'danger';

export interface JUButtonProps {
  label: string;             // Le texte du bouton
  size?: ButtonSize;         // Taille (petit, moyen, grand)
  type?: ButtonType;         // Type (primary, secondary, info, warning, danger)
  disabled?: boolean;        // Si `true`, le bouton est désactivé
  darkTheme?: boolean;       // Si `true`, applique le thème sombre (fond transparent)
  onClick?: () => void;      // Fonction à exécuter lors du clic
}

const JUButton: React.FC<JUButtonProps> = ({
  label,
  size = 'm',
  type = 'primary',
  disabled = false,
  darkTheme = false,
  onClick,
}) => {
  // Génération des classes dynamiques basées sur les props
  const buttonClass = [
    styles['ju-button'],                     // Classe de base
    styles[`ju-button--${size}`],             // Classe de taille
    styles[`ju-button--${type}`],             // Classe de type
    disabled ? styles['ju-button--disabled'] : '',  // Classe pour état désactivé
    darkTheme ? styles['ju-button--dark'] : '',      // Classe pour thème sombre
  ].join(' ');

  return (
    <button
      className={buttonClass}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default JUButton;
