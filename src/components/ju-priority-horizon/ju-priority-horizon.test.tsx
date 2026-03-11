import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { JUPriorityHorizon } from './ju-priority-horizon';
import type { JUPriorityEmail } from './ju-priority-horizon';

const emails: JUPriorityEmail[] = [
  {
    id: '1',
    sender: 'Alice Martin',
    subject: 'Revue de code urgente pour le sprint 12',
    aiSummary: 'Alice demande une review du PR #342 avant la fin du sprint.',
  },
  {
    id: '2',
    sender: 'Bob Durand',
    subject: 'Mise à jour des dépendances critiques',
    aiSummary: 'Plusieurs CVE détectées. Bob propose un plan de migration.',
  },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('JUPriorityHorizon', () => {
  it('renders with title', () => {
    render(<JUPriorityHorizon emails={emails} webhookUrl="/webhook" title="My Inbox" />);
    expect(screen.getByText('My Inbox')).toBeInTheDocument();
  });

  it('displays email count', () => {
    render(<JUPriorityHorizon emails={emails} webhookUrl="/webhook" />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders sender and subject for each email', () => {
    render(<JUPriorityHorizon emails={emails} webhookUrl="/webhook" />);
    expect(screen.getByText('Alice Martin')).toBeInTheDocument();
    expect(screen.getByText('Revue de code urgente pour le sprint 12')).toBeInTheDocument();
    expect(screen.getByText('Bob Durand')).toBeInTheDocument();
  });

  it('renders AI badge for each email', () => {
    render(<JUPriorityHorizon emails={emails} webhookUrl="/webhook" />);
    const badges = screen.getAllByText('Résumé AI');
    expect(badges).toHaveLength(2);
  });

  it('shows AI summary on hover', () => {
    render(<JUPriorityHorizon emails={emails} webhookUrl="/webhook" />);
    const firstMail = screen.getByText('Alice Martin').closest('.ju-priority-horizon__mail')!;
    fireEvent.mouseEnter(firstMail);
    expect(firstMail).toHaveClass('ju-priority-horizon__mail--expanded');
  });

  it('hides AI summary on mouse leave', () => {
    render(<JUPriorityHorizon emails={emails} webhookUrl="/webhook" />);
    const firstMail = screen.getByText('Alice Martin').closest('.ju-priority-horizon__mail')!;
    fireEvent.mouseEnter(firstMail);
    fireEvent.mouseLeave(firstMail);
    expect(firstMail).not.toHaveClass('ju-priority-horizon__mail--expanded');
  });

  it('shows empty state when no emails', () => {
    render(<JUPriorityHorizon emails={[]} webhookUrl="/webhook" />);
    expect(screen.getByText('Aucun email prioritaire')).toBeInTheDocument();
  });

  it('archives email on check button click', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    const onArchive = vi.fn();
    render(<JUPriorityHorizon emails={emails} webhookUrl="/webhook" onArchive={onArchive} />);

    const archiveBtn = screen.getByLabelText("Archiver l'email de Alice Martin");
    await act(async () => {
      fireEvent.click(archiveBtn);
    });

    await waitFor(() => {
      expect(onArchive).toHaveBeenCalledWith('1');
      expect(screen.queryByText('Alice Martin')).not.toBeInTheDocument();
    });
  });
});
