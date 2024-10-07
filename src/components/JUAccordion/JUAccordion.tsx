import React, { useState } from 'react';
import styles from './JUAccordion.module.css'

// Types pour les props de l'accordéon
export type AccordionTheme = 'light' | 'dark';

export interface JUAcordionProps {
  title: string; // Titre de l'accordéon
  children: React.ReactNode; // Contenu de l'accordéon
  theme?: AccordionTheme; // Thème de l'accordéon
}

const JUAcordion: React.FC<JUAcordionProps> = ({ title, children, theme = 'light' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.accordion} ${styles[`accordion--${theme}`]}`}>
      <div className={styles.header} onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default JUAcordion;
