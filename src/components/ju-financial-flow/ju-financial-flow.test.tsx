import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JUFinancialFlow } from './ju-financial-flow';

describe('JUFinancialFlow', () => {
  it('renders the default title', () => {
    render(<JUFinancialFlow current={1000} goal={5000} />);
    expect(screen.getByText('Financial Flow')).toBeInTheDocument();
  });

  it('renders a custom title', () => {
    render(<JUFinancialFlow current={1000} goal={5000} title="Budget Mars" />);
    expect(screen.getByText('Budget Mars')).toBeInTheDocument();
  });

  it('displays the remaining amount when under goal', () => {
    render(<JUFinancialFlow current={2000} goal={5000} currency="€" />);
    expect(screen.getByText(/3[\s\u202f]?000 restants/)).toBeInTheDocument();
  });

  it('displays the surplus when goal is exceeded', () => {
    render(<JUFinancialFlow current={6200} goal={5000} currency="€" />);
    expect(screen.getByText(/1[\s\u202f]?200 au-dela/)).toBeInTheDocument();
  });

  it('shows the percentage', () => {
    render(<JUFinancialFlow current={2500} goal={5000} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('caps the percentage at 100%', () => {
    render(<JUFinancialFlow current={7000} goal={5000} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('shows 0% when current is zero', () => {
    render(<JUFinancialFlow current={0} goal={3000} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('applies the exceeded class when goal is met', () => {
    const { container } = render(<JUFinancialFlow current={5000} goal={5000} />);
    expect(container.querySelector('.ju-financial-flow--exceeded')).toBeInTheDocument();
  });

  it('does not apply exceeded class when under goal', () => {
    const { container } = render(<JUFinancialFlow current={2000} goal={5000} />);
    expect(container.querySelector('.ju-financial-flow--exceeded')).not.toBeInTheDocument();
  });

  it('renders a progressbar with correct aria attributes', () => {
    render(<JUFinancialFlow current={3000} goal={5000} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '3000');
    expect(bar).toHaveAttribute('aria-valuemax', '5000');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
  });

  it('sets the correct width style on the fill bar', () => {
    render(<JUFinancialFlow current={2500} goal={5000} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.style.width).toBe('50%');
  });

  it('uses custom currency symbol', () => {
    render(<JUFinancialFlow current={1500} goal={4000} currency="$" />);
    expect(screen.getByText(/\$1/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <JUFinancialFlow current={1000} goal={5000} className="my-flow" />,
    );
    expect(container.querySelector('.my-flow')).toBeInTheDocument();
  });

  it('displays ratio in header', () => {
    render(<JUFinancialFlow current={1000} goal={2000} currency="€" />);
    const header = screen.getByText(/€1.*€2/);
    expect(header).toBeInTheDocument();
  });
});
