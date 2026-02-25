import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUEditor } from './ju-editor';

const meta: Meta<typeof JUEditor> = {
  title: 'Forms/JUEditor',
  component: JUEditor,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 700 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUEditor>;

export const Default: Story = { args: {} };
export const WithContent: Story = {
  args: { defaultValue: '# Mon article\n\nVoici un **paragraphe** en markdown avec du _style_.\n\n> Une citation inspirante\n\n- Point 1\n- Point 2\n- Point 3' },
};
export const FloatingToolbar: Story = { args: { toolbarPosition: 'floating', minHeight: 400 } };
export const Minimal: Story = { args: { actions: ['bold', 'italic', 'link'], minHeight: 160 } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Contenu verrouillé' } };