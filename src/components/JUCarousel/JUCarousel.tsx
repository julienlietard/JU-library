import React, { useState, ReactNode } from 'react';
import styles from './JUCarousel.module.css'; // Import des styles

export interface JUCarouselProps {
  children: ReactNode; // Les éléments enfants à afficher dans le carrousel
  autoScroll?: boolean; // Si vrai, le carrousel défile automatiquement
  scrollInterval?: number; // Intervalle de défilement automatique (en ms)
}

const JUCarousel: React.FC<JUCarouselProps> = ({
  children,
  autoScroll = true,
  scrollInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = React.Children.toArray(children);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScroll) {
      interval = setInterval(goToNext, scrollInterval);
    }
    return () => clearInterval(interval);
  }, [autoScroll, scrollInterval]);

  return (
    <div className={styles['ju-carousel']}>
      <button className={styles['ju-carousel__control']} onClick={goToPrev}>
        &#10094; {/* Flèche gauche */}
      </button>
      <div className={styles['ju-carousel__viewport']}>
        <div
          className={styles['ju-carousel__track']}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div className={styles['ju-carousel__slide']} key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
      <button className={styles['ju-carousel__control']} onClick={goToNext}>
        &#10095; {/* Flèche droite */}
      </button>
    </div>
  );
};

export default JUCarousel;
