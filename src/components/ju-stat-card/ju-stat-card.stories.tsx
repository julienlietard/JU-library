import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JUStatCard } from './ju-stat-card';
import { DollarSign, Users, TrendingUp, ShoppingCart, Percent, Eye, Activity, Zap } from 'lucide-react';

const meta: Meta<typeof JUStatCard> = {
  title: 'Molecules/JUStatCard',
  component: JUStatCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'gradient'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    animated: { control: 'boolean' },
  },
  args: {
    value: 12480,
    label: 'Total Users',
    variant: 'default',
    size: 'md',
    animated: true,
  },
};
export default meta;
type Story = StoryObj<typeof JUStatCard>;

/* ============================================
   DEFAULT
   ============================================ */
export const Default: Story = {
  args: {
    value: 12480,
    label: 'Total Users',
    icon: <Users size={20} />,
    previousValue: 11200,
  },
};

/* ============================================
   WITH SPARKLINE
   ============================================ */
export const WithSparkline: Story = {
  name: 'With Sparkline',
  args: {
    value: 8420,
    label: 'Page Views',
    icon: <Eye size={20} />,
    previousValue: 7100,
    sparklineData: [20, 35, 28, 45, 38, 52, 48, 60, 55, 72, 68, 84],
  },
};

/* ============================================
   ALL SIZES
   ============================================ */
export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap', padding: '2rem' }}>
      <JUStatCard
        size="sm"
        value={1234}
        label="Small"
        icon={<Zap size={16} />}
        previousValue={1100}
      />
      <JUStatCard
        size="md"
        value={5678}
        label="Medium"
        icon={<Activity size={20} />}
        previousValue={5200}
        sparklineData={[10, 25, 18, 30, 22, 35, 40]}
      />
      <JUStatCard
        size="lg"
        value={98765}
        label="Large — Hero Stat"
        icon={<TrendingUp size={24} />}
        previousValue={87000}
        sparklineData={[40, 55, 48, 62, 58, 70, 65, 80, 75, 90]}
      />
    </div>
  ),
};

/* ============================================
   REVENUE (formatted €)
   ============================================ */
export const Revenue: Story = {
  name: 'Revenue (€)',
  args: {
    value: 142580,
    label: 'Revenue',
    subtitle: 'This quarter',
    icon: <DollarSign size={20} />,
    iconColor: '#22c55e',
    previousValue: 128900,
    formatValue: (v: number) =>
      new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v),
    sparklineData: [80, 95, 88, 110, 102, 125, 118, 135, 130, 142],
  },
};

/* ============================================
   PERCENTAGE
   ============================================ */
export const Percentage: Story = {
  args: {
    value: 73.5,
    label: 'Conversion Rate',
    icon: <Percent size={20} />,
    iconColor: '#a855f7',
    formatValue: (v: number) => `${v.toFixed(1)}%`,
    trend: { value: 5.2, label: 'vs last week' },
  },
};

/* ============================================
   NEGATIVE TREND
   ============================================ */
export const NegativeTrend: Story = {
  name: 'Negative Trend',
  args: {
    value: 342,
    label: 'Open Issues',
    icon: <Activity size={20} />,
    iconColor: '#ef4444',
    previousValue: 298,
    sparklineData: [20, 25, 22, 30, 28, 35, 32, 38, 34, 42],
  },
};

/* ============================================
   GLASS VARIANT
   ============================================ */
export const GlassVariant: Story = {
  name: 'Glass Variant',
  render: () => (
    <div style={{
      padding: '3rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 24,
    }}>
      <JUStatCard
        variant="glass"
        value={9841}
        label="Active Sessions"
        icon={<Users size={20} />}
        previousValue={8500}
        sparklineData={[50, 60, 55, 70, 65, 78, 72, 85, 80, 98]}
      />
    </div>
  ),
};

/* ============================================
   DASHBOARD (grid of 4)
   ============================================ */
export const Dashboard: Story = {
  name: 'Dashboard Grid',
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      padding: '2rem',
      maxWidth: 960,
    }}>
      <JUStatCard
        value={142580}
        label="Revenue"
        subtitle="This month"
        icon={<DollarSign size={20} />}
        iconColor="#22c55e"
        previousValue={128900}
        formatValue={(v) => `€${(v / 1000).toFixed(1)}K`}
        sparklineData={[80, 95, 88, 110, 102, 125, 118, 135, 130, 142]}
      />
      <JUStatCard
        value={12480}
        label="Users"
        subtitle="Total active"
        icon={<Users size={20} />}
        iconColor="#3b82f6"
        previousValue={11200}
        sparklineData={[60, 68, 72, 78, 82, 90, 95, 100, 110, 124]}
      />
      <JUStatCard
        value={3847}
        label="Orders"
        subtitle="Last 30 days"
        icon={<ShoppingCart size={20} />}
        iconColor="#f59e0b"
        previousValue={4100}
        sparklineData={[50, 48, 52, 45, 42, 44, 40, 38, 42, 38]}
      />
      <JUStatCard
        value={73.5}
        label="Conversion"
        subtitle="Checkout rate"
        icon={<TrendingUp size={20} />}
        iconColor="#a855f7"
        previousValue={68.2}
        formatValue={(v) => `${v.toFixed(1)}%`}
        sparklineData={[55, 58, 60, 62, 65, 68, 66, 70, 72, 73]}
      />
    </div>
  ),
};

/* ============================================
   ANIMATED (changing value)
   ============================================ */
export const Animated: Story = {
  name: 'Animated (Changing Value)',
  render: () => {
    const AnimatedDemo = () => {
      const [val, setVal] = useState(5000);
      useEffect(() => {
        const id = setInterval(() => {
          setVal((v) => v + Math.floor(Math.random() * 500) - 100);
        }, 2500);
        return () => clearInterval(id);
      }, []);
      return (
        <div style={{ padding: '2rem' }}>
          <p style={{ marginBottom: 16, color: '#6b7280', fontSize: 14 }}>
            Value changes every 2.5s — watch the count-up animation
          </p>
          <JUStatCard
            value={val}
            label="Live Metric"
            icon={<Activity size={20} />}
            sparklineData={[30, 45, 38, 52, 48, 60, 55, 68, 62, val / 100]}
            trend={{ value: 12.3, label: 'vs yesterday' }}
          />
        </div>
      );
    };
    return <AnimatedDemo />;
  },
};

/* ============================================
   DARK MODE
   ============================================ */
export const DarkMode: Story = {
  name: 'Dark Mode',
  render: () => (
    <div
      data-theme="dark"
      style={{
        padding: '2rem',
        background: '#111',
        borderRadius: 24,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}
    >
      <JUStatCard
        value={42580}
        label="Revenue"
        icon={<DollarSign size={20} />}
        iconColor="#22c55e"
        previousValue={38200}
        formatValue={(v) => `€${(v / 1000).toFixed(1)}K`}
        sparklineData={[30, 42, 38, 50, 45, 55, 52, 60, 58, 65]}
      />
      <JUStatCard
        variant="glass"
        value={8741}
        label="Active Users"
        icon={<Users size={20} />}
        previousValue={7900}
        sparklineData={[40, 48, 52, 55, 60, 65, 68, 72, 78, 87]}
      />
      <JUStatCard
        variant="gradient"
        value={94.2}
        label="Uptime"
        icon={<Zap size={20} />}
        iconColor="#f59e0b"
        formatValue={(v) => `${v.toFixed(1)}%`}
        trend={{ value: 0.3, label: 'vs last month' }}
      />
    </div>
  ),
};
