import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUChatBubble } from './ju-chat-bubble';

describe('JUChatBubble', () => {
  it('renders children', () => {
    render(<JUChatBubble><p>Hello</p></JUChatBubble>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders sender', () => {
    render(<JUChatBubble sender="Julien"><p>Hi</p></JUChatBubble>);
    expect(screen.getByText('Julien')).toBeInTheDocument();
  });

  it('omits sender when not provided', () => {
    const { container } = render(<JUChatBubble><p>Hi</p></JUChatBubble>);
    expect(container.querySelectorAll('span')).toHaveLength(0);
  });
});
