import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from '../src/components/ControlPanel/ControlPanel';

describe('ControlPanel integration', () => {
  const baseProps = () => ({
    isAnimating: false,
    treeType: 'BST',
    onTreeTypeChange: vi.fn(),
    onInsert: vi.fn(),
    onDelete: vi.fn(),
    onSearch: vi.fn(),
    onTraverse: vi.fn(),
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onClear: vi.fn(),
    onStopAndReset: vi.fn(),
    onSpeedChange: vi.fn(),
    onExportGif: vi.fn(),
    onExportImage: vi.fn(),
    isTraversing: false,
    traversalCompleted: false,
    undoDisabled: false,
    redoDisabled: false,
    speed: 1000,
  });

  it('submits insert/delete/search with entered values', () => {
    const props = baseProps();
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<ControlPanel {...props} />);

    fireEvent.change(screen.getByPlaceholderText(/Value to insert/i), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: /insert/i }));
    expect(props.onInsert).toHaveBeenCalledWith('5');

    fireEvent.change(screen.getByPlaceholderText(/Value to delete/i), {
      target: { value: '3' },
    });
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(props.onDelete).toHaveBeenCalledWith('3');

    fireEvent.change(screen.getByPlaceholderText(/Value to search/i), {
      target: { value: '7' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(props.onSearch).toHaveBeenCalledWith('7');
  });

  it('disables buttons when animating', () => {
    const props = baseProps();
    props.isAnimating = true;
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<ControlPanel {...props} />);
    const inserts = screen.getAllByRole('button', { name: /insert/i });
    const preorders = screen.getAllByRole('button', { name: /preorder/i });
    expect(inserts.some((b) => b.disabled)).toBe(true);
    expect(preorders.some((b) => b.disabled)).toBe(true);
  });

  it('speed slider is associated with label', () => {
    const props = baseProps();
    // eslint-disable-next-line react/jsx-props-no-spreading
    render(<ControlPanel {...props} />);
    const sliders = screen.getAllByLabelText(/Animation Speed/i);
    expect(sliders.length).toBeGreaterThan(0);
  });
});
