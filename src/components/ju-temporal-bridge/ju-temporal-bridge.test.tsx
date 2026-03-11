import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { JUTemporalBridge } from './ju-temporal-bridge';
import type { JUMeeting } from './ju-temporal-bridge';

function futureDate(minutesFromNow: number): string {
  return new Date(Date.now() + minutesFromNow * 60_000).toISOString();
}

function pastDate(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

const WEBHOOK_URL = 'https://n8n.example.com/webhook/prepare-brief';

describe('JUTemporalBridge', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the empty state when no meetings are provided', () => {
    render(<JUTemporalBridge meetings={[]} webhookUrl={WEBHOOK_URL} />);
    expect(screen.getByText('Aucun meeting a venir')).toBeInTheDocument();
  });

  it('renders the default title', () => {
    render(<JUTemporalBridge meetings={[]} webhookUrl={WEBHOOK_URL} />);
    expect(screen.getByText('Temporal Bridge')).toBeInTheDocument();
  });

  it('renders a custom title', () => {
    render(<JUTemporalBridge meetings={[]} webhookUrl={WEBHOOK_URL} title="Prochain RDV" />);
    expect(screen.getByText('Prochain RDV')).toBeInTheDocument();
  });

  it('displays the next meeting title and time', () => {
    const meetings: JUMeeting[] = [
      { id: '1', title: 'Sprint Planning', startAt: futureDate(60) },
    ];
    render(<JUTemporalBridge meetings={meetings} webhookUrl={WEBHOOK_URL} />);
    expect(screen.getByText('Sprint Planning')).toBeInTheDocument();
  });

  it('skips past meetings and displays the next future one', () => {
    const meetings: JUMeeting[] = [
      { id: '1', title: 'Past Meeting', startAt: pastDate(30) },
      { id: '2', title: 'Future Meeting', startAt: futureDate(60) },
    ];
    render(<JUTemporalBridge meetings={meetings} webhookUrl={WEBHOOK_URL} />);
    expect(screen.queryByText('Past Meeting')).not.toBeInTheDocument();
    expect(screen.getByText('Future Meeting')).toBeInTheDocument();
  });

  it('shows the countdown digits', () => {
    const meetings: JUMeeting[] = [
      { id: '1', title: 'Test Meeting', startAt: futureDate(90) },
    ];
    render(<JUTemporalBridge meetings={meetings} webhookUrl={WEBHOOK_URL} />);
    // Should display hour/minute/second units
    expect(screen.getByText('h')).toBeInTheDocument();
    expect(screen.getByText('m')).toBeInTheDocument();
    expect(screen.getByText('s')).toBeInTheDocument();
  });

  it('renders the prepare button', () => {
    const meetings: JUMeeting[] = [
      { id: '1', title: 'Test Meeting', startAt: futureDate(60) },
    ];
    render(<JUTemporalBridge meetings={meetings} webhookUrl={WEBHOOK_URL} />);
    expect(screen.getByText("Preparer avec l'IA")).toBeInTheDocument();
  });

  it('calls the webhook and displays the brief on button click', async () => {
    const mockBrief = 'Voici le brief du meeting.';
    const onBrief = vi.fn();

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ brief: mockBrief }),
    });

    const meetings: JUMeeting[] = [
      { id: '1', title: 'Test', startAt: futureDate(60), context: 'Some context' },
    ];

    render(
      <JUTemporalBridge meetings={meetings} webhookUrl={WEBHOOK_URL} onBrief={onBrief} />,
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Preparer avec l'IA"));
    });

    await waitFor(() => {
      expect(screen.getByText(mockBrief)).toBeInTheDocument();
    });

    expect(onBrief).toHaveBeenCalledWith('1', mockBrief);
    expect(global.fetch).toHaveBeenCalledWith(WEBHOOK_URL, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
  });

  it('shows error message when webhook fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const meetings: JUMeeting[] = [
      { id: '1', title: 'Test', startAt: futureDate(60) },
    ];

    render(<JUTemporalBridge meetings={meetings} webhookUrl={WEBHOOK_URL} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Preparer avec l'IA"));
    });

    await waitFor(() => {
      expect(screen.getByText('Impossible de generer le brief.')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <JUTemporalBridge meetings={[]} webhookUrl={WEBHOOK_URL} className="my-custom" />,
    );
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });
});
