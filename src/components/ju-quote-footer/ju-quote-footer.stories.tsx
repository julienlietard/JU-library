import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUQuoteFooter } from './ju-quote-footer';

const portfolioQuotes = [
  { text: 'One must still have chaos in oneself to be able to give birth to a dancing star.', author: 'Friedrich Nietzsche' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'The details are not the details. They make the design.', author: 'Charles Eames' },
  { text: 'Everything is designed. Few things are designed well.', author: 'Brian Reed' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
];

const meta: Meta<typeof JUQuoteFooter> = {
  title: 'Components/JUQuoteFooter',
  component: JUQuoteFooter,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof JUQuoteFooter>;

export const Default: Story = {
  args: {
    quotes: portfolioQuotes,
    backgroundColor: '#161616',
    legal: {
      copyright: 'Copyright © 2025 | Julien LIETARD | Tous droits réservés',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
  },
};

export const WithBackgroundImage: Story = {
  args: {
    quotes: portfolioQuotes,
    backgroundImage: 'https://placehold.co/1400x600/1a1a2e/ffffff?text=✦',
    legal: {
      copyright: 'Copyright © 2025 | Julien LIETARD',
      links: [{ label: 'Privacy', href: '#' }, { label: 'Contact', href: '#' }],
    },
  },
};

export const SingleQuote: Story = {
  args: {
    quotes: [{ text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' }],
    backgroundColor: '#0f0f23',
  },
};

export const FastTransition: Story = {
  args: {
    quotes: portfolioQuotes,
    backgroundColor: '#1a1a2e',
    interval: 2000,
    transitionDuration: 300,
  },
};