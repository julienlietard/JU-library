import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUBadge } from './ju-badge';
import {
  Star, FileCheck, Feather, MousePointerClick,
  Zap, Shield, Bell, Heart, Flame, Crown, Sparkles,
  CheckCircle, AlertTriangle, Info, X, Tag, Globe, Cpu, Lock
} from 'lucide-react';

const meta: Meta<typeof JUBadge> = {
  title: 'Atoms/JUBadge',
  component: JUBadge,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'green', 'blue', 'purple', 'orange', 'red', 'pink', 'yellow', 'cyan'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['soft', 'solid', 'outline', 'ghost'],
    },
    effect: {
      control: 'select',
      options: ['none', 'glow', 'pulse', 'shine', 'float'],
    },
  },
  args: {
    label: 'Badge',
    color: 'blue',
    size: 'md',
    variant: 'soft',
    effect: 'none',
  },
};
export default meta;
type Story = StoryObj<typeof JUBadge>;

/* ============================================
   PLAYGROUND
   ============================================ */
export const Playground: Story = {};

/* ============================================
   AS DESIGN — Reproduit le design de référence
   ============================================ */
export const AsDesign: Story = {
  name: '✦ Design Reference',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, padding: '2.5rem' }}>
      <JUBadge
        label="Brand & Style Guide"
        color="blue"
        size="xl"
        iconBg
        icon={<Star size={18} fill="currentColor" strokeWidth={0} />}
      />
      <JUBadge
        label="Compliance & Legal"
        color="green"
        size="xl"
        iconBg
        icon={<FileCheck size={18} strokeWidth={2} />}
      />
      <JUBadge
        label="Content Safety"
        color="purple"
        size="xl"
        iconBg
        icon={<Feather size={18} strokeWidth={2} />}
      />
      <JUBadge
        label="Approval Trigger"
        color="default"
        size="xl"
        iconBg
        icon={<MousePointerClick size={18} strokeWidth={2} />}
      />
      <JUBadge
        label="AI Powered"
        color="cyan"
        size="xl"
        iconBg
        icon={<Cpu size={18} strokeWidth={2} />}
      />
      <JUBadge
        label="Premium Access"
        color="yellow"
        size="xl"
        iconBg
        icon={<Crown size={18} strokeWidth={2} />}
      />
    </div>
  ),
};

/* ============================================
   ALL COLORS
   ============================================ */
export const AllColors: Story = {
  name: 'Colors',
  render: () => {
    const colors = ['default', 'blue', 'green', 'purple', 'orange', 'red', 'pink', 'yellow', 'cyan'] as const;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '1rem' }}>
        {colors.map((c) => (
          <JUBadge key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} color={c} dot />
        ))}
      </div>
    );
  },
};

/* ============================================
   ALL SIZES
   ============================================ */
export const AllSizes: Story = {
  name: 'Sizes',
  render: () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '1rem' }}>
        {sizes.map((s) => (
          <JUBadge key={s} label={s.toUpperCase()} color="blue" size={s} icon={<Tag size={s === 'xs' ? 10 : s === 'sm' ? 12 : s === 'md' ? 14 : s === 'lg' ? 16 : 18} />} />
        ))}
      </div>
    );
  },
};

/* ============================================
   VARIANTS — soft, solid, outline, ghost
   ============================================ */
