import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import JUModal from './JUModal';

describe('JUModal Component', () => {
  it('n\'affiche pas le modal quand isOpen est false', () => {
    render(<JUModal isOpen={false} onClose={() => { } } title={''} children={undefined} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('affiche le modal quand isOpen est true', () => {
    render(<JUModal isOpen={true} onClose={() => { } } title={''} children={undefined} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('affiche le titre quand il est passé comme prop', () => {
    render(<JUModal isOpen={true} onClose={() => { } } title="Titre de Test" children={undefined} />);
    expect(screen.getByText(/titre de test/i)).toBeInTheDocument();
  });

  it('ferme le modal quand le bouton de fermeture est cliqué', () => {
    const handleClose = jest.fn();
    render(<JUModal isOpen={true} onClose={handleClose} title={''} children={undefined} />);
    const closeButton = screen.getByRole('button', { name: /fermer/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('ferme le modal quand la touche Échap est pressée', () => {
    const handleClose = jest.fn();
    render(<JUModal isOpen={true} onClose={handleClose} title={''} children={undefined} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
