import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUCodeBlock } from './ju-code-block';

const meta: Meta<typeof JUCodeBlock> = {
  title: 'Content/JUCodeBlock',
  component: JUCodeBlock,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 700, margin: '0 auto', padding: 40 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof JUCodeBlock>;

export const TypeScript: Story = {
  args: {
    language: 'tsx',
    highlightLines: [3],
    code: `import { JUButton } from '@ju/design';

export const App = () => (
  <JUButton variant="primary" size="l">
    Get Started
  </JUButton>
);`,
  },
};

export const Bash: Story = {
  args: {
    language: 'bash',
    lineNumbers: false,
    code: `npm install @ju/design\nnpx storybook@latest init`,
  },
};

export const WithScroll: Story = {
  args: {
    language: 'json',
    maxHeight: 200,
    code: JSON.stringify({ name: '@ju/design', version: '1.0.0', components: Array.from({ length: 20 }, (_, i) => `ju-component-${i + 1}`) }, null, 2),
  },
};