export const Variants: Story = {
  name: 'Variants',
  render: () => {
    const variants = ['soft', 'solid', 'outline', 'ghost'] as const;
    const colors = ['blue', 'green', 'purple', 'orange', 'red'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '1rem' }}>
        {variants.map((v) => (
          <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>{v}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {colors.map((c) => (
                <JUBadge key={`${v}-${c}`} label={c.charAt(0).toUpperCase() + c.slice(1)} color={c} variant={v} icon={<Sparkles size={14} />} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* ============================================
   ICON BACKGROUNDS — cercle coloré comme le design
   ============================================ */
export const IconBackgrounds: Story = {
  name: 'Icon Backgrounds',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <JUBadge label="Performance" color="blue" iconBg icon={<Zap size={14} />} />
        <JUBadge label="Security" color="green" iconBg icon={<Shield size={14} />} />
        <JUBadge label="Notifications" color="orange" iconBg icon={<Bell size={14} />} />
        <JUBadge label="Favorites" color="pink" iconBg icon={<Heart size={14} fill="currentColor" />} />
        <JUBadge label="Trending" color="red" iconBg icon={<Flame size={14} />} />
        <JUBadge label="Premium" color="yellow" iconBg icon={<Crown size={14} />} />
        <JUBadge label="Global" color="cyan" iconBg icon={<Globe size={14} />} />
        <JUBadge label="AI Model" color="purple" iconBg icon={<Cpu size={14} />} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <JUBadge label="Performance" color="blue" variant="solid" iconBg icon={<Zap size={14} />} />
        <JUBadge label="Security" color="green" variant="solid" iconBg icon={<Shield size={14} />} />
        <JUBadge label="Premium" color="yellow" variant="solid" iconBg icon={<Crown size={14} />} />
        <JUBadge label="AI Model" color="purple" variant="solid" iconBg icon={<Cpu size={14} />} />
      </div>
    </div>
  ),
};

/* ============================================
   EFFECTS — glow, pulse, shine, float
   ============================================ */
export const Effects: Story = {
  name: 'Effects',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Glow (hover)</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <JUBadge label="Blue Glow" color="blue" effect="glow" icon={<Sparkles size={14} />} />
          <JUBadge label="Purple Glow" color="purple" effect="glow" variant="solid" icon={<Sparkles size={14} />} />
          <JUBadge label="Green Glow" color="green" effect="glow" icon={<Sparkles size={14} />} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Pulse</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <JUBadge label="Live" color="red" effect="pulse" dot icon={<Flame size={14} />} />
          <JUBadge label="Recording" color="orange" effect="pulse" variant="solid" />
          <JUBadge label="Active" color="green" effect="pulse" dot />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Shine (hover)</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <JUBadge label="New Feature" color="blue" effect="shine" variant="solid" icon={<Zap size={14} />} />
          <JUBadge label="Premium" color="yellow" effect="shine" variant="solid" icon={<Crown size={14} />} />
          <JUBadge label="Pro" color="purple" effect="shine" variant="solid" icon={<Sparkles size={14} />} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Float</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <JUBadge label="Floating" color="cyan" effect="float" icon={<Sparkles size={14} />} />
          <JUBadge label="Hovering" color="purple" effect="float" variant="solid" />
          <JUBadge label="Magic" color="pink" effect="float" iconBg icon={<Heart size={14} fill="currentColor" />} />
        </div>
      </div>
    </div>
  ),
};

/* ============================================
   PILL SHAPE
   ============================================ */
export const Pill: Story = {
  name: 'Pill Shape',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '1rem' }}>
      <JUBadge label="Status" color="green" pill dot />
      <JUBadge label="v2.4.1" color="blue" pill icon={<Tag size={12} />} />
      <JUBadge label="Beta" color="orange" pill variant="solid" />
      <JUBadge label="Archived" color="default" pill variant="outline" />
      <JUBadge label="New" color="purple" pill size="xs" />
      <JUBadge label="Secured" color="green" pill variant="solid" icon={<Lock size={12} />} />
    </div>
  ),
};

/* ============================================
   REMOVABLE
   ============================================ */
export const Removable: Story = {
  name: 'Removable',
  render: () => {
    const RemovableDemo = () => {
      const initialTags = ['React', 'TypeScript', 'Storybook', 'Vitest', 'CSS Modules'];
      const [tags, setTags] = useState(initialTags);
      const colors = ['blue', 'purple', 'green', 'orange', 'cyan'] as const;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tags.map((tag, i) => (
              <JUBadge
                key={tag}
                label={tag}
                color={colors[i % colors.length]}
                removable
                onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
              />
            ))}
          </div>
          {tags.length < initialTags.length && (
            <button
              onClick={() => setTags(initialTags)}
              style={{
                alignSelf: 'flex-start', padding: '6px 12px', borderRadius: 8,
                border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer',
                fontSize: '0.75rem', color: '#64748b',
              }}
            >
              Reset tags
            </button>
          )}
        </div>
      );
    };
    return <RemovableDemo />;
  },
};

/* ============================================
   CLICKABLE
   ============================================ */
