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

      // Inject a <style> tag to force dark bg on every Storybook layer
      useEffect(() => {
        const isDark = theme === 'dark';
        const bg = isDark ? '#0a0a0b' : 'transparent';

        // 1. Root data-theme — propagates all CSS tokens
        document.documentElement.setAttribute('data-theme', theme);

        // 2. Inject a persistent style tag that covers every SB layer
        const styleId = 'ju-theme-override';
        let style = document.getElementById(styleId) as HTMLStyleElement | null;
        if (!style) {
          style = document.createElement('style');
          style.id = styleId;
          document.head.appendChild(style);
        }
        style.textContent = isDark
          ? `html,body,#storybook-root,.sb-show-main,.sb-main-padded{background:#0a0a0b !important;}`
          : `html,body,#storybook-root,.sb-show-main,.sb-main-padded{background:transparent !important;}`;

        // 3. Inline styles as fallback
        document.documentElement.style.background = bg;
        document.body.style.background = bg;
        const sbRoot = document.getElementById('storybook-root');
        if (sbRoot) sbRoot.style.background = bg;

        return () => {
          document.documentElement.removeAttribute('data-theme');
          document.documentElement.style.background = '';
          document.body.style.background = '';
          const sbRootClean = document.getElementById('storybook-root');
          if (sbRootClean) sbRootClean.style.background = '';
          const s = document.getElementById(styleId);
          if (s) s.remove();
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
