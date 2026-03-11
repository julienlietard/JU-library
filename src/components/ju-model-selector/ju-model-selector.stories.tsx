import type { Meta, StoryObj } from '@storybook/react';
import { JUModelSelector } from './ju-model-selector';
import React, { useEffect, useRef } from 'react';

/* ── Mock data ── */

const mockModels = {
  models: [
    { name: 'llama3.1:8b', size: 4_700_000_000, modified_at: '2025-01-15T10:00:00Z' },
    { name: 'mistral:7b', size: 4_100_000_000, modified_at: '2025-01-10T08:00:00Z' },
    { name: 'codellama:13b', size: 7_400_000_000, modified_at: '2025-01-08T12:00:00Z' },
    { name: 'phi3:mini', size: 2_300_000_000, modified_at: '2025-01-05T09:00:00Z' },
    { name: 'gemma2:2b', size: 1_600_000_000, modified_at: '2025-01-03T14:00:00Z' },
    { name: 'deepseek-coder:6.7b', size: 3_800_000_000, modified_at: '2025-01-02T11:00:00Z' },
    { name: 'qwen2:7b', size: 4_000_000_000, modified_at: '2025-01-01T08:00:00Z' },
  ],
};

const fewModels = {
  models: [
    { name: 'llama3.1:8b', size: 4_700_000_000, modified_at: '2025-01-15T10:00:00Z' },
    { name: 'mistral:7b', size: 4_100_000_000, modified_at: '2025-01-10T08:00:00Z' },
  ],
};

/* ── Mock decorator factory ── */

function withMockOllama(opts?: {
  models?: typeof mockModels;
  loadDelay?: number;
  loadFail?: boolean;
  fetchFail?: boolean;
}) {
  const {
    models = mockModels,
    loadDelay = 600,
    loadFail = false,
    fetchFail = false,
  } = opts ?? {};

  // Return a decorator that replaces fetch SYNCHRONOUSLY before render,
  // so the component's initial useEffect already hits the mock.
  return (Story: React.ComponentType) => {
    const originalFetch = useRef<typeof window.fetch | null>(null);

    // Capture & replace synchronously on first render
    if (originalFetch.current === null) {
      originalFetch.current = window.fetch;
    }

    window.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = url.toString();

      if (urlStr.includes('/api/tags')) {
        if (fetchFail) throw new Error('Connection refused');
        return new Response(JSON.stringify(models), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (urlStr.includes('/api/generate')) {
        await new Promise((r) => setTimeout(r, loadDelay));
        if (loadFail) throw new Error('Model load failed');
        return new Response('{}', { status: 200 });
      }

      return originalFetch.current!(url, init);
    }) as typeof fetch;

    // Cleanup only on unmount
    useEffect(() => {
      return () => {
        if (originalFetch.current) {
          window.fetch = originalFetch.current;
          originalFetch.current = null;
        }
      };
    }, []);

    return <Story />;
  };
}

/* ── Meta ── */

const meta: Meta<typeof JUModelSelector> = {
  title: 'Widgets/JUModelSelector',
  component: JUModelSelector,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', minHeight: 400 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof JUModelSelector>;

/* ── Stories ── */

/** Default state — full model list, ready to interact */
export const Default: Story = {
  args: {
    ollamaUrl: 'http://localhost:11434',
    title: 'Sélecteur de Modèle',
  },
  decorators: [withMockOllama()],
};

/** Custom title and few models */
export const FewModels: Story = {
  args: {
    ollamaUrl: 'http://localhost:11434',
    title: 'Modèles Ollama',
  },
  decorators: [withMockOllama({ models: fewModels })],
};

/** Simulates Ollama being unreachable */
export const ErrorState: Story = {
  args: {
    title: 'Ollama — Erreur',
  },
  decorators: [withMockOllama({ fetchFail: true })],
};

/** Simulates a model failing to load after selection */
export const LoadFailure: Story = {
  args: {
    title: 'Échec du chargement',
  },
  decorators: [withMockOllama({ loadFail: true })],
};

/** Slow loading — shows the "Chargement…" state clearly */
export const SlowLoading: Story = {
  args: {
    title: 'Chargement lent',
  },
  decorators: [withMockOllama({ loadDelay: 3000 })],
};

/** Interactive demo with onChange callback logged in Actions panel */
export const Interactive: Story = {
  args: {
    title: 'Sélecteur interactif',
    onModelChange: (model: string | null) => {
      console.log('[JUModelSelector] onModelChange →', model);
    },
  },
  decorators: [withMockOllama({ loadDelay: 400 })],
};

/** Side-by-side — multiple selectors */
export const SideBySide: Story = {
  decorators: [
    withMockOllama(),
    (Story) => (
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '2rem' }}>
        <JUModelSelector title="Serveur local" ollamaUrl="http://localhost:11434" />
        <JUModelSelector title="Serveur distant" ollamaUrl="http://remote:11434" />
      </div>
    ),
  ],
};
