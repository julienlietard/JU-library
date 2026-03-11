import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { JUModelSelector } from './ju-model-selector';

const mockTagsResponse = {
  models: [
    { name: 'llama3.1:8b', size: 4_700_000_000, modified_at: '2025-01-15T10:00:00Z' },
    { name: 'mistral:7b', size: 4_100_000_000, modified_at: '2025-01-10T08:00:00Z' },
    { name: 'phi3:mini', size: 2_300_000_000, modified_at: '2025-01-05T09:00:00Z' },
  ],
};

function mockFetch(opts?: { generateFail?: boolean }) {
  return vi.spyOn(global, 'fetch').mockImplementation((url) => {
    const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : (url as Request).url;
    if (urlStr.includes('/api/tags')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockTagsResponse), { status: 200 })
      );
    }
    if (urlStr.includes('/api/generate')) {
      if (opts?.generateFail) return Promise.reject(new Error('fail'));
      return Promise.resolve(new Response('{}', { status: 200 }));
    }
    return Promise.reject(new Error('unknown'));
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('JUModelSelector', () => {
  it('renders with title', async () => {
    mockFetch();
    await act(async () => {
      render(<JUModelSelector title="My Models" />);
    });
    expect(screen.getByText('My Models')).toBeInTheDocument();
  });

  it('shows placeholder when no model selected', async () => {
    mockFetch();
    await act(async () => {
      render(<JUModelSelector />);
    });
    expect(screen.getByText('Choisir un modèle')).toBeInTheDocument();
  });

  it('fetches and displays models in dropdown', async () => {
    mockFetch();
    await act(async () => {
      render(<JUModelSelector />);
    });

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await waitFor(() => {
      expect(screen.getByText('llama3.1:8b')).toBeInTheDocument();
      expect(screen.getByText('mistral:7b')).toBeInTheDocument();
      expect(screen.getByText('phi3:mini')).toBeInTheDocument();
    });
  });

  it('displays model sizes in dropdown', async () => {
    mockFetch();
    await act(async () => {
      render(<JUModelSelector />);
    });

    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await waitFor(() => {
      expect(screen.getByText('4.7 GB')).toBeInTheDocument();
      expect(screen.getByText('4.1 GB')).toBeInTheDocument();
      expect(screen.getByText('2.3 GB')).toBeInTheDocument();
    });
  });

  it('loads model on option click', async () => {
    const fetchSpy = mockFetch();
    const onModelChange = vi.fn();

    await act(async () => {
      render(<JUModelSelector onModelChange={onModelChange} />);
    });

    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await act(async () => {
      fireEvent.click(screen.getByText('llama3.1:8b'));
    });

    await waitFor(() => {
      const generateCall = fetchSpy.mock.calls.find(
        (c) => typeof c[0] === 'string' && c[0].includes('/api/generate')
      );
      expect(generateCall).toBeTruthy();
      expect(onModelChange).toHaveBeenCalledWith('llama3.1:8b');
    });
  });

  it('shows Active badge when model is loaded', async () => {
    mockFetch();

    await act(async () => {
      render(<JUModelSelector />);
    });

    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await act(async () => {
      fireEvent.click(screen.getByText('mistral:7b'));
    });

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  it('shows Eject button when model is active', async () => {
    mockFetch();

    await act(async () => {
      render(<JUModelSelector />);
    });

    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await act(async () => {
      fireEvent.click(screen.getByText('llama3.1:8b'));
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Eject model')).toBeInTheDocument();
    });
  });

  it('ejects model and resets state', async () => {
    mockFetch();
    const onModelChange = vi.fn();

    await act(async () => {
      render(<JUModelSelector onModelChange={onModelChange} />);
    });

    // Load
    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));
    await act(async () => {
      fireEvent.click(screen.getByText('llama3.1:8b'));
    });

    // Eject
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Eject model'));
    });

    await waitFor(() => {
      expect(onModelChange).toHaveBeenCalledWith(null);
      expect(screen.getByText('Choisir un modèle')).toBeInTheDocument();
      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });
  });

  it('shows error when Ollama is unreachable', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'));
    await act(async () => {
      render(<JUModelSelector />);
    });
    await waitFor(() => {
      expect(screen.getByText('Ollama injoignable')).toBeInTheDocument();
    });
  });

  it('shows error when loading fails', async () => {
    mockFetch({ generateFail: true });

    await act(async () => {
      render(<JUModelSelector />);
    });

    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await act(async () => {
      fireEvent.click(screen.getByText('llama3.1:8b'));
    });

    await waitFor(() => {
      expect(screen.getByText('Échec du chargement')).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation in dropdown', async () => {
    mockFetch();
    await act(async () => {
      render(<JUModelSelector />);
    });

    // Open dropdown
    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await waitFor(() => {
      expect(screen.getByText('llama3.1:8b')).toBeInTheDocument();
    });

    // Arrow down → focus first item
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    const firstOption = screen.getByText('llama3.1:8b').closest('.ju-model-selector__option');
    expect(firstOption?.classList.contains('ju-model-selector__option--focused')).toBe(true);

    // Escape → close dropdown
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('dropdown renders in a portal (not clipped by parent)', async () => {
    mockFetch();
    await act(async () => {
      render(
        <div style={{ overflow: 'hidden', height: 50 }}>
          <JUModelSelector />
        </div>
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /choisir/i }));

    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      // The dropdown should be a direct child of body (via portal)
      expect(listbox.parentElement).toBe(document.body);
    });
  });
});
