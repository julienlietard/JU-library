import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { JUWorkflowTrigger } from './ju-workflow-trigger';
import type { JUWorkflowAction } from './ju-workflow-trigger';

const StarIcon = () => <svg data-testid="star-icon" />;
const BoltIcon = () => <svg data-testid="bolt-icon" />;

const actions: JUWorkflowAction[] = [
  { label: 'Deploy', icon: <StarIcon />, webhookUrl: 'https://n8n.test/deploy' },
  { label: 'Backup', icon: <BoltIcon />, webhookUrl: 'https://n8n.test/backup' },
  { label: 'Sync', icon: <StarIcon />, webhookUrl: 'https://n8n.test/sync' },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('JUWorkflowTrigger', () => {
  it('renders with title', () => {
    render(<JUWorkflowTrigger actions={actions} title="My Actions" />);
    expect(screen.getByText('My Actions')).toBeInTheDocument();
  });

  it('renders all action buttons', () => {
    render(<JUWorkflowTrigger actions={actions} />);
    expect(screen.getByLabelText('Deploy')).toBeInTheDocument();
    expect(screen.getByLabelText('Backup')).toBeInTheDocument();
    expect(screen.getByLabelText('Sync')).toBeInTheDocument();
  });

  it('renders labels for each button', () => {
    render(<JUWorkflowTrigger actions={actions} />);
    expect(screen.getByText('Deploy')).toBeInTheDocument();
    expect(screen.getByText('Backup')).toBeInTheDocument();
    expect(screen.getByText('Sync')).toBeInTheDocument();
  });

  it('renders custom icons', () => {
    render(<JUWorkflowTrigger actions={actions} />);
    expect(screen.getAllByTestId('star-icon')).toHaveLength(2);
    expect(screen.getByTestId('bolt-icon')).toBeInTheDocument();
  });

  it('calls webhook on click and triggers callback', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('ok', { status: 200 })
    );
    const onTrigger = vi.fn();

    render(<JUWorkflowTrigger actions={actions} onTrigger={onTrigger} />);

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Deploy'));
    });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://n8n.test/deploy',
        expect.objectContaining({ method: 'POST' })
      );
      expect(onTrigger).toHaveBeenCalledWith('Deploy', true);
    });
  });

  it('shows loading state on the clicked button', async () => {
    // Create a promise we control to keep the fetch pending
    let resolvePromise!: () => void;
    const pending = new Promise<Response>((resolve) => {
      resolvePromise = () => resolve(new Response('ok', { status: 200 }));
    });
    vi.spyOn(global, 'fetch').mockReturnValue(pending);

    render(<JUWorkflowTrigger actions={actions} />);

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Deploy'));
    });

    // Button should be loading now
    const deployBtn = screen.getByLabelText('Deploy');
    expect(deployBtn).toHaveClass('ju-workflow-trigger__btn--loading');
    expect(deployBtn).toBeDisabled();

    // Other buttons are NOT loading
    expect(screen.getByLabelText('Backup')).not.toHaveClass('ju-workflow-trigger__btn--loading');

    // Resolve to clean up
    await act(async () => {
      resolvePromise();
    });
  });

  it('reports failure when fetch rejects', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'));
    const onTrigger = vi.fn();

    render(<JUWorkflowTrigger actions={actions} onTrigger={onTrigger} />);

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Backup'));
    });

    await waitFor(() => {
      expect(onTrigger).toHaveBeenCalledWith('Backup', false);
    });
  });

  it('applies custom column count via grid style', () => {
    const { container } = render(<JUWorkflowTrigger actions={actions} columns={4} />);
    const grid = container.querySelector('.ju-workflow-trigger__grid') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
  });
});
