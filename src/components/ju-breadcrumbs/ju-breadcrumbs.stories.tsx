import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUBreadcrumbs } from './ju-breadcrumbs';

const meta: Meta<typeof JUBreadcrumbs> = {
  title: 'Navigation/JUBreadcrumbs',
  component: JUBreadcrumbs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUBreadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Articles', href: '/articles' },
      { label: 'Mon POC React' },
    ],
  },
};

export const Long: Story = {
  args: {
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Projets', href: '/projets' },
      { label: 'Design System', href: '/projets/ds' },
      { label: 'Composants', href: '/projets/ds/composants' },
      { label: 'Navigation', href: '/projets/ds/composants/nav' },
      { label: 'Breadcrumbs' },
    ],
    maxItems: 4,
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Article' },
    ],
    separator: '/',
  },
};