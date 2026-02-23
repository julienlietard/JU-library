import type { Meta, StoryObj } from '@storybook/react';
import { JUCard } from './ju-card';
import { JUButton } from '../ju-button/ju-button';

const meta: Meta<typeof JUCard> = {
  title: 'Components/JUCard',
  component: JUCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['glass', 'solid', 'outline'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUCard>;

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>👋</div>
        <div style={{ fontWeight: 600, fontSize: '16px' }}>Julien Lietard</div>
        <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '16px' }}>
          Ingénieur Logiciel · Orléans
        </div>
        <JUButton label="Voir le profil" size="s" variant="primary" />
      </div>
    ),
  },
};

export const Solid: Story = {
  args: {
    variant: 'solid',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px', fontWeight: 600 }}>Project Status</h3>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
          Your next milestone is due in 3 days.
        </p>
      </div>
    ),
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px', fontWeight: 600 }}>Outline Card</h3>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>
          Minimal style for subtle content.
        </p>
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    variant: 'glass',
    padding: 'none',
    image: {
      src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
      alt: 'Code on screen',
    },
    children: (
      <div style={{ padding: '16px 20px' }}>
        <h3 style={{ margin: '0 0 8px', fontWeight: 600 }}>JU Design</h3>
        <p style={{ margin: '0 0 12px', fontSize: '13px', opacity: 0.7 }}>
          A personal React component library.
        </p>
        <JUButton label="Voir le projet" size="s" variant="ghost" />
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: 'glass',
    interactive: true,
    children: (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 600 }}>Hover me</div>
        <div style={{ fontSize: '13px', opacity: 0.7 }}>I have hover effects</div>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {(['glass', 'solid', 'outline'] as const).map((variant) => (
        <JUCard key={variant} variant={variant}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: '4px' }}>
              {variant}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>Card variant</div>
          </div>
        </JUCard>
      ))}
    </div>
  ),
};
