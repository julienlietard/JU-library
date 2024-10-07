import React from 'react';
import styles from './JUCard.module.css';
import JUButton from '../JUButton/JUButton';

// Définition des types de props
export interface JUCardProps {
  imageUrl?: string;          // Image en haut de la carte (optionnelle)
  title: string;              // Titre principal de la carte
  description: string;        // Description ou contenu de la carte
  actionLabel?: string;       // Label du bouton d'action (optionnel)
  onActionClick?: () => void; // Fonction appelée lors du clic sur le bouton d'action (optionnelle)
  darkTheme?: boolean;        // Thème sombre (optionnel)
}

const JUCard: React.FC<JUCardProps> = ({ imageUrl, title, description, actionLabel, onActionClick, darkTheme }) => {
  return (
    <div className={`${styles['ju-card']} ${darkTheme ? styles['ju-card--dark'] : ''}`}>
      {imageUrl && <img src={imageUrl} alt={title} className={styles['ju-card__image']} />}
      <div className={styles['ju-card__content']}>
        <h3 className={styles['ju-card__title']}>{title}</h3>
        <p className={styles['ju-card__description']}>{description}</p>
        {actionLabel && (
          <div className={styles['ju-card__action']}>
            <JUButton label={actionLabel} onClick={onActionClick} darkTheme={darkTheme} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JUCard;
