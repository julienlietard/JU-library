import type { Meta, StoryObj } from '@storybook/react';
import { JUSemanticRadar } from './ju-semantic-radar';
import type { JUSemanticTag } from './ju-semantic-radar';

const meta: Meta<typeof JUSemanticRadar> = {
  title: 'Widgets/JUSemanticRadar',
  component: JUSemanticRadar,
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
type Story = StoryObj<typeof JUSemanticRadar>;

const sampleTags: JUSemanticTag[] = [
  { label: 'react', count: 42 },
  { label: 'typescript', count: 38 },
  { label: 'architecture', count: 27 },
  { label: 'n8n', count: 21 },
  { label: 'design-system', count: 19 },
  { label: 'ollama', count: 15 },
  { label: 'chromadb', count: 14 },
  { label: 'nextjs', count: 12 },
  { label: 'css', count: 10 },
  { label: 'testing', count: 8 },
  { label: 'docker', count: 6 },
  { label: 'git', count: 4 },
];

export const Default: Story = {
  args: {
    tags: sampleTags,
    title: 'Semantic Radar',
  },
};

export const FewTags: Story = {
  args: {
    tags: [
      { label: 'react', count: 15, color: 'blue' },
      { label: 'vue', count: 8, color: 'green' },
      { label: 'angular', count: 3, color: 'red' },
    ],
    title: 'Frameworks',
  },
};

export const WithCallback: Story = {
  render: () => (
    <JUSemanticRadar
      tags={sampleTags}
      title="Clickable Tags"
      onFilter={(tag) => alert(`Filtrage MemoryStream: "${tag}"`)}
    />
  ),
};

export const Empty: Story = {
  args: {
    tags: [],
  },
};

export const SingleTag: Story = {
  args: {
    tags: [{ label: 'lonely-tag', count: 1 }],
  },
};
