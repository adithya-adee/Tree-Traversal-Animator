import { describe, it, expect } from 'vitest';
import BST from '../src/logic/tree';

describe('BST', () => {
  it('inserts and searches values', () => {
    const bst = new BST();
    bst.insert(5);
    bst.insert(3);
    bst.insert(7);
    const ok = bst.search(7);
    expect(ok.found).toBe(true);
    const miss = bst.search(10);
    expect(miss.found).toBe(false);
  });

  it('inorderTraversal returns sorted order for BST', () => {
    const bst = new BST();
    [5, 3, 7, 2, 4, 6, 8].forEach((v) => bst.insert(v));
    const { result } = bst.inorderTraversal();
    expect(result).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });

  it('preorderTraversal returns root-left-right', () => {
    const bst = new BST();
    [5, 3, 7, 2, 4].forEach((v) => bst.insert(v));
    const { result } = bst.preorderTraversal();
    expect(result[0]).toBe(5);
    expect(result).toContain(2);
    expect(result).toContain(4);
  });

  it('postorderTraversal returns left-right-root', () => {
    const bst = new BST();
    [5, 3, 7, 2, 4].forEach((v) => bst.insert(v));
    const { result } = bst.postorderTraversal();
    expect(result[result.length - 1]).toBe(5);
  });

  it('delete removes leaf and restructures tree', () => {
    const bst = new BST();
    [5, 3, 7, 2, 4, 6, 8].forEach((v) => bst.insert(v));
    bst.delete(2);
    const { result } = bst.inorderTraversal();
    expect(result).toEqual([3, 4, 5, 6, 7, 8]);
    expect(bst.search(2).found).toBe(false);
  });
});
