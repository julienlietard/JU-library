// .storybook/preview.ts

import { type Preview, type StoryFn } from '@storybook/react'; // Import des types Preview et StoryFn de Storybook
import React from 'react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story: StoryFn) => {
      // Utilisation de React.createElement pour éviter JSX
      return React.createElement(Story); // Rendu du composant Story
    },
  ],
};

export default preview;
