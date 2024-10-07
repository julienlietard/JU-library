import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import JUCarousel from './JUCarousel';
import JUCard from '../JUCard/JUCard';

const meta: Meta = {
  title: 'Components/JUCarousel',
  tags: ['autodocs'],
  component: JUCarousel,
};

export default meta;

const Template: StoryFn = (args) => (
  <JUCarousel {...args}>
    <JUCard title="Card 1" description="Description 1" actionLabel="Learn More" onActionClick={() => {}} />
    <JUCard title="Card 2" description="Description 2" actionLabel="Learn More" onActionClick={() => {}} />
    <JUCard title="Card 3" description="Description 3" actionLabel="Learn More" onActionClick={() => {}} />
  </JUCarousel>
);

export const Default = Template.bind({});
Default.args = {
  autoScroll: true,
  scrollInterval: 3000,
};
