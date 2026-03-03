import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';
import '../src/styles/reset.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      return (
        <div
          data-theme={theme}
          style={{
            background: theme === 'dark' ? '#18181b' : '#ffffff',
            color: theme === 'dark' ? '#f4f4f5' : '#18181b',
            minHeight: '100vh',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
