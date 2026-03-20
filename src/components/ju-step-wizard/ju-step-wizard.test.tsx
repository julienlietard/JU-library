import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JUStepWizard } from './ju-step-wizard';
import type { JUStepDef } from './ju-step-wizard';

const STEPS: JUStepDef[] = [
  { id: 'one', label: 'Step 1' },
  { id: 'two', label: 'Step 2' },
  { id: 'three', label: 'Step 3' },
];

const renderWizard = (props: Partial<React.ComponentProps<typeof JUStepWizard>> = {}) =>
  render(
    <JUStepWizard steps={STEPS} {...props}>
      <div>Content 1</div>
      <div>Content 2</div>
      <div>Content 3</div>
    </JUStepWizard>,
  );

describe('JUStepWizard', () => {
  it('renders all step indicators', () => {
    renderWizard();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('shows the first step content by default', () => {
    renderWizard();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('respects defaultActiveStep', () => {
    renderWizard({ defaultActiveStep: 1 });
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('navigates forward on Next click', () => {
    renderWizard();
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('navigates backward on Back click', () => {
    renderWizard({ defaultActiveStep: 1 });
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('disables Back on first step', () => {
    renderWizard();
    expect(screen.getByText('Back').closest('button')).toBeDisabled();
  });

  it('shows Finish on last step', () => {
    renderWizard({ defaultActiveStep: 2 });
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

  it('calls onFinish when Finish is clicked', () => {
    const onFinish = vi.fn();
    renderWizard({ defaultActiveStep: 2, onFinish });
    fireEvent.click(screen.getByText('Finish'));
    expect(onFinish).toHaveBeenCalledOnce();
  });

  it('calls onStepChange when navigating', () => {
    const onStepChange = vi.fn();
    renderWizard({ onStepChange });
    fireEvent.click(screen.getByText('Next'));
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it('supports controlled activeStep', () => {
    const { rerender } = render(
      <JUStepWizard steps={STEPS} activeStep={0}>
        <div>Content 1</div>
        <div>Content 2</div>
        <div>Content 3</div>
      </JUStepWizard>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    rerender(
      <JUStepWizard steps={STEPS} activeStep={2}>
        <div>Content 1</div>
        <div>Content 2</div>
        <div>Content 3</div>
      </JUStepWizard>,
    );
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });

  it('blocks navigation when onStepValidate returns false', async () => {
    const onStepValidate = vi.fn().mockResolvedValue(false);
    renderWizard({ onStepValidate });
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  it('advances when onStepValidate returns true', async () => {
    const onStepValidate = vi.fn().mockResolvedValue(true);
    renderWizard({ onStepValidate });
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  it('hides nav when hideNav is true', () => {
    renderWizard({ hideNav: true });
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('shows progress bar when showProgressBar is true', () => {
    const { container } = renderWizard({ showProgressBar: true });
    expect(container.querySelector('.jusw-progress')).toBeInTheDocument();
  });

  it('does not show progress bar by default', () => {
    const { container } = renderWizard();
    expect(container.querySelector('.jusw-progress')).not.toBeInTheDocument();
  });

  it('applies compact variant class', () => {
    const { container } = renderWizard({ variant: 'compact' });
    expect(container.querySelector('.jusw--compact')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = renderWizard({ size: 'lg' });
    expect(container.querySelector('.jusw--lg')).toBeInTheDocument();
  });

  it('uses custom button labels', () => {
    renderWizard({ prevLabel: 'Retour', nextLabel: 'Suivant' });
    expect(screen.getByText('Retour')).toBeInTheDocument();
    expect(screen.getByText('Suivant')).toBeInTheDocument();
  });

  it('uses custom finish label', () => {
    renderWizard({ defaultActiveStep: 2, finishLabel: 'Terminer' });
    expect(screen.getByText('Terminer')).toBeInTheDocument();
  });

  it('renders step descriptions in horizontal variant', () => {
    renderWizard({
      steps: [{ id: 'a', label: 'A', description: 'Desc A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }],
    });
    expect(screen.getByText('Desc A')).toBeInTheDocument();
  });

  it('renders optional badge', () => {
    renderWizard({
      steps: [{ id: 'a', label: 'A', optional: true }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }],
    });
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });
});
