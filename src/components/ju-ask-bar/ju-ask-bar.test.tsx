import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUAskBar } from './ju-ask-bar';

describe('JUAskBar', () => {
  // --- Rendu basique ---
  it('renders with default placeholder and tools', () => {
    render(<JUAskBar />);
    // Le textarea est présent
    expect(screen.getByPlaceholderText('Posez une question...')).toBeInTheDocument();
    // Le modèle par défaut est affiché
    expect(screen.getByText(/Claude Sonnet 3.5/i)).toBeInTheDocument();
    // Le bouton d'envoi ne doit pas être là si c'est vide
    expect(screen.queryByLabelText('Envoyer')).not.toBeInTheDocument();
  });

  // --- Changement d'état dynamique ---
  it('shows the send button and hides tools when text is typed', () => {
    render(<JUAskBar />);
    const textarea = screen.getByPlaceholderText('Posez une question...');
    
    // On simule la frappe
    fireEvent.change(textarea, { target: { value: 'Hello AI' } });

    // Le bouton d'envoi apparait
    expect(screen.getByLabelText('Envoyer')).toBeInTheDocument();
    // Le selecteur de modèle disparait
    expect(screen.queryByText(/Claude Sonnet/i)).not.toBeInTheDocument();
  });

  // --- Événements (Soumission) ---
  it('fires onSubmit on Enter key when value is not empty', () => {
    const handler = vi.fn();
    render(<JUAskBar onSubmit={handler} value="test query" />);
    
    fireEvent.keyDown(screen.getByPlaceholderText('Posez une question...'), {
      key: 'Enter',
      shiftKey: false,
    });
    
    expect(handler).toHaveBeenCalledWith('test query');
  });

  it('does not fire onSubmit on Shift+Enter (allows multiline)', () => {
    const handler = vi.fn();
    render(<JUAskBar onSubmit={handler} value="test query" />);
    
    fireEvent.keyDown(screen.getByPlaceholderText('Posez une question...'), {
      key: 'Enter',
      shiftKey: true, // L'utilisateur veut sauter une ligne
    });
    
    expect(handler).not.toHaveBeenCalled();
  });

  it('fires onSubmit when send button is clicked', () => {
    const handler = vi.fn();
    // On force une value pour que le bouton Send soit visible
    render(<JUAskBar onSubmit={handler} value="click submit" />);
    
    fireEvent.click(screen.getByLabelText('Envoyer'));
    expect(handler).toHaveBeenCalledWith('click submit');
  });

  // --- Chargement (Loading / Skeleton) ---
  it('shows skeleton dots when loading and hides buttons', () => {
    const { container } = render(<JUAskBar loading value="Ma question" />);
    
    // Le skeleton est dans le DOM
    expect(container.querySelector('.ju-ask-bar__skeleton-loader')).toBeInTheDocument();
    // Le bouton d'envoi n'est pas là malgré la présence de texte
    expect(screen.queryByLabelText('Envoyer')).not.toBeInTheDocument();
  });

  // --- Désactivé ---
  it('applies disabled state to textarea', () => {
    const { container } = render(<JUAskBar disabled />);
    expect(container.querySelector('.ju-ask-bar')).toHaveClass('ju-ask-bar--disabled');
    expect(screen.getByPlaceholderText('Posez une question...')).toBeDisabled();
  });

  // --- Thèmes ---
  it('applies dark theme class when requested', () => {
    const { container } = render(<JUAskBar theme="dark" />);
    expect(container.querySelector('.ju-ask-bar')).toHaveClass('ju-ask-bar--dark');
  });
});