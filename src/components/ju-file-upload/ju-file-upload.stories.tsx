import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUFileUpload } from './ju-file-upload';

const meta: Meta<typeof JUFileUpload> = {
  title: 'Organisms/JUFileUpload',
  component: JUFileUpload,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ maxWidth: 500 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof JUFileUpload>;

export const Default: Story = { args: {} };
export const Images: Story = { args: { accept: 'image/*', label: 'Glissez vos images ici', hint: 'PNG, JPG ou WebP' } };
export const MaxSize: Story = { args: { maxSize: 5 * 1024 * 1024, hint: 'Max 5 MB', onError: (msg) => alert(msg) } };
export const Multiple: Story = { args: { multiple: true, label: 'Glissez vos documents' } };
export const Disabled: Story = { args: { disabled: true } };