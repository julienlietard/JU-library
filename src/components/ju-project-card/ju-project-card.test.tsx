import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUProjectCard } from './ju-project-card';

const msgs = [
  { sender: 'Julien', text: 'Hello world', side: 'left' as const },
  { sender: 'Moi', text: 'Nice!', side: 'right' as const },
  { sender: 'Julien', text: 'Check it', side: 'left' as const, link: 'https://example.com' },
];

describe('JUProjectCard', () => {
  it('renders the project image', () => {
    render(<JUProjectCard image={{ src: '/test.png', alt: 'Test' }} messages={msgs} />);
    expect(screen.getByRole('img', { name: 'Test' })).toBeInTheDocument();
  });

  it('renders all chat messages', () => {
    render(<JUProjectCard image={{ src: '/t.png', alt: '' }} messages={msgs} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Nice!')).toBeInTheDocument();
    expect(screen.getByText('Check it')).toBeInTheDocument();
  });

  it('renders sender names', () => {
    render(<JUProjectCard image={{ src: '/t.png', alt: '' }} messages={msgs} />);
    const senders = screen.getAllByText('Julien');
    expect(senders.length).toBeGreaterThanOrEqual(2);
  });

  it('renders link when provided', () => {
    render(<JUProjectCard image={{ src: '/t.png', alt: '' }} messages={msgs} />);
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders custom avatar', () => {
    render(<JUProjectCard image={{ src: '/t.png', alt: '' }} messages={msgs} avatar="🚀" />);
    const avatars = screen.getAllByText('🚀');
    expect(avatars.length).toBeGreaterThanOrEqual(1);
  });

  it('renders as article element', () => {
    render(<JUProjectCard image={{ src: '/t.png', alt: '' }} messages={msgs} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});