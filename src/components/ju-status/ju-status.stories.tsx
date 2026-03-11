import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUStatus } from './ju-status';
import { Clock, Loader, Send, Eye, CircleCheck, CircleX, TimerOff } from 'lucide-react';

const meta: Meta<typeof JUStatus> = {
  title: 'Components/JUStatus', component: JUStatus, tags: ['autodocs'],
  argTypes: { color: { control: 'select', options: ['orange','blue','purple','yellow','green','red','gray'] } },
};
export default meta;
type Story = StoryObj<typeof JUStatus>;
export const Default: Story = { args: { label: 'En cours', color: 'blue', icon: <Loader size={14} /> } };
export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '2rem' }}>
      <JUStatus label="En attente" color="orange" icon={<Clock size={14} />} />
      <JUStatus label="En cours" color="blue" icon={<Loader size={14} />} />
      <JUStatus label="Soumis" color="purple" icon={<Send size={14} />} />
      <JUStatus label="En revue" color="yellow" icon={<Eye size={14} />} />
      <JUStatus label="Validé" color="green" icon={<CircleCheck size={14} />} />
      <JUStatus label="Échoué" color="red" icon={<CircleX size={14} />} />
      <JUStatus label="Expiré" color="gray" icon={<TimerOff size={14} />} />
    </div>
  ),
};
