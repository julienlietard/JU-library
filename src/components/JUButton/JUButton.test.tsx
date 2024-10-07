import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import JUButton from './JUButton';

describe('JUButton Component', () => {
  it('affiche le label du bouton correctement', () => {
    render(<JUButton label="Cliquez ici" />);
    const buttonElement = screen.getByRole('button', { name: /cliquez ici/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('appelle la fonction onClick lors du clic', () => {
    const handleClick = jest.fn();
    render(<JUButton label="Clic" onClick={handleClick} />);
    const buttonElement = screen.getByRole('button', { name: /clic/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('désactive le bouton lorsque la prop "disabled" est passée', () => {
    render(<JUButton label="Disabled Button" disabled />);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
  });

  it('applique la classe de type correctement', () => {
    render(<JUButton label="Danger Button" type="danger" />);
    const buttonElement = screen.getByRole('button', { name: /danger button/i });
    expect(buttonElement).toHaveClass('ju-button ju-button--danger'); // Vérification de la classe "danger"
  });

  it('applique la classe de taille correctement', () => {
    render(<JUButton label="Large Button" size="l" />);
    const buttonElement = screen.getByRole('button', { name: /large button/i });
    expect(buttonElement).toHaveClass('ju-button ju-button--l'); // Vérification de la classe de taille
  });

  it('applique le thème sombre lorsque la prop "darkTheme" est activée', () => {
    render(<JUButton label="Dark Theme Button" darkTheme />);
    const buttonElement = screen.getByRole('button', { name: /dark theme button/i });
    expect(buttonElement).toHaveClass('ju-button ju-button--dark'); // Vérification de la classe "dark"
  });

  it('ne déclenche pas l’événement onClick lorsque le bouton est désactivé', () => {
    const handleClick = jest.fn();
    render(<JUButton label="Disabled Click" onClick={handleClick} disabled />);
    const buttonElement = screen.getByRole('button', { name: /disabled click/i });
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
