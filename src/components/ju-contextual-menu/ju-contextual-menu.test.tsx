import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { JUContextualMenu } from './ju-contextual-menu';
import type { JUContextualMenuItem } from './ju-contextual-menu';

const basicItems: JUContextualMenuItem[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'delete', label: 'Delete', danger: true },
];

const trigger = <button>Open Menu</button>;

describe('JUContextualMenu', () => {
  it('renders trigger', () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} />);
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('does not show menu initially', () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens menu on trigger click', async () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  it('renders all items when open', async () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Duplicate')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('calls onClick and closes on item click', async () => {
    const onClick = vi.fn();
    const items: JUContextualMenuItem[] = [
      { id: 'action', label: 'Do Action', onClick },
    ];
    render(<JUContextualMenu trigger={trigger} items={items} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      fireEvent.click(screen.getByText('Do Action'));
    });
    expect(onClick).toHaveBeenCalledTimes(1);
    // Menu should close
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('renders section headers', async () => {
    const items: JUContextualMenuItem[] = [
      { id: '1', label: 'Open', section: 'File' },
      { id: '2', label: 'Delete', section: 'Danger', danger: true },
    ];
    render(<JUContextualMenu trigger={trigger} items={items} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      expect(screen.getByText('File')).toBeInTheDocument();
      expect(screen.getByText('Danger')).toBeInTheDocument();
    });
  });

  it('renders search bar when searchable', async () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} searchable />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search actions...')).toBeInTheDocument();
    });
  });

  it('filters items via search', async () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} searchable />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      const input = screen.getByPlaceholderText('Search actions...');
      fireEvent.change(input, { target: { value: 'dup' } });
    });
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('shows "No results" when search matches nothing', async () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} searchable />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Search actions...'), { target: { value: 'zzz' } });
    });
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('renders shortcut badges', async () => {
    const items: JUContextualMenuItem[] = [
      { id: 'save', label: 'Save', shortcut: '⌘S' },
    ];
    render(<JUContextualMenu trigger={trigger} items={items} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      expect(screen.getByText('⌘S')).toBeInTheDocument();
    });
  });

  it('renders icons', async () => {
    const items: JUContextualMenuItem[] = [
      { id: 'a', label: 'WithIcon', icon: <span data-testid="test-icon">★</span> },
    ];
    render(<JUContextualMenu trigger={trigger} items={items} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  it('applies danger class to danger items', async () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      const deleteBtn = screen.getByText('Delete').closest('button');
      expect(deleteBtn?.classList.contains('ju-ctx__item--danger')).toBe(true);
    });
  });

  it('applies disabled class to disabled items', async () => {
    const items: JUContextualMenuItem[] = [
      { id: 'dis', label: 'Disabled', disabled: true },
    ];
    render(<JUContextualMenu trigger={trigger} items={items} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      const btn = screen.getByText('Disabled').closest('button');
      expect(btn?.classList.contains('ju-ctx__item--disabled')).toBe(true);
      expect(btn?.disabled).toBe(true);
    });
  });

  it('closes menu on second trigger click', async () => {
    render(<JUContextualMenu trigger={trigger} items={basicItems} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('renders chevron for items with children', async () => {
    const items: JUContextualMenuItem[] = [
      {
        id: 'sub', label: 'Move to',
        children: [{ id: 'c1', label: 'Folder A' }],
      },
    ];
    render(<JUContextualMenu trigger={trigger} items={items} />);
    fireEvent.click(screen.getByText('Open Menu'));
    await waitFor(() => {
      const btn = screen.getByText('Move to').closest('button');
      expect(btn?.querySelector('.ju-ctx__item-chevron')).not.toBeNull();
    });
  });

  it('supports controlled open state', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <JUContextualMenu trigger={trigger} items={basicItems} open={false} onOpenChange={onOpenChange} />
    );
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(
      <JUContextualMenu trigger={trigger} items={basicItems} open={true} onOpenChange={onOpenChange} />
    );
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
  });
});
