import { describe, it, expect } from 'vitest';
import BST from '../src/logic/tree';
import {
  generateSearchAnimation,
  generateTraversalAnimation,
  validateAnimationStep,
} from '../src/logic/animations';

describe('animations integration', () => {
  it('generates search animations with found status', () => {
    const bst = new BST();
    [5, 3, 7].forEach((v) => bst.insert(v));
    const steps = generateSearchAnimation(bst, 7);
    expect(steps.some((s) => s.type === 'update-status')).toBe(true);
  });

  it('validates traversal animation steps', () => {
    const bst = new BST();
    [5, 3, 7].forEach((v) => bst.insert(v));
    const { animations } = generateTraversalAnimation(bst, 'inorder');
    const first = validateAnimationStep(animations[0]);
    expect(first.valid).toBe(true);
  });
});
