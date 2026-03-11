import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUCodeBlock } from './ju-code-block';

const meta: Meta<typeof JUCodeBlock> = {
  title: 'Contenu/JUCodeBlock',
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

export const JavaScript: Story = {
  args: {
    language: 'js',
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the 10th Fibonacci number
const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);`,
  },
};

export const Python: Story = {
  args: {
    language: 'python',
    code: `class DataProcessor:
    """Process and transform raw data."""

    def __init__(self, source: str):
        self.source = source
        self.data = []

    def load(self) -> list[dict]:
        # Load data from source
        with open(self.source, 'r') as f:
            self.data = json.load(f)
        return self.data

    def transform(self, key: str) -> list:
        return [item[key] for item in self.data if key in item]`,
  },
};

export const Bash: Story = {
  args: {
    language: 'bash',
    lineNumbers: false,
    code: `npm install @ju/design\nnpx storybook@latest init`,
  },
};

const jsonSample = JSON.stringify(
  { name: '@ju/design', version: '1.0.0', components: Array.from({ length: 20 }, (_, i) => `ju-component-${i + 1}`) },
  null,
  2,
);

export const JsonExample: Story = {
  args: {
    language: 'json',
    maxHeight: 200,
    code: jsonSample,
  },
};

export const CSS: Story = {
  args: {
    language: 'css',
    code: `.button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #1b82ff 0%, #0066e0 100%);
  color: #ffffff;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 130, 255, 0.4);
}`,
  },
};

export const MultiLanguage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <JUCodeBlock
        language="tsx"
        code={`const App = () => <h1>Hello</h1>;`}
      />
      <JUCodeBlock
        language="python"
        code={`print("Hello, World!")`}
      />
      <JUCodeBlock
        language="bash"
        lineNumbers={false}
        code={`curl -s https://api.example.com | jq '.data'`}
      />
    </div>
  ),
};
