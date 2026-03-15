import type { Meta, StoryObj } from '@storybook/react';
import { JUDigestSentinel } from './ju-digest-sentinel';
import type { JUDigestItem } from './ju-digest-sentinel';

const sampleItems: JUDigestItem[] = [
  {
    emoji: '🧠',
    title: 'Claude 4.5 repousse les limites du raisonnement',
    summary:
      "Anthropic dévoile Claude 4.5 avec des capacités de raisonnement multi-étapes nettement améliorées et une fenêtre de contexte étendue.",
    sourceUrl: 'https://example.com/claude-4-5',
    sourceName: 'Anthropic Blog',
  },
  {
    emoji: '⚡',
    title: 'Bun 2.0 : le runtime JS le plus rapide',
    summary:
      "La nouvelle version majeure de Bun promet des temps de démarrage divisés par 3 et une compatibilité Node.js quasi totale.",
    sourceUrl: 'https://example.com/bun-2',
    sourceName: 'Bun Blog',
  },
  {
    emoji: '🦀',
    title: 'Rust adopté par le noyau Linux 6.12',
    summary:
      "Le support Rust dans le kernel Linux franchit un cap avec l'intégration de drivers réseau critiques écrits en Rust.",
    sourceUrl: 'https://example.com/rust-linux',
    sourceName: 'LWN.net',
  },
  {
    emoji: '🔒',
    title: 'Nouvelle faille critique dans OpenSSL 3.x',
    summary:
      "Un buffer overflow dans le parsing des certificats X.509 affecte toutes les versions d'OpenSSL 3.x. Patch disponible.",
    sourceUrl: 'https://example.com/openssl-vuln',
    sourceName: 'CVE Database',
  },
  {
    emoji: '🚀',
    title: 'Vercel lance les Server Islands en preview',
    summary:
      "Les Server Islands permettent de mixer composants statiques et dynamiques au sein d'une même page Next.js sans compromis.",
    sourceUrl: 'https://example.com/server-islands',
    sourceName: 'Vercel Blog',
  },
  {
    emoji: '🎨',
    title: 'Figma dévoile son moteur de rendu GPU natif',
    summary:
      "Un nouveau moteur de rendu écrit en C++ et WebGPU promet des performances 10x pour les fichiers complexes.",
    sourceUrl: 'https://example.com/figma-gpu',
    sourceName: 'Figma Blog',
  },
];

const meta: Meta<typeof JUDigestSentinel> = {
  title: 'Widgets/JUDigestSentinel',
  component: JUDigestSentinel,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof JUDigestSentinel>;

export const Default: Story = {
  args: {
    title: 'Digest Sentinel',
    items: sampleItems,
  },
};

export const FewItems: Story = {
  args: {
    title: 'Veille du jour',
    items: sampleItems.slice(0, 3),
  },
};

export const SecurityFocus: Story = {
  args: {
    title: 'Alertes Sécurité',
    items: [
      sampleItems[3],
      {
        emoji: '🛡️',
        title: 'GitHub Active des alertes Dependabot pour Go',
        summary:
          "Les projets Go bénéficient désormais d'alertes automatiques pour les dépendances vulnérables via Dependabot.",
        sourceUrl: 'https://example.com/dependabot-go',
        sourceName: 'GitHub Blog',
      },
      {
        emoji: '🔑',
        title: 'Passkeys supportées par AWS IAM',
        summary:
          "AWS ajoute le support natif des passkeys FIDO2 pour l'authentification à la console et au CLI.",
        sourceUrl: 'https://example.com/aws-passkeys',
        sourceName: 'AWS Blog',
      },
    ],
  },
};
