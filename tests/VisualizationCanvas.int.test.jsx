import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BST from '../src/logic/tree';
import VisualizationCanvas from '../src/components/VisualizationCanvas/VisualizationCanvas';

describe('VisualizationCanvas integration', () => {
  it('renders nodes and edges from BST treeData', () => {
    const bst = new BST();
    [5, 3, 7].forEach((v) => bst.insert(v));
    const treeData = bst.getTreeData();

    const ref = { current: document.createElement('div') };
    render(
      <VisualizationCanvas
        treeData={treeData}
        captureRef={ref}
        currentAnimationStep={null}
        currentValue={null}
        statusMessage=""
        statusFeed={[]}
        statusTitle=""
        onClearStatus={null}
      />,
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
