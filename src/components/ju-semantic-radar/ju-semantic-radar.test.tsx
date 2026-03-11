import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUSemanticRadar } from './ju-semantic-radar';
import type { JUSemanticTag } from './ju-semantic-radar';

const sampleTags: JUSemanticTag[] = [
  { label: 'react', count: 42 },
  { label: 'typescript', count: 38 },
  { label: 'architecture', count: 12 },
  { label: 'css', count: 5 },
];

describe('JUSemanticRadar', () => {
  it('renders the default title', () => {
    render(<JUSemanticRadar tags={sampleTags} />);
    expect(screen.getByText('Semantic Radar')).toBeInTheDocument();
  });

  it('renders a custom title', () => {
    render(<JUSemanticRadar tags={sampleTags} title="Memory Tags" />);
    expect(screen.getByText('Memory Tags')).toBeInTheDocument();
  });

  it('displays the tag count in the header', () => {
    render(<JUSemanticRadar tags={sampleTags} />);
    expect(screen.getByText('4 tags')).toBeInTheDocument();
  });

  it('renders all tag labels', () => {
    render(<JUSemanticRadar tags={sampleTags} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('architecture')).toBeInTheDocument();
    expect(screen.getByText('css')).toBeInTheDocument();
  });

  it('renders empty state when no tags provided', () => {
    render(<JUSemanticRadar tags={[]} />);
    expect(screen.getByText('Aucun tag indexe')).toBeInTheDocument();
  });

  it('sorts tags by count descending', () => {
    const { container } = render(<JUSemanticRadar tags={sampleTags} />);
    const buttons = container.querySelectorAll('.ju-semantic-radar__tag');
    expect(buttons[0]).toHaveAttribute('title', 'react (42)');
    expect(buttons[1]).toHaveAttribute('title', 'typescript (38)');
    expect(buttons[3]).toHaveAttribute('title', 'css (5)');
  });

  it('scales font size based on frequency', () => {
    const { container } = render(<JUSemanticRadar tags={sampleTags} />);
    const buttons = container.querySelectorAll('.ju-semantic-radar__tag');
    const topSize = parseFloat(buttons[0].style.fontSize);
    const bottomSize = parseFloat(buttons[3].style.fontSize);
    expect(topSize).toBeGreaterThan(bottomSize);
  });

  it('calls onFilter with the tag label when clicked', () => {
    const onFilter = vi.fn();
    render(<JUSemanticRadar tags={sampleTags} onFilter={onFilter} />);
    fireEvent.click(screen.getByText('react'));
    expect(onFilter).toHaveBeenCalledWith('react');
  });

  it('calls onFilter for different tags', () => {
    const onFilter = vi.fn();
    render(<JUSemanticRadar tags={sampleTags} onFilter={onFilter} />);
    fireEvent.click(screen.getByText('css'));
    expect(onFilter).toHaveBeenCalledWith('css');
  });

  it('renders tag buttons with title attribute showing count', () => {
    render(<JUSemanticRadar tags={sampleTags} />);
    const btn = screen.getByTitle('react (42)');
    expect(btn).toBeInTheDocument();
  });

  it('shows occurrence count badges', () => {
    const { container } = render(<JUSemanticRadar tags={sampleTags} />);
    const counts = container.querySelectorAll('.ju-semantic-radar__tag-count');
    expect(counts).toHaveLength(4);
    expect(counts[0].textContent).toBe('42');
  });

  it('applies custom className', () => {
    const { container } = render(
      <JUSemanticRadar tags={sampleTags} className="custom-class" />,
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('handles a single tag without crashing', () => {
    render(<JUSemanticRadar tags={[{ label: 'solo', count: 1 }]} />);
    expect(screen.getByText('solo')).toBeInTheDocument();
    expect(screen.getByText('1 tags')).toBeInTheDocument();
  });

  it('uses custom color when provided', () => {
    const tags: JUSemanticTag[] = [{ label: 'react', count: 10, color: 'red' }];
    const { container } = render(<JUSemanticRadar tags={tags} />);
    expect(container.querySelector('.ju-badge--red')).toBeInTheDocument();
  });
});
