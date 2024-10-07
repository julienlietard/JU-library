// .storybook/main.tsx

import { type StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)', // Chemins vers tes fichiers d'histoires
  ],
  addons: [
    '@storybook/addon-links', // Liens entre les histoires
    '@storybook/addon-essentials', // Outils essentiels
    '@storybook/addon-docs', // Documentatio,
  ],
  framework: {
    name: '@storybook/react-webpack5', // Utiliser Webpack 5 avec React
    options: {},
  },
};

export default config;
