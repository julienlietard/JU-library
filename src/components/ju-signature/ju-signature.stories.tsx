import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSignature } from './ju-signature';

const meta: Meta<typeof JUSignature> = {
  title: 'Forms/JUSignature',
  component: JUSignature,
  tags: ['autodocs'],
  argTypes: {
    penWidth: { control: { type: 'range', min: 1, max: 8, step: 0.5 } },
    penColor: { control: 'color' },
    variant: { control: 'radio', options: ['light', 'dark', 'white'] },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '3rem',
          background: '#e5e7eb',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUSignature>;

/* ── Light (default) ── */
export const Light: Story = {
  args: {
    label: 'Sign',
    penColor: '#f0e5e7',
    variant: 'light',
  },
};

/* ── Dark ── */
export const Dark: Story = {
  args: {
    label: 'Sign',
    penColor: '#f0e5e7',
    variant: 'dark',
  },
};

/* ── White ── */
export const White: Story = {
  args: {
    label: 'Sign',
    variant: 'white',
  },
};

/* ── Custom pen ── */
export const CustomPen: Story = {
  args: {
    label: 'Sign',
    penColor: '#ff3b5c',
    penWidth: 4,
    title: 'Your Signature',
    variant: 'white',
  },
};

/* ── With save callback ── */
const SaveDemo = () => {
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <JUSignature label="Sign Document" variant="white" onSave={(url) => setSavedUrl(url)} />
      {savedUrl && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            Saved signature:
          </p>
          <img
            src={savedUrl}
            alt="Saved signature"
            style={{ border: '1px solid #e5e7eb', borderRadius: 12, maxWidth: 300, background: '#fff' }}
          />
        </div>
      )}
    </div>
  );
};

export const WithCallback: Story = {
  render: () => <SaveDemo />,
};

/* ── All variants side by side ── */
const AllVariants = () => (
  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
    <JUSignature label="Light" variant="light" />
    <JUSignature label="Dark" variant="dark" />
    <JUSignature label="White" variant="white" />
  </div>
);

export const Variants: Story = {
  render: () => <AllVariants />,
};