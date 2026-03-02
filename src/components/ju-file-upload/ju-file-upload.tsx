import React, { useState, useRef, useCallback, useId } from 'react';
import './ju-file-upload.css';

export interface JUFileUploadProps {
  /** Accepted MIME types */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Max file size in bytes */
  maxSize?: number;
  /** On files selected */
  onFiles?: (files: File[]) => void;
  /** On error (file too large, wrong type) */
  onError?: (message: string) => void;
  /** Upload label */
  label?: string;
  /** Hint text below label */
  hint?: string;
  /** Disabled */
  disabled?: boolean;
  /** Show file preview list */
  showPreview?: boolean;
  className?: string;
}

export const JUFileUpload: React.FC<JUFileUploadProps> = ({
  accept,
  multiple = false,
  maxSize,
  onFiles,
  onError,
  label = 'Glissez vos fichiers ici',
  hint = 'ou cliquez pour parcourir',
  disabled = false,
  showPreview = true,
  className,
}) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const validate = useCallback((fileList: File[]) => {
    const valid: File[] = [];
    for (const f of fileList) {
      if (maxSize && f.size > maxSize) {
        onError?.(`${f.name} dépasse la taille maximale`);
        continue;
      }
      if (accept) {
        const types = accept.split(',').map(t => t.trim());
        const ok = types.some(t =>
          t.startsWith('.') ? f.name.toLowerCase().endsWith(t) : f.type.match(new RegExp(t.replace('*', '.*')))
        );
        if (!ok) { onError?.(`${f.name}: type non accepté`); continue; }
      }
      valid.push(f);
    }
    return valid;
  }, [accept, maxSize, onError]);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const arr = validate(Array.from(fileList));
    if (arr.length) {
      const next = multiple ? [...files, ...arr] : arr;
      setFiles(next);
      onFiles?.(next);
    }
  }, [files, multiple, onFiles, validate]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  }, [disabled, handleFiles]);

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    onFiles?.(next);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const cls = [
    'ju-fu',
    dragOver ? 'ju-fu--drag' : '',
    disabled ? 'ju-fu--disabled' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cls}>
      <div
        className={'ju-fu__zone'}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={label}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className={'ju-fu__input'}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className={'ju-fu__icon'} aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <span className={'ju-fu__label'}>{label}</span>
        <span className={'ju-fu__hint'}>{hint}</span>
      </div>

      {showPreview && files.length > 0 && (
        <ul className={'ju-fu__list'}>
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className={'ju-fu__file'}>
              <span className={'ju-fu__file-name'}>{f.name}</span>
              <span className={'ju-fu__file-size'}>{formatSize(f.size)}</span>
              <button
                className={'ju-fu__file-remove'}
                onClick={() => removeFile(i)}
                aria-label={`Supprimer ${f.name}`}
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};