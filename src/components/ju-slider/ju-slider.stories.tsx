import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { JUSlider } from './ju-slider';

const meta: Meta<typeof JUSlider> = {
  title: 'Forms/JUSlider',
  component: JUSlider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '3rem 2rem', maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof JUSlider>;

/* ── Basic ── */

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 40,
    showTooltip: 'hover',
  },
};

/* ── Range (dual thumb) ── */

export const Range: Story = {
  render: () => {
    const [val, setVal] = useState<[number, number]>([20, 75]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <JUSlider
          range
          min={0}
          max={100}
          value={val}
          onChange={(v) => setVal(v as [number, number])}
          showTooltip="always"
        />
        <p style={{ fontSize: '0.85rem', color: '#888', margin: 0, textAlign: 'center' }}>
          Range: <strong>{val[0]}</strong> — <strong>{val[1]}</strong>
        </p>
      </div>
    );
  },
};

/* ── With marks ── */

export const WithMarks: Story = {
  args: {
    min: 0,
    max: 100,
    step: 25,
    defaultValue: 50,
    marks: [
      { value: 0, label: '0%' },
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100%' },
    ],
    showTooltip: 'hover',
  },
};

/* ── Gradient variant ── */

export const Gradient: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 65,
    variant: 'gradient',
    showTooltip: 'always',
  },
};

/* ── Formatted values (price) ── */

export const FormattedPrice: Story = {
  render: () => {
    const [val, setVal] = useState<[number, number]>([200, 800]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <JUSlider
          range
          min={0}
          max={1000}
          step={50}
          value={val}
          onChange={(v) => setVal(v as [number, number])}
          formatValue={(v) => `${v}€`}
          showTooltip="always"
          showMinMax
          variant="gradient"
        />
        <p style={{ fontSize: '0.85rem', color: '#888', margin: 0, textAlign: 'center' }}>
          Budget: <strong>{val[0]}€</strong> — <strong>{val[1]}€</strong>
        </p>
      </div>
    );
  },
};

/* ── All Sizes ── */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <span style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 8, display: 'block' }}>Small</span>
        <JUSlider size="sm" defaultValue={30} showTooltip="hover" />
      </div>
      <div>
        <span style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 8, display: 'block' }}>Medium (default)</span>
        <JUSlider size="md" defaultValue={50} showTooltip="hover" />
      </div>
      <div>
        <span style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 8, display: 'block' }}>Large</span>
        <JUSlider size="lg" defaultValue={70} showTooltip="hover" />
      </div>
    </div>
  ),
};

/* ── Variants ── */

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <span style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 8, display: 'block' }}>Default</span>
        <JUSlider variant="default" defaultValue={50} showTooltip="always" />
      </div>
      <div>
        <span style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 8, display: 'block' }}>Gradient</span>
        <JUSlider variant="gradient" defaultValue={50} showTooltip="always" />
      </div>
      <div>
        <span style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 8, display: 'block' }}>Minimal</span>
        <JUSlider variant="minimal" defaultValue={50} showTooltip="always" />
      </div>
    </div>
  ),
};

/* ── Disabled ── */

export const Disabled: Story = {
  args: {
    min: 0,
    max: 100,
    defaultValue: 60,
    disabled: true,
    showTooltip: 'always',
  },
};

/* ── Interactive (controlled) ── */

export const Interactive: Story = {
  render: () => {
    const [val, setVal] = useState(42);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <JUSlider
          min={0}
          max={100}
          step={1}
          value={val}
          onChange={(v) => setVal(v as number)}
          showTooltip="always"
          formatValue={(v) => `${v}%`}
          showMinMax
          marks={[
            { value: 0, label: 'Min' },
            { value: 50, label: 'Mid' },
            { value: 100, label: 'Max' },
          ]}
        />
        <div style={{ textAlign: 'center' }}>
          <input
            type="number"
            value={val}
            min={0}
            max={100}
            onChange={(e) => setVal(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              borderRadius: 10,
              border: '1.5px solid rgba(0,0,0,0.08)',
              fontSize: '0.9rem',
              width: 80,
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
            }}
          />
        </div>
      </div>
    );
  },
};

/* ── Storage (formatted GB) ── */

export const StorageSize: Story = {
  render: () => {
    const [val, setVal] = useState(256);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <JUSlider
          min={16}
          max={1024}
          step={16}
          value={val}
          onChange={(v) => setVal(v as number)}
          formatValue={(v) => v >= 1024 ? `${(v / 1024).toFixed(1)} TB` : `${v} GB`}
          showTooltip="always"
          showMinMax
          variant="default"
          marks={[128, 256, 512, 1024].map((v) => ({
            value: v,
            label: v >= 1024 ? '1 TB' : `${v}`,
          }))}
        />
        <p style={{ fontSize: '0.8rem', color: '#999', margin: 0, textAlign: 'center' }}>
          Selected: <strong>{val >= 1024 ? `${(val / 1024).toFixed(1)} TB` : `${val} GB`}</strong>
        </p>
      </div>
    );
  },
};

/* ── Dark mode ── */

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      style={{
        background: '#0e0e10',
        padding: '3rem 2rem',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <JUSlider defaultValue={40} showTooltip="always" />
      <JUSlider variant="gradient" defaultValue={65} showTooltip="always" />
      <JUSlider
        range
        defaultValue={[25, 75]}
        showTooltip="always"
        showMinMax
        formatValue={(v) => `${v}%`}
      />
    </div>
  ),
};
