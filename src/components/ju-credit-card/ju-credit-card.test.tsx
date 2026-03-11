import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUCreditCard } from './ju-credit-card';

describe('JUCreditCard', () => {
  const defaultProps = {
    cardNumber: '1234567890000000', // Sans espaces pour tester le formatage
    cardholderName: 'JOY LAROY',
    expiryDate: '12/24',
  };

  it('formate et affiche le numéro de carte correctement', () => {
    render(<JUCreditCard {...defaultProps} />);
    // Le composant doit ajouter les espaces
    expect(screen.getByText('1234 5678 9000 0000')).toBeInTheDocument();
  });

  it('affiche le nom du titulaire en majuscules et la date d\'expiration', () => {
    render(<JUCreditCard {...defaultProps} cardholderName="Joy Laroy" />);
    expect(screen.getByText('JOY LAROY')).toBeInTheDocument();
    expect(screen.getByText('12/24')).toBeInTheDocument();
  });

  it('affiche le composant JUUserPill si la variante est "user"', () => {
    render(
      <JUCreditCard 
        {...defaultProps} 
        variant="user" 
        cardholderName="Ella M." 
      />
    );
    // On doit trouver le texte du nom tel quel (sans majuscule forcée par la carte)
    expect(screen.getByText('Ella M.')).toBeInTheDocument();
    // On doit aussi trouver le fallback de l'avatar ("E")
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('déclenche onUserDismiss si on clique sur la croix de la JUUserPill intégrée', () => {
    const handleUserDismiss = vi.fn();
    render(
      <JUCreditCard 
        {...defaultProps} 
        variant="user" 
        cardholderName="Ella M." 
        onUserDismiss={handleUserDismiss} 
      />
    );
    
    const dismissButton = screen.getByRole('button', { name: /Supprimer Ella M\./i });
    fireEvent.click(dismissButton);
    expect(handleUserDismiss).toHaveBeenCalledOnce();
  });
});