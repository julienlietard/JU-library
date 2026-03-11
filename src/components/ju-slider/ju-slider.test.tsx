import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JUSlider } from './ju-slider';

describe('JUSlider', () => {
  it('renders with default props', () => {
    const { container } = render(<JUSlider />);
    expect(container.querySelector('.ju-slider')).toBeInTheDocument();
  });

  it('renders a slider role element', () => {
    render(<JUSlider aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<JUSlider min={10} max={200} defaultValue={50} aria-label="Brightness" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '200');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('applies variant class', () => {
    const { container } = render(<JUSlider variant="gradient" />);
    expect(container.querySelector('.ju-slider--gradient')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<JUSlider size="lg" />);
    expect(container.querySelector('.ju-slider--lg')).toBeInTheDocument();
  });

  it('applies disabled class and aria', () => {
    const { container } = render(<JUSlider disabled aria-label="Test" />);
    expect(container.querySelector('.ju-slider--disabled')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders two thumbs in range mode', () => {
    render(<JUSlider range aria-label-min="Min" aria-label-max="Max" />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
  });

  it('renders single thumb in single mode', () => {
    render(<JUSlider aria-label="Single" />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(1);
  });

  it('shows min/max labels when showMinMax is true', () => {
    render(<JUSlider min={0} max={100} showMinMax />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('formats min/max labels with formatValue', () => {
    render(<JUSlider min={0} max={100} showMinMax formatValue={(v) => `${v}%`} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders marks when marks prop is array of numbers', () => {
    const { container } = render(<JUSlider marks={[0, 25, 50, 75, 100]} />);
    const markEls = container.querySelectorAll('.ju-slider__mark');
    expect(markEls.length).toBe(5);
  });

  it('renders mark labels', () => {
    render(
      <JUSlider
        marks={[
          { value: 0, label: 'Low' },
          { value: 100, label: 'High' },
        ]}
      />,
    );
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('auto-generates marks when marks=true', () => {
    const { container } = render(<JUSlider min={0} max={100} step={25} marks />);
    const markEls = container.querySelectorAll('.ju-slider__mark');
    // 0, 25, 50, 75, 100 = 5 marks
    expect(markEls.length).toBe(5);
  });

  it('shows tooltip always when showTooltip="always"', () => {
    render(<JUSlider defaultValue={42} showTooltip="always" formatValue={(v) => `${v}!`} aria-label="Test" />);
    expect(screen.getByText('42!')).toBeInTheDocument();
  });

  it('does not show tooltip when showTooltip="never"', () => {
    const { container } = render(<JUSlider defaultValue={42} showTooltip="never" aria-label="Test" />);
    expect(container.querySelector('.ju-slider__tooltip')).not.toBeInTheDocument();
  });

  it('handles keyboard ArrowRight', () => {
    const onChange = vi.fn();
    render(<JUSlider min={0} max={100} step={5} value={50} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(55);
  });

  it('handles keyboard ArrowLeft', () => {
    const onChange = vi.fn();
    render(<JUSlider min={0} max={100} step={10} value={50} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(40);
  });

  it('handles keyboard Home/End', () => {
    const onChange = vi.fn();
    render(<JUSlider min={0} max={100} value={50} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(0);

    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it('clamps value to min/max on keyboard', () => {
    const onChange = vi.fn();
    render(<JUSlider min={0} max={10} step={5} value={10} onChange={onChange} aria-label="Test" />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(10); // clamped at max
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<JUSlider disabled value={50} onChange={onChange} aria-label="Test" />);
    const slider = screen.getByRole('slider');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<JUSlider className="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  it('works as uncontrolled with defaultValue', () => {
    render(<JUSlider defaultValue={30} showTooltip="always" aria-label="Uncontrolled" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '30');
  });

  it('renders fill with correct width', () => {
    const { container } = render(<JUSlider min={0} max={100} defaultValue={60} />);
    const fill = container.querySelector('.ju-slider__fill') as HTMLElement;
    expect(fill.style.width).toBe('60%');
  });

  it('range mode has correct fill between thumbs', () => {
    const { container } = render(<JUSlider range defaultValue={[20, 80]} />);
    const fill = container.querySelector('.ju-slider__fill') as HTMLElement;
    expect(fill.style.left).toBe('20%');
    expect(fill.style.width).toBe('60%');
  });
});
