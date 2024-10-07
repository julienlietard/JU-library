import React from 'react';
import { render, screen } from '@testing-library/react';
import JUAcordion from './JUAccordion';

describe('JUAcordion Component', () => {
  it('devrait afficher le titre et le contenu', () => {
    render(
      <JUAcordion title="Test Accordion">
        <p>Contenu de l'accordéon</p>
      </JUAcordion>
    );
    expect(screen.getByText('Test Accordion')).toBeInTheDocument();
    expect(screen.getByText('Contenu de l\'accordéon')).not.toBeVisible();
  });

  it('devrait afficher le contenu lorsque l\'accordéon est ouvert', () => {
    render(
      <JUAcordion title="Test Accordion">
        <p>Contenu de l'accordéon</p>
      </JUAcordion>
    );
    screen.getByText('Test Accordion').click(); // Ouvre l'accordéon
    expect(screen.getByText('Contenu de l\'accordéon')).toBeVisible();
  });

  it('devrait appliquer le thème sombre', () => {
    render(
      <JUAcordion title="Test Accordion" theme="dark">
        <p>Contenu de l'accordéon</p>
      </JUAcordion>
    );
    const accordion = screen.getByText('Test Accordion').closest('.accordion');
    expect(accordion).toHaveClass('accordion--dark');
  });

  it('devrait appliquer le thème clair par défaut', () => {
    render(
      <JUAcordion title="Test Accordion">
        <p>Contenu de l'accordéon</p>
      </JUAcordion>
    );
    const accordion = screen.getByText('Test Accordion').closest('.accordion');
    expect(accordion).toHaveClass('accordion--light');
  });
});
