import React from 'react';
import './JUDock.module.css';

// Définition des types pour le Dock
export interface DockItem {
    title: string;
    icon: React.ReactNode;
  }
  
  export interface JUDockProps {
    titles: DockItem[];
    onClick: (title: string) => void;
    isCurrent: (title: string) => boolean;
  }

const JUDock: React.FC<JUDockProps> = ({ titles, onClick, isCurrent }) => {
  return (
    <nav>
      {titles.map((item) => (
        <a
          href="#"
          key={item.title}
          onClick={() => onClick(item.title)}
          className={isCurrent(item.title) ? 'active' : ''}
        >
          {item.icon}
        </a>
      ))}
    </nav>
  );
};

export default JUDock;
