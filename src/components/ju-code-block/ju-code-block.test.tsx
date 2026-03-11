import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUCodeBlock } from './ju-code-block';

describe('JUCodeBlock', () => {
  it('renders code content', () => {
    render(<JUCodeBlock code="const x = 1;" language="js" />);
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it('shows language label', () => {
    render(<JUCodeBlock code="test" language="python" />);
    expect(screen.getByText('python')).toBeInTheDocument();
  });

  it('renders copy button', () => {
    render(<JUCodeBlock code="test" copyable />);
    expect(screen.getByLabelText('Copy code')).toBeInTheDocument();
  });

  it('hides copy button when copyable is false', () => {
    render(<JUCodeBlock code="test" copyable={false} />);
    expect(screen.queryByLabelText('Copy code')).not.toBeInTheDocument();
  });

  it('renders syntax-highlighted tokens for known languages', () => {
    const { container } = render(<JUCodeBlock code="const x = 1;" language="js" />);
    const tokens = container.querySelectorAll('[class*="ju-cb__token--"]');
    expect(tokens.length).toBeGreaterThan(0);
  });

  it('renders plain text for unknown languages', () => {
    const { container } = render(<JUCodeBlock code="hello world" language="foobar" />);
    const tokens = container.querySelectorAll('[class*="ju-cb__token--"]');
    expect(tokens.length).toBe(0);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('renders line numbers by default', () => {
    const code = 'line1\nline2';
    const { container } = render(<JUCodeBlock code={code} language="js" />);
    const lineNumbers = container.querySelectorAll('.ju-cb__ln');
    expect(lineNumbers).toHaveLength(2);
    expect(lineNumbers[0].textContent).toBe('1');
    expect(lineNumbers[1].textContent).toBe('2');
  });

  it('hides line numbers when lineNumbers is false', () => {
    const code = 'line1\nline2';
    const { container } = render(<JUCodeBlock code={code} lineNumbers={false} />);
    const lineNumbers = container.querySelectorAll('.ju-cb__ln');
    expect(lineNumbers).toHaveLength(0);
  });

  it('highlights specified lines', () => {
    const code = 'a\nb\nc';
    const { container } = render(<JUCodeBlock code={code} highlightLines={[2]} />);
    const lines = container.querySelectorAll('.ju-cb__line');
    expect(lines[1].className).toContain('ju-cb__line--hl');
    expect(lines[0].className).not.toContain('ju-cb__line--hl');
  });

  it('renders without language (plain text fallback)', () => {
    const { container } = render(<JUCodeBlock code="just text" />);
    expect(container.querySelector('.ju-cb__lang')).not.toBeInTheDocument();
    expect(screen.getByText('just text')).toBeInTheDocument();
  });

  it('renders TypeScript tokens correctly', () => {
    const { container } = render(
      <JUCodeBlock code="function hello(): string { return 'world'; }" language="typescript" />
    );
    const tokens = container.querySelectorAll('[class*="ju-cb__token--"]');
    expect(tokens.length).toBeGreaterThan(0);
  });
});
