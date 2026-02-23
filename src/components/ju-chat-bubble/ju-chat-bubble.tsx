import React from 'react';
import styles from './ju-chat-bubble.module.css';

export type JUChatBubbleColor = 'blue' | 'gray' | 'green' | 'dark';
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
    styles['ju-chat-bubble'],
    styles[`ju-chat-bubble--${color}`],
    styles[`ju-chat-bubble--tail-${tail}`],
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {sender && <span className={styles['ju-chat-bubble__sender']}>{sender}</span>}
      <div className={styles['ju-chat-bubble__content']}>{children}</div>
    </div>
  );
};