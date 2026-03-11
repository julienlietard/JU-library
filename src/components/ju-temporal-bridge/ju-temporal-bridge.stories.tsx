import type { Meta, StoryObj } from '@storybook/react';
import { JUTemporalBridge } from './ju-temporal-bridge';
import { useEffect } from 'react';

function futureDate(minutesFromNow: number): string {
  return new Date(Date.now() + minutesFromNow * 60_000).toISOString();
}

function withMockWebhook() {
  return (Story: React.ComponentType) => {
    useEffect(() => {
      const original = window.fetch;
      window.fetch = ((url: string, opts?: RequestInit) => {
        if (typeof url === 'string' && url.includes('webhook')) {
          return new Promise<Response>((resolve) =>
            setTimeout(
              () =>
                resolve(
                  new Response(
                    JSON.stringify({
                      brief:
                        'Points cles : revoir les maquettes Figma v2, valider le scope du sprint 14, et discuter du recrutement front-end. Prepare des questions sur le budget Q3.',
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } },
                  ),
                ),
              1200,
            ),
          );
        }
        return original(url, opts);
      }) as typeof fetch;
      return () => {
        window.fetch = original;
      };
    }, []);
    return <Story />;
  };
}

const meta: Meta<typeof JUTemporalBridge> = {
  title: 'Widgets/JUTemporalBridge',
  component: JUTemporalBridge,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUTemporalBridge>;

export const NextMeetingSoon: Story = {
  args: {
    meetings: [
      {
        id: '1',
        title: 'Sprint Planning #14',
        startAt: futureDate(47),
        context: 'Revue du backlog, estimation des stories, assignation des tasks.',
      },
      {
        id: '2',
        title: 'Design Review',
        startAt: futureDate(180),
        context: 'Feedback sur les maquettes du dashboard v2.',
      },
    ],
    webhookUrl: 'https://n8n.example.com/webhook/prepare-brief',
    title: 'Temporal Bridge',
  },
  decorators: [withMockWebhook()],
};

export const MeetingInHours: Story = {
  args: {
    meetings: [
      {
        id: '3',
        title: 'Client Sync — Acme Corp',
        startAt: futureDate(195),
        context: 'Point trimestriel sur la roadmap produit et les KPIs.',
      },
    ],
    webhookUrl: 'https://n8n.example.com/webhook/prepare-brief',
    title: 'Prochain RDV',
  },
  decorators: [withMockWebhook()],
};

export const NoMeetings: Story = {
  args: {
    meetings: [],
    webhookUrl: 'https://n8n.example.com/webhook/prepare-brief',
  },
};
