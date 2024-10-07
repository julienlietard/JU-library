import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import JUCard from './JUCard';

describe('JUCard Component', () => {
  it('affiche le titre correctement', () => {
    render(<JUCard title="Test Title" description="Test Description" />);
    const titleElement = screen.getByText(/test title/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('affiche la description correctement', () => {
    render(<JUCard title="Test Title" description="Test Description" />);
    const descriptionElement = screen.getByText(/test description/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('affiche une image si `imageUrl` est fourni', () => {
    render(<JUCard title="Card with Image" description="Description" imageUrl="https://via.placeholder.com/400x150" />);
    const imageElement = screen.getByRole('img', { name: /card with image/i });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'https://via.placeholder.com/400x150');
  });

  it('appelle la fonction onActionClick lors du clic sur le bouton', () => {
    const handleClick = jest.fn();
    render(<JUCard title="Action Card" description="Description" actionLabel="Click Me" onActionClick={handleClick} />);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applique le thème sombre correctement', () => {
    render(<JUCard title="Dark Card" description="Dark Description" darkTheme />);
    const cardElement = screen.getByText(/dark card/i).closest('div');
    expect(cardElement).toHaveClass('ju-card ju-card--dark');
  });
});
