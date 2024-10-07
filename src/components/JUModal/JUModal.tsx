import React from 'react';
import styles from './JUModal.module.css';  // Assurez-vous que ce chemin est correct

export type ModalTheme = 'light' | 'dark'; // Nouveau type pour les thèmes

export interface JUModalProps {
  isOpen: boolean; // Si `true`, le modal est visible
  onClose: () => void; // Fonction pour fermer le modal
  title: string; // Titre du modal
  theme?: ModalTheme; // Thème du modal
  children: React.ReactNode; // Contenu du modal
}

const JUModal: React.FC<JUModalProps> = ({ isOpen, onClose, title, theme = 'light', children }) => {
  if (!isOpen) return null; // Ne rend rien si le modal n'est pas ouvert

  return (
    <div className={`${styles['modal-overlay']} ${theme === 'dark' ? styles['modal-overlay--dark'] : ''}`}>
      <div className={`${styles['modal']} ${theme === 'dark' ? styles['modal--dark'] : ''}`}>
        <div className={styles['modal-header']}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles['close-button']}>
            &times;
          </button>
        </div>
        <div className={styles['modal-content']}>{children}</div>
      </div>
    </div>
  );
};

export default JUModal;
