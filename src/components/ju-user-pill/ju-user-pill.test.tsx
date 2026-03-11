import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUUserPill } from './ju-user-pill';

describe('JUUserPill', () => {
  it('affiche correctement le nom de l\'utilisateur', () => {
    render(<JUUserPill name="Ella M." />);
    expect(screen.getByText('Ella M.')).toBeInTheDocument();
  });

  it('affiche l\'image de l\'avatar si l\'URL est fournie', () => {
    render(<JUUserPill name="Ella M." avatarUrl="https://example.com/avatar.jpg" />);
    const img = screen.getByRole('img', { name: /Avatar de Ella M\./i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('affiche la première lettre du nom (fallback) si l\'URL est absente', () => {
    render(<JUUserPill name="Thomas" />);
    // "T" devrait être affiché dans la bulle
    expect(screen.getByText('T')).toBeInTheDocument();
    // L'image ne doit pas être dans le DOM
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('n\'affiche pas le bouton dismiss si onDismiss n\'est pas fourni', () => {
    render(<JUUserPill name="Ella M." />);
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('affiche le bouton dismiss et déclenche onDismiss au clic', () => {
    const handleDismiss = vi.fn();
    render(<JUUserPill name="Ella M." onDismiss={handleDismiss} />);
    
    const button = screen.getByRole('button', { name: /Supprimer Ella M\./i });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleDismiss).toHaveBeenCalledOnce();
  });
});