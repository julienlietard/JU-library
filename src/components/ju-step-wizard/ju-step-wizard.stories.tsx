import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUStepWizard } from './ju-step-wizard';
import type { JUStepDef } from './ju-step-wizard';
import { User, CreditCard, Settings, Check, Mail } from 'lucide-react';

const BASIC_STEPS: JUStepDef[] = [
  { id: 'account', label: 'Account', description: 'Create your account' },
  { id: 'profile', label: 'Profile', description: 'Set up your profile' },
  { id: 'payment', label: 'Payment', description: 'Add payment method' },
  { id: 'confirm', label: 'Confirm', description: 'Review & confirm' },
];

const meta: Meta<typeof JUStepWizard> = {
  title: 'Organisms/JUStepWizard',
  component: JUStepWizard,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light-gray',
      values: [
        { name: 'light-gray', value: '#ebebef' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#111111' },
      ],
    },
  },
  argTypes: {
    variant: { control: 'radio', options: ['horizontal', 'compact'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    linear: { control: 'boolean' },
    showProgressBar: { control: 'boolean' },
    hideNav: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof JUStepWizard>;

const StepContent: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div style={{ padding: '24px', background: 'rgba(255,255,255,0.7)', borderRadius: 12, minHeight: 120 }}>
    <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>{title}</h3>
    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{text}</p>
  </div>
);

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    steps: BASIC_STEPS,
    defaultActiveStep: 0,
    size: 'md',
    variant: 'horizontal',
    showProgressBar: true,
  },
  render: (args) => (
    <JUStepWizard {...args}>
      <StepContent title="Account Setup" text="Enter your email and password to create an account." />
      <StepContent title="Profile" text="Tell us about yourself." />
      <StepContent title="Payment" text="Add a payment method to your account." />
      <StepContent title="Confirmation" text="Review your details and confirm." />
    </JUStepWizard>
  ),
};

// ─── With Validation ────────────────────────────────────────────────────────

export const WithValidation: Story = {
  name: 'With Validation',
  render: () => {
    const [step, setStep] = useState(0);
    return (
      <JUStepWizard
        steps={BASIC_STEPS}
        activeStep={step}
        onStepChange={setStep}
        showProgressBar
        onStepValidate={(id, idx) => {
          // Simulate: step 1 always fails validation
          if (idx === 1) return false;
          return new Promise((resolve) => setTimeout(() => resolve(true), 800));
        }}
        onFinish={() => alert('Finished!')}
      >
        <StepContent title="Account" text="This step passes validation." />
        <StepContent title="Profile" text="This step always fails validation (for demo)." />
        <StepContent title="Payment" text="This step passes after a delay." />
        <StepContent title="Confirm" text="Click Finish to complete." />
      </JUStepWizard>
    );
  },
};

// ─── Free Navigation ────────────────────────────────────────────────────────

export const FreeNavigation: Story = {
  name: 'Free Navigation',
  args: {
    steps: BASIC_STEPS,
    linear: false,
    showProgressBar: true,
  },
  render: (args) => (
    <JUStepWizard {...args}>
      <StepContent title="Account" text="Click any step above — navigation is non-linear." />
      <StepContent title="Profile" text="You can jump to any step freely." />
      <StepContent title="Payment" text="No need to complete steps in order." />
      <StepContent title="Confirm" text="All steps are accessible at any time." />
    </JUStepWizard>
  ),
};

// ─── Compact Variant ────────────────────────────────────────────────────────

export const CompactVariant: Story = {
  name: 'Compact Variant',
  args: {
    steps: BASIC_STEPS,
    variant: 'compact',
    size: 'sm',
    showProgressBar: true,
  },
  render: (args) => (
    <JUStepWizard {...args}>
      <StepContent title="Step 1" text="Compact variant hides labels." />
      <StepContent title="Step 2" text="Only circles and connectors are shown." />
      <StepContent title="Step 3" text="Great for tight layouts." />
      <StepContent title="Step 4" text="All done!" />
    </JUStepWizard>
  ),
};

// ─── With Icons ─────────────────────────────────────────────────────────────

const ICON_STEPS: JUStepDef[] = [
  { id: 'account', label: 'Account', icon: <User size={16} /> },
  { id: 'email', label: 'Email', icon: <Mail size={16} /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard size={16} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  { id: 'done', label: 'Done', icon: <Check size={16} /> },
];

export const WithIcons: Story = {
  name: 'With Icons',
  args: {
    steps: ICON_STEPS,
    showProgressBar: true,
  },
  render: (args) => (
    <JUStepWizard {...args}>
      <StepContent title="Account" text="Icons replace step numbers." />
      <StepContent title="Email" text="Custom icons from lucide-react." />
      <StepContent title="Payment" text="Each step can have its own icon." />
      <StepContent title="Settings" text="Icons are replaced by checkmarks when completed." />
      <StepContent title="Done" text="All finished!" />
    </JUStepWizard>
  ),
};

// ─── Many Steps ─────────────────────────────────────────────────────────────

export const ManySteps: Story = {
  name: 'Many Steps (stress)',
  args: {
    steps: Array.from({ length: 8 }, (_, i) => ({
      id: `step-${i}`,
      label: `Step ${i + 1}`,
      optional: i === 5,
    })),
    showProgressBar: true,
    size: 'sm',
  },
  render: (args) => (
    <JUStepWizard {...args}>
      {Array.from({ length: 8 }, (_, i) => (
        <StepContent key={i} title={`Step ${i + 1}`} text={`Content for step ${i + 1}.`} />
      ))}
    </JUStepWizard>
  ),
};

// ─── Sizes ──────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  name: 'Size: Small',
  args: { steps: BASIC_STEPS, size: 'sm', showProgressBar: true },
  render: (args) => (
    <JUStepWizard {...args}>
      <StepContent title="Small" text="sm size variant." />
      <StepContent title="Step 2" text="Content." />
      <StepContent title="Step 3" text="Content." />
      <StepContent title="Step 4" text="Content." />
    </JUStepWizard>
  ),
};

export const SizeLarge: Story = {
  name: 'Size: Large',
  args: { steps: BASIC_STEPS, size: 'lg', showProgressBar: true },
  render: (args) => (
    <JUStepWizard {...args}>
      <StepContent title="Large" text="lg size variant." />
      <StepContent title="Step 2" text="Content." />
      <StepContent title="Step 3" text="Content." />
      <StepContent title="Step 4" text="Content." />
    </JUStepWizard>
  ),
};
