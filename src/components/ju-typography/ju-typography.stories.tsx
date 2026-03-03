import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTypography } from './ju-typography';

const meta: Meta<typeof JUTypography> = {
  title: 'Typography/JUTypography',
  component: JUTypography,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 700, padding: 40 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof JUTypography>;

export const AllVariants: Story = {
  render: () => (
    <>
      <JUTypography variant="caption">Caption — System Label</JUTypography>
      <JUTypography variant="h1">Heading One</JUTypography>
      <JUTypography variant="h2">Heading Two</JUTypography>
      <JUTypography variant="h3">Heading Three</JUTypography>
      <JUTypography variant="h4">Heading Four</JUTypography>
      <JUTypography variant="lead">Lead paragraph — ideal for article intros with generous line height for comfortable reading.</JUTypography>
      <JUTypography variant="body">Body text — optimized for long-form reading with a max-width of 65 characters and a line-height of 1.7 for readability.</JUTypography>
      <JUTypography variant="small">Small text for secondary information.</JUTypography>
    </>
  ),
};

export const GradientHeading: Story = {
  args: { variant: 'h1', gradient: true, balance: true, children: 'Luxury Design System' },
};

export const MutedBody: Story = {
  args: { variant: 'body', muted: true, children: 'Muted body text for secondary content that should not distract from the main content.' },
};

export const OnColoredBackground: Story = {
  name: 'On Colored Backgrounds',
  decorators: [(S) => <div style={{ maxWidth: 700 }}><S /></div>],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#1b82ff', color: '#ffffff', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h2">White on Blue</JUTypography>
        <JUTypography variant="body">The text inherits color from the parent — no forced overrides.</JUTypography>
        <JUTypography variant="caption">Caption text</JUTypography>
      </div>
      <div style={{ background: '#18181b', color: '#f4f4f5', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h2">Light on Dark</JUTypography>
        <JUTypography variant="body">Works on any dark surface without needing data-theme.</JUTypography>
        <JUTypography variant="body" muted>Muted still reduces visibility.</JUTypography>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h2">On Gradient</JUTypography>
        <JUTypography variant="lead">Lead text on a vibrant gradient background.</JUTypography>
      </div>
      <div style={{ background: '#fef3c7', color: '#92400e', padding: 32, borderRadius: 16 }}>
        <JUTypography variant="h3">Warm tones</JUTypography>
        <JUTypography variant="body">Brown text on warm yellow — any color combo works.</JUTypography>
      </div>
    </div>
  ),
};
