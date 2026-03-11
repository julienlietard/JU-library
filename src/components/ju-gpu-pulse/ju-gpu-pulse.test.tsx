import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { JUGPUPulse } from './ju-gpu-pulse';

const mockMetrics = {
  vramPercent: 45,
  vramUsed: 3686,
  vramTotal: 8192,
  tempCelsius: 62,
};

const dangerMetrics = {
  vramPercent: 90,
  vramUsed: 7372,
  vramTotal: 8192,
  tempCelsius: 92,
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('JUGPUPulse', () => {
  it('renders with title', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockMetrics), { status: 200 })
    );
    await act(async () => {
      render(<JUGPUPulse endpoint="/metrics/gpu" title="My GPU" />);
    });
    expect(screen.getByText('My GPU')).toBeInTheDocument();
  });

  it('renders Live indicator', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockMetrics), { status: 200 })
    );
    await act(async () => {
      render(<JUGPUPulse endpoint="/metrics/gpu" />);
    });
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('displays metrics after fetch', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockMetrics), { status: 200 })
    );
    await act(async () => {
      render(<JUGPUPulse endpoint="/metrics/gpu" />);
    });
    await waitFor(() => {
      expect(screen.getByText('3686 / 8192 MB')).toBeInTheDocument();
      expect(screen.getByText('62°C')).toBeInTheDocument();
    });
  });

  it('applies danger class when temp exceeds threshold', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(dangerMetrics), { status: 200 })
    );
    await act(async () => {
      render(<JUGPUPulse endpoint="/metrics/gpu" tempThreshold={80} />);
    });
    await waitFor(() => {
      expect(screen.getByText('92°C')).toHaveClass('ju-gpu-pulse__gauge-value--danger');
    });
  });

  it('does not apply danger class when temp is below threshold', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockMetrics), { status: 200 })
    );
    await act(async () => {
      render(<JUGPUPulse endpoint="/metrics/gpu" tempThreshold={80} />);
    });
    await waitFor(() => {
      expect(screen.getByText('62°C')).not.toHaveClass('ju-gpu-pulse__gauge-value--danger');
    });
  });

  it('renders VRAM and Temp progress bars', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockMetrics), { status: 200 })
    );
    await act(async () => {
      render(<JUGPUPulse endpoint="/metrics/gpu" />);
    });
    await waitFor(() => {
      const bars = screen.getAllByRole('progressbar');
      expect(bars).toHaveLength(2);
    });
  });

  it('shows error state when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    await act(async () => {
      render(<JUGPUPulse endpoint="/metrics/gpu" />);
    });
    await waitFor(() => {
      expect(screen.getByText('Connexion perdue')).toBeInTheDocument();
    });
  });
});
