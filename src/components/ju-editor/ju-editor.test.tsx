import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUEditor } from './ju-editor';

describe('JUEditor', () => {
  /* --- Rendering --- */
  it('renders a contentEditable div', () => {
    const { container } = render(<JUEditor />);
    const editor = container.querySelector('[contenteditable="true"]');
    expect(editor).toBeInTheDocument();
  });

  it('applies role="textbox" and aria-multiline', () => {
    render(<JUEditor />);
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveAttribute('aria-multiline', 'true');
  });

  it('renders the toolbar always visible', () => {
    const { container } = render(<JUEditor />);
    const toolbar = container.querySelector('[role="toolbar"]');
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveClass('ju-ed__toolbar');
  });

  it('sets data-placeholder attribute', () => {
    const { container } = render(<JUEditor placeholder="Write here..." />);
    const editor = container.querySelector('[contenteditable]');
    expect(editor).toHaveAttribute('data-placeholder', 'Write here...');
  });

  it('applies minHeight style', () => {
    const { container } = render(<JUEditor minHeight={300} />);
    const editor = container.querySelector('.ju-ed__content') as HTMLElement;
    expect(editor.style.minHeight).toBe('300px');
  });

  /* --- Disabled --- */
  it('disables editing when disabled prop is true', () => {
    const { container } = render(<JUEditor disabled />);
    const editor = container.querySelector('[contenteditable]');
    expect(editor).toHaveAttribute('contenteditable', 'false');
  });

  it('applies disabled class', () => {
    const { container } = render(<JUEditor disabled />);
    expect(container.firstChild).toHaveClass('ju-ed--disabled');
  });

  /* --- Toolbar buttons --- */
  it('renders bold, italic, underline buttons', () => {
    render(<JUEditor />);
    expect(screen.getByLabelText('Bold')).toBeInTheDocument();
    expect(screen.getByLabelText('Italic')).toBeInTheDocument();
    expect(screen.getByLabelText('Underline')).toBeInTheDocument();
  });

  it('renders alignment buttons', () => {
    render(<JUEditor />);
    expect(screen.getByLabelText('Align left')).toBeInTheDocument();
    expect(screen.getByLabelText('Align center')).toBeInTheDocument();
    expect(screen.getByLabelText('Align right')).toBeInTheDocument();
  });

  it('renders font family dropdown trigger', () => {
    render(<JUEditor />);
    expect(screen.getByLabelText('Font family')).toBeInTheDocument();
  });

  it('renders font size dropdown trigger', () => {
    render(<JUEditor />);
    expect(screen.getByLabelText('Font size')).toBeInTheDocument();
  });

  it('renders text color trigger', () => {
    render(<JUEditor />);
    expect(screen.getByLabelText('Text color')).toBeInTheDocument();
  });

  /* --- ARIA attributes --- */
  it('bold button has aria-pressed', () => {
    render(<JUEditor />);
    const btn = screen.getByLabelText('Bold');
    expect(btn).toHaveAttribute('aria-pressed');
  });

  it('dropdown triggers have aria-haspopup and aria-expanded', () => {
    render(<JUEditor />);
    const fontTrigger = screen.getByLabelText('Font family');
    expect(fontTrigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(fontTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  /* --- Toolbar groups --- */
  it('renders alignment group', () => {
    const { container } = render(<JUEditor />);
    const groups = container.querySelectorAll('.ju-ed__group');
    expect(groups.length).toBe(1);
  });

  /* --- className --- */
  it('applies custom className', () => {
    const { container } = render(<JUEditor className="my-editor" />);
    expect(container.firstChild).toHaveClass('my-editor');
  });

  /* --- onChange --- */
  it('calls onChange on input', () => {
    const fn = vi.fn();
    const { container } = render(<JUEditor onChange={fn} />);
    const editor = container.querySelector('[contenteditable]')!;
    fireEvent.input(editor);
    expect(fn).toHaveBeenCalled();
  });

  /* --- Custom props --- */
  it('accepts custom fontFamilies', () => {
    render(<JUEditor fontFamilies={['Serif', 'Mono']} />);
    expect(screen.getByLabelText('Font family')).toBeInTheDocument();
  });

  it('accepts custom fontSizes', () => {
    render(<JUEditor fontSizes={[12, 24, 32]} />);
    expect(screen.getByLabelText('Font size')).toBeInTheDocument();
  });

  it('accepts custom colors', () => {
    render(<JUEditor colors={['#ff0000', '#00ff00']} />);
    expect(screen.getByLabelText('Text color')).toBeInTheDocument();
  });
});
