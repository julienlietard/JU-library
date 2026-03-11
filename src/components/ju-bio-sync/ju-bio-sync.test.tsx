import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { JUBioSync } from './ju-bio-sync';

const goodData = {
  sleepHours: 7.5,
  steps: 12340,
  tip: 'Belle journee, continue !',
};

const lowSleepData = {
  sleepHours: 4.25,
  steps: 8200,
  tip: 'Tu as peu dormi.',
};

const lowStepsData = {
  sleepHours: 8,
  steps: 3100,
  tip: 'Pense a marcher.',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('JUBioSync', () => {
  it('renders with title', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(goodData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" title="My Health" />);
    });
    expect(screen.getByText('My Health')).toBeInTheDocument();
  });

  it('displays sleep value formatted', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(goodData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" />);
    });
    await waitFor(() => {
      expect(screen.getByText('7h30')).toBeInTheDocument();
    });
  });

  it('displays step count formatted', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(goodData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" />);
    });
    await waitFor(() => {
      expect(screen.getByText('12.3k')).toBeInTheDocument();
    });
  });

  it('renders tip text', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(goodData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" />);
    });
    await waitFor(() => {
      expect(screen.getByText('Belle journee, continue !')).toBeInTheDocument();
    });
  });

  it('applies success tone when both metrics are good', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(goodData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" sleepThreshold={6} stepGoal={10000} />);
    });
    await waitFor(() => {
      const tip = screen.getByText('Belle journee, continue !').closest('.ju-bio-sync__tip');
      expect(tip).toHaveClass('ju-bio-sync__tip--success');
    });
  });

  it('applies warn-sleep tone when sleep is below threshold', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(lowSleepData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" sleepThreshold={6} />);
    });
    await waitFor(() => {
      const tip = screen.getByText('Tu as peu dormi.').closest('.ju-bio-sync__tip');
      expect(tip).toHaveClass('ju-bio-sync__tip--warn-sleep');
    });
  });

  it('applies warn-steps tone when steps are below goal', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(lowStepsData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" stepGoal={10000} />);
    });
    await waitFor(() => {
      const tip = screen.getByText('Pense a marcher.').closest('.ju-bio-sync__tip');
      expect(tip).toHaveClass('ju-bio-sync__tip--warn-steps');
    });
  });

  it('renders two progress bars', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(goodData), { status: 200 })
    );
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" />);
    });
    await waitFor(() => {
      expect(screen.getAllByRole('progressbar')).toHaveLength(2);
    });
  });

  it('shows error state on fetch failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('fail'));
    await act(async () => {
      render(<JUBioSync endpoint="/api/health" />);
    });
    await waitFor(() => {
      expect(screen.getByText('Impossible de charger les données')).toBeInTheDocument();
    });
  });
});
