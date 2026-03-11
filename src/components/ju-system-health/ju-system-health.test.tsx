import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { JUSystemHealth } from './ju-system-health';

const services = [
  { name: 'n8n', url: 'http://localhost:5678/healthz' },
  { name: 'Ollama', url: 'http://localhost:11434/api/version' },
  { name: 'Tailscale', url: 'http://localhost:41112/localapi/v0/status' },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('JUSystemHealth', () => {
  it('renders with title', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('ok', { status: 200 }));
    await act(async () => {
      render(<JUSystemHealth services={services} title="Infra" interval={0} />);
    });
    expect(screen.getByText('Infra')).toBeInTheDocument();
  });

  it('renders all service names', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('ok', { status: 200 }));
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    expect(screen.getByText('n8n')).toBeInTheDocument();
    expect(screen.getByText('Ollama')).toBeInTheDocument();
    expect(screen.getByText('Tailscale')).toBeInTheDocument();
  });

  it('shows online status when fetch succeeds', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('ok', { status: 200 }));
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    await waitFor(() => {
      const onlineLabels = screen.getAllByText('online');
      expect(onlineLabels).toHaveLength(3);
    });
  });

  it('shows offline status when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('fail'));
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    await waitFor(() => {
      const offlineLabels = screen.getAllByText('offline');
      expect(offlineLabels).toHaveLength(3);
    });
  });

  it('renders Refresh All button', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('ok', { status: 200 }));
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    expect(screen.getByLabelText('Refresh All')).toBeInTheDocument();
  });

  it('calls fetch again on refresh click', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('ok', { status: 200 })
    );
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    const initialCalls = fetchSpy.mock.calls.length;

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Refresh All'));
    });

    await waitFor(() => {
      expect(fetchSpy.mock.calls.length).toBeGreaterThan(initialCalls);
    });
  });

  it('renders PingDot with green for online services', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('ok', { status: 200 }));
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    await waitFor(() => {
      const dots = screen.getAllByRole('img');
      dots.forEach((dot) => {
        expect(dot).toHaveClass('ju-ping-dot--green');
      });
    });
  });

  it('renders PingDot with red for offline services', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('fail'));
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    await waitFor(() => {
      const dots = screen.getAllByRole('img');
      dots.forEach((dot) => {
        expect(dot).toHaveClass('ju-ping-dot--red');
      });
    });
  });

  it('handles mixed statuses', async () => {
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : (url as Request).url;
      if (urlStr.includes('5678')) return Promise.resolve(new Response('ok', { status: 200 }));
      return Promise.reject(new Error('fail'));
    });
    await act(async () => {
      render(<JUSystemHealth services={services} interval={0} />);
    });
    await waitFor(() => {
      expect(screen.getAllByText('online')).toHaveLength(1);
      expect(screen.getAllByText('offline')).toHaveLength(2);
    });
  });
});
