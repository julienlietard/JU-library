import React, { useState, useRef, useEffect, useCallback } from 'react';
import { JUCard } from '../ju-card/ju-card';
import { JUButton } from '../ju-button/ju-button';
import './ju-nerve-center.css';

export interface JUNerveCenterMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface JUNerveCenterProps {
  /** n8n webhook URL endpoint */
  webhookUrl: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Optional title displayed in the header */
  title?: string;
  /** Initial messages to pre-populate the chat */
  initialMessages?: JUNerveCenterMessage[];
  /** Callback when a new message is added */
  onMessage?: (messages: JUNerveCenterMessage[]) => void;
  /** Additional CSS class */
  className?: string;
}

export const JUNerveCenter: React.FC<JUNerveCenterProps> = ({
  webhookUrl,
  placeholder = 'Envoyer un message...',
  title = 'Nerve Center',
  initialMessages = [],
  onMessage,
  className,
}) => {
  const [messages, setMessages] = useState<JUNerveCenterMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMessage: JUNerveCenterMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsThinking(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: updatedMessages }),
      });

      const data = await response.json();
      const aiContent = data.output ?? data.message ?? data.response ?? JSON.stringify(data);
      const aiMessage: JUNerveCenterMessage = { role: 'ai', content: aiContent };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      onMessage?.(finalMessages);
    } catch {
      const errorMessage: JUNerveCenterMessage = {
        role: 'ai',
        content: 'Une erreur est survenue. Réessayez.',
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      onMessage?.(finalMessages);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const classNames = [
    'ju-nerve-center',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <JUCard variant="glass" padding="none" className={classNames}>
      {/* Header */}
      <div className="ju-nerve-center__header">
        <div className="ju-nerve-center__status" />
        <span className="ju-nerve-center__title">{title}</span>
      </div>

      {/* Messages */}
      <div className="ju-nerve-center__messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`ju-nerve-center__bubble ju-nerve-center__bubble--${msg.role}`}
          >
            {msg.content}
          </div>
        ))}

        {isThinking && (
          <div className="ju-nerve-center__bubble ju-nerve-center__bubble--ai ju-nerve-center__bubble--thinking">
            <span className="ju-nerve-center__dot" />
            <span className="ju-nerve-center__dot" />
            <span className="ju-nerve-center__dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="ju-nerve-center__input-bar">
        <textarea
          ref={textareaRef}
          className="ju-nerve-center__textarea"
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            resizeTextarea();
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isThinking}
        />
        <JUButton
          label=""
          variant="primary"
          size="sm"
          className="ju-nerve-center__send"
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          }
        />
      </div>
    </JUCard>
  );
};
