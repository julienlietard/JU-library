import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import JUCarousel from './JUCarousel';

describe('JUCarousel Component', () => {
  const renderCarousel = () => {
    render(
      <JUCarousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </JUCarousel>
    );
  };

  it('affiche le premier slide par défaut', () => {
    renderCarousel();
    const firstSlide = screen.getByText(/slide 1/i);
    expect(firstSlide).toBeInTheDocument();
  });

  it('affiche le deuxième slide après avoir cliqué sur la flèche droite', () => {
    renderCarousel();
    const nextButton = screen.getByRole('button', { name: /›/i }); // Flèche droite
    fireEvent.click(nextButton);
    const secondSlide = screen.getByText(/slide 2/i);
    expect(secondSlide).toBeInTheDocument();
  });

  it('affiche le troisième slide après deux clics sur la flèche droite', () => {
    renderCarousel();
    const nextButton = screen.getByRole('button', { name: /›/i }); // Flèche droite
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    const thirdSlide = screen.getByText(/slide 3/i);
    expect(thirdSlide).toBeInTheDocument();
  });

  it('revient au premier slide après avoir cliqué sur la flèche droite depuis le dernier slide', () => {
    renderCarousel();
    const nextButton = screen.getByRole('button', { name: /›/i }); // Flèche droite
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton); // Clic supplémentaire pour revenir au début
    const firstSlide = screen.getByText(/slide 1/i);
    expect(firstSlide).toBeInTheDocument();
  });

  it('affiche le dernier slide après avoir cliqué sur la flèche gauche depuis le premier slide', () => {
    renderCarousel();
    const prevButton = screen.getByRole('button', { name: /‹/i }); // Flèche gauche
    fireEvent.click(prevButton);
    const lastSlide = screen.getByText(/slide 3/i);
    expect(lastSlide).toBeInTheDocument();
  });

  it('revient au premier slide après un clic sur la flèche gauche depuis le deuxième slide', () => {
    renderCarousel();
    const nextButton = screen.getByRole('button', { name: /›/i }); // Flèche droite
    const prevButton = screen.getByRole('button', { name: /‹/i }); // Flèche gauche
    fireEvent.click(nextButton); // Passe au slide 2
    fireEvent.click(prevButton); // Retourne au slide 1
    const firstSlide = screen.getByText(/slide 1/i);
    expect(firstSlide).toBeInTheDocument();
  });
});