export const Clickable: Story = {
  name: 'Clickable',
  render: () => {
    const ClickableDemo = () => {
      const [selected, setSelected] = useState<string[]>([]);
      const options = [
        { label: 'Design', color: 'blue' as const, icon: <Sparkles size={14} /> },
        { label: 'Engineering', color: 'green' as const, icon: <Cpu size={14} /> },
        { label: 'Marketing', color: 'orange' as const, icon: <Flame size={14} /> },
        { label: 'Security', color: 'red' as const, icon: <Shield size={14} /> },
        { label: 'Analytics', color: 'purple' as const, icon: <Zap size={14} /> },
      ];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click to toggle selection</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {options.map((opt) => {
              const isSelected = selected.includes(opt.label);
              return (
                <JUBadge
                  key={opt.label}
                  label={opt.label}
                  color={opt.color}
                  icon={opt.icon}
                  variant={isSelected ? 'solid' : 'outline'}
                  clickable
                  onClick={() =>
                    setSelected((prev) =>
                      isSelected ? prev.filter((s) => s !== opt.label) : [...prev, opt.label]
                    )
                  }
                />
              );
            })}
          </div>
          {selected.length > 0 && (
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Selected: {selected.join(', ')}
            </span>
          )}
        </div>
      );
    };
    return <ClickableDemo />;
  },
};

/* ============================================
   STATUS BADGES — real world use case
   ============================================ */
export const StatusBadges: Story = {
  name: 'Use Case: Status',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '1rem' }}>
      <JUBadge label="Success" color="green" variant="soft" dot icon={<CheckCircle size={14} />} />
      <JUBadge label="Warning" color="yellow" variant="soft" dot icon={<AlertTriangle size={14} />} />
      <JUBadge label="Error" color="red" variant="soft" dot icon={<X size={14} />} />
      <JUBadge label="Info" color="blue" variant="soft" dot icon={<Info size={14} />} />
      <JUBadge label="Pending" color="orange" variant="outline" dot />
      <JUBadge label="Archived" color="default" variant="outline" />
    </div>
  ),
};

/* ============================================
   GLASS VARIANT
   ============================================ */
export const Glass: Story = {
  name: 'Glass',
  render: () => (
    <div
      style={{
        padding: '2rem',
        borderRadius: 20,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
      }}
    >
      <JUBadge label="Glass Default" glass icon={<Sparkles size={14} />} />
      <JUBadge label="Glass Pill" glass pill icon={<Globe size={14} />} />
      <JUBadge label="Glass Removable" glass removable />
    </div>
  ),
};

/* ============================================
   KITCHEN SINK — everything together
   ============================================ */
export const KitchenSink: Story = {
  name: 'Kitchen Sink',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '2rem', maxWidth: 600 }}>
      {/* Row 1: Design ref */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <JUBadge label="Brand Guide" color="blue" iconBg icon={<Star size={14} fill="currentColor" strokeWidth={0} />} />
        <JUBadge label="Compliance" color="green" iconBg icon={<FileCheck size={14} />} />
        <JUBadge label="Safety" color="purple" iconBg icon={<Feather size={14} />} />
        <JUBadge label="Approval" color="default" iconBg icon={<MousePointerClick size={14} />} />
      </div>
      {/* Row 2: Solid pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <JUBadge label="Pro" color="purple" variant="solid" pill effect="shine" icon={<Crown size={12} />} />
        <JUBadge label="New" color="blue" variant="solid" pill size="xs" />
        <JUBadge label="Live" color="red" variant="solid" pill dot effect="pulse" size="sm" />
        <JUBadge label="Beta" color="orange" variant="solid" pill size="sm" />
      </div>
      {/* Row 3: Outline */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <JUBadge label="v3.2.0" color="blue" variant="outline" pill icon={<Tag size={12} />} />
        <JUBadge label="TypeScript" color="cyan" variant="outline" />
        <JUBadge label="MIT License" color="green" variant="outline" icon={<Lock size={12} />} />
      </div>
      {/* Row 4: Mixed */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <JUBadge label="React" color="blue" removable />
        <JUBadge label="Vue" color="green" removable />
        <JUBadge label="Svelte" color="orange" removable />
        <JUBadge label="+ Add" color="default" variant="ghost" clickable />
      </div>
    </div>
  ),
};
