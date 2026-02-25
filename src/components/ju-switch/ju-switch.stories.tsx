import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUSwitch } from './ju-switch';

const meta: Meta<typeof JUSwitch> = {
  title: 'Forms/JUSwitch',
  component: JUSwitch,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JUSwitch>;

export const Default: Story = { args: { label: 'Activer les notifications' } };
export const Checked: Story = { args: { label: 'Mode sombre', defaultChecked: true } };
export const Small: Story = { args: { label: 'Compact', size: 'sm' } };
export const Large: Story = { args: { label: 'Publier l\'article', size: 'lg' } };
export const Disabled: Story = { args: { label: 'Verrouillé', disabled: true } };
export const CustomColor: Story = { args: { label: 'Succès', defaultChecked: true, color: '#34c759' } };
export const LabelLeft: Story = { args: { label: 'À gauche', labelPosition: 'left', defaultChecked: true } };

export const ControlledGroup: Story = {
  render: () => {
    const [vals, setVals] = useState({ dark: true, notif: false, pub: false });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <JUSwitch label="Mode sombre" checked={vals.dark} onChange={(v) => setVals({ ...vals, dark: v })} />
        <JUSwitch label="Notifications" checked={vals.notif} onChange={(v) => setVals({ ...vals, notif: v })} />
        <JUSwitch label="Publier" checked={vals.pub} onChange={(v) => setVals({ ...vals, pub: v })} color="#ff4e6b" />
      </div>
    );
  },
};