import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUNerveCenter } from './ju-nerve-center';

describe('JUNerveCenter', () => {
  it('renders with title', () => {
    render(<JUNerveCenter webhookUrl="https://test.com/webhook" title="Test Bot" />);
    expect(screen.getByText('Test Bot')).toBeInTheDocument();
  });

  it('renders initial messages', () => {
    render(
      <JUNerveCenter
        webhookUrl="https://test.com/webhook"
        initialMessages={[
          { role: 'ai', content: 'Bonjour !' },
          { role: 'user', content: 'Salut' },
        ]}
      />
    );
    expect(screen.getByText('Bonjour !')).toBeInTheDocument();
    expect(screen.getByText('Salut')).toBeInTheDocument();
  });

  it('renders the textarea with placeholder', () => {
    render(
      <JUNerveCenter webhookUrl="https://test.com/webhook" placeholder="Pose ta question..." />
    );
    expect(screen.getByPlaceholderText('Pose ta question...')).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<JUNerveCenter webhookUrl="https://test.com/webhook" />);
    const sendBtn = screen.getByRole('button');
    expect(sendBtn).toBeDisabled();
  });

  it('enables send button when input has text', () => {
    render(<JUNerveCenter webhookUrl="https://test.com/webhook" />);
    const textarea = screen.getByPlaceholderText('Envoyer un message...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    const sendBtn = screen.getByRole('button');
    expect(sendBtn).not.toBeDisabled();
  });

  it('applies user bubble class on user messages', () => {
    render(
      <JUNerveCenter
        webhookUrl="https://test.com/webhook"
        initialMessages={[{ role: 'user', content: 'Test user' }]}
      />
    );
    const bubble = screen.getByText('Test user');
    expect(bubble).toHaveClass('ju-nerve-center__bubble--user');
  });

  it('applies ai bubble class on ai messages', () => {
    render(
      <JUNerveCenter
        webhookUrl="https://test.com/webhook"
        initialMessages={[{ role: 'ai', content: 'Test ai' }]}
      />
    );
    const bubble = screen.getByText('Test ai');
    expect(bubble).toHaveClass('ju-nerve-center__bubble--ai');
  });
});
