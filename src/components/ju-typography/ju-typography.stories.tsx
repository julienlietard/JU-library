import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUTypography } from './ju-typography';

const meta: Meta<typeof JUTypography> = {
  title: 'Typography/JUTypography',
  component: JUTypography,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 700, color: '#fff', padding: 40 }}><S /></div>],
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