import React from 'react';
import './ju-chat-bubble.css';

export type JUChatBubbleColor = 'blue' | 'gray' | 'green' | 'dark' | 'ai';
export type JUChatBubbleTail = 'left' | 'right' | 'none';

export interface JUChatBubbleProps {
  /** Chat content */
  children: React.ReactNode;
  /** Bubble color */
  color?: JUChatBubbleColor;
  /** Tail direction (like iMessage) */
  tail?: JUChatBubbleTail;
  /** Optional sender name above the bubble */
  sender?: string;
  /** Additional CSS class */
  className?: string;
}

export const JUChatBubble: React.FC<JUChatBubbleProps> = ({
  children,
  color = 'blue',
  tail = 'left',
  sender,
  className,
}) => {
  const classNames = [
    'ju-chat-bubble',
    `ju-chat-bubble--${color}`,
    `ju-chat-bubble--tail-${tail}`,
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {sender && <span className={'ju-chat-bubble__sender'}>{sender}</span>}
      <div className={'ju-chat-bubble__content'}>{children}</div>
    </div>
  );
};