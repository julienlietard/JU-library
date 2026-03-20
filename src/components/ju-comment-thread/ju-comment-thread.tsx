import React, { useState } from 'react';
import './ju-comment-thread.css';

export interface JUComment {
  /** Unique identifier */
  id: string;
  /** Author name */
  author: string;
  /** Avatar URL */
  avatarSrc?: string;
  /** Comment body (plain text or simple HTML) */
  body: string;
  /** ISO date string */
  date: string;
  /** Nested replies */
  replies?: JUComment[];
}

export interface JUCommentThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Root-level comments */
  comments: JUComment[];
  /** Maximum nesting depth (default 4) */
  maxDepth?: number;
  /** Callback when "Reply" is clicked — receives the parent comment id */
  onReply?: (parentId: string) => void;
}

/* ---- Single comment node ---- */

interface CommentNodeProps {
  comment: JUComment;
  depth: number;
  maxDepth: number;
  onReply?: (parentId: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

const CommentNode: React.FC<CommentNodeProps> = ({
  comment,
  depth,
  maxDepth,
  onReply,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const canNest = depth < maxDepth;

  return (
    <div
      className={[
        'ju-comment-thread__node',
        depth > 0 ? 'ju-comment-thread__node--nested' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Indent line */}
      {depth > 0 && (
        <button
          className="ju-comment-thread__line"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand thread' : 'Collapse thread'}
          type="button"
        />
      )}

      <div className="ju-comment-thread__body">
        {/* Header: avatar + author + date */}
        <div className="ju-comment-thread__header">
          {comment.avatarSrc ? (
            <img
              className="ju-comment-thread__avatar"
              src={comment.avatarSrc}
              alt={comment.author}
              loading="lazy"
              draggable={false}
            />
          ) : (
            <span className="ju-comment-thread__avatar ju-comment-thread__avatar--fallback">
              {comment.author.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="ju-comment-thread__author">{comment.author}</span>
          <span className="ju-comment-thread__date">{formatDate(comment.date)}</span>
        </div>

        {/* Content */}
        {!collapsed && (
          <>
            <p className="ju-comment-thread__text">{comment.body}</p>

            {/* Actions */}
            <div className="ju-comment-thread__actions">
              {onReply && (
                <button
                  className="ju-comment-thread__action"
                  onClick={() => onReply(comment.id)}
                  type="button"
                >
                  Reply
                </button>
              )}
            </div>

            {/* Replies */}
            {hasReplies && canNest && (
              <div className="ju-comment-thread__replies">
                {comment.replies!.map((reply) => (
                  <CommentNode
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    onReply={onReply}
                  />
                ))}
              </div>
            )}

            {/* Flat replies when max depth reached */}
            {hasReplies && !canNest && (
              <div className="ju-comment-thread__replies">
                {comment.replies!.map((reply) => (
                  <CommentNode
                    key={reply.id}
                    comment={reply}
                    depth={depth}
                    maxDepth={maxDepth}
                    onReply={onReply}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Collapsed indicator */}
        {collapsed && hasReplies && (
          <button
            className="ju-comment-thread__collapsed"
            onClick={() => setCollapsed(false)}
            type="button"
          >
            {comment.replies!.length} réponse{comment.replies!.length > 1 ? 's' : ''} masquée{comment.replies!.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
};

/* ---- Main component ---- */

export const JUCommentThread: React.FC<JUCommentThreadProps> = ({
  comments,
  maxDepth = 4,
  onReply,
  className,
  ...rest
}) => {
  const cls = ['ju-comment-thread', className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={cls} {...rest}>
      {comments.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          depth={0}
          maxDepth={maxDepth}
          onReply={onReply}
        />
      ))}
    </div>
  );
};
