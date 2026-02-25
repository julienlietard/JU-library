import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUCallout } from './ju-callout';

const meta: Meta<typeof JUCallout> = {
  title: 'Content/JUCallout',
  component: JUCallout,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 600, margin: '0 auto', padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof JUCallout>;

export const AllVariants: Story = {
  render: () => (
    <>
      <JUCallout variant="note" title="Note">A simple note to add context to your article.</JUCallout>
      <JUCallout variant="info" title="Information">This component uses CSS custom properties from the JU Design token system.</JUCallout>
      <JUCallout variant="warning" title="Attention">This API is deprecated and will be removed in v2.0.</JUCallout>
      <JUCallout variant="success" title="Done!">Your component has been successfully published to npm.</JUCallout>
      <JUCallout variant="danger" title="Breaking Change">This update contains breaking changes to the Button API.</JUCallout>
    </>
  ),
};

export const NoTitle: Story = {
  args: { variant: 'info', children: 'A simple callout without a title.' },
};

export const NoIcon: Story = {
  args: { variant: 'warning', title: 'Custom', hideIcon: true, children: 'A callout without icon.' },
};