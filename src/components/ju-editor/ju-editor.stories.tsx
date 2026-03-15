import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUEditor } from './ju-editor';

const meta: Meta<typeof JUEditor> = {
  title: 'Organisms/JUEditor',
  component: JUEditor,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 700, padding: 40 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof JUEditor>;

export const Default: Story = {
  args: {
    placeholder: 'Start writing... select text to see the toolbar.',
  },
};

export const WithContent: Story = {
  args: {
    defaultValue:
      '<h2>My Article</h2><p>This is a <strong>rich text</strong> editor with <em>inline formatting</em> and <u>underline support</u>.</p><p>Select any text to see the floating toolbar appear above your selection. You can change the font, size, apply bold/italic/underline, adjust alignment, or pick a text color.</p>',
  },
};

export const CustomFonts: Story = {
  args: {
    fontFamilies: ['System', 'Serif', 'Mono', 'Inter', 'Georgia'],
    fontSizes: [12, 14, 16, 18, 20, 24, 28, 32],
    defaultValue:
      '<p>This editor has extended font and size options. Select text and use the dropdowns to try them.</p>',
  },
};

export const CustomColors: Story = {
  args: {
    colors: [
      '#000000', '#ef4444', '#f59e0b', '#10b981',
      '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
    ],
    defaultValue:
      '<p>Select text and use the <strong>color picker</strong> to apply different colors.</p>',
  },
};

export const MinimalHeight: Story = {
  args: {
    minHeight: 120,
    placeholder: 'Write a short note...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '<p>This content is <strong>read-only</strong>. The editor is disabled.</p>',
  },
};

export const LongContent: Story = {
  args: {
    minHeight: 400,
    defaultValue:
      '<h2>Project Brief</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p><p style="text-align: center;"><em>This paragraph is centered and italic.</em></p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p><p><span style="color: #2563eb;">This text is blue.</span> And <span style="color: #dc2626;">this text is red.</span></p>',
  },
};
