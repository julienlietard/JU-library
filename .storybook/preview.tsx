import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import '@fontsource-variable/inter';
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

      // Set data-theme on :root so CSS tokens resolve correctly
      useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.style.background = theme === 'dark' ? '#18181b' : 'transparent';
        return () => {
          document.documentElement.removeAttribute('data-theme');
          document.body.style.background = '';
        };
      }, [theme]);

      return <Story />;
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
