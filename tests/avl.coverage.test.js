/**
 * AVL Tree Coverage Tests (Simplified)
 * 
 * Focuses on testing actual AVL tree API methods that exist
 * and ensuring high code coverage for core functionality
 */

import {
  describe, it, expect, beforeEach,
} from 'vitest';
import AVLTree from '../src/logic/avl';

describe('AVL Tree - Coverage Tests', () => {
  let tree;

  beforeEach(() => {
    tree = new AVLTree();
  });

  describe('Insert Operations', () => {
    it('should insert into empty tree', () => {
      const result = tree.insert(10);
      expect(result.tree.root).toBeTruthy();
      expect(result.tree.root.value).toBe(10);
      expect(result.animations).toBeDefined();
      expect(result.animations.length).toBeGreaterThan(0);
    });

    it('should insert multiple values', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      expect(tree.root.value).toBe(10);
    });

    it('should trigger LL rotation', () => {
      tree.insert(30);
      tree.insert(20);
      tree.insert(10);
      
      expect(tree.root.value).toBe(20);
      expect(tree.root.left.value).toBe(10);
      expect(tree.root.right.value).toBe(30);
    });

    it('should trigger RR rotation', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(30);
      
      expect(tree.root.value).toBe(20);
      expect(tree.root.left.value).toBe(10);
      expect(tree.root.right.value).toBe(30);
    });

    it('should trigger LR rotation', () => {
      tree.insert(30);
      tree.insert(10);
      tree.insert(20);
      
      expect(tree.root.value).toBe(20);
      expect(tree.root.left.value).toBe(10);
      expect(tree.root.right.value).toBe(30);
    });

    it('should trigger RL rotation', () => {
      tree.insert(10);
      tree.insert(30);
      tree.insert(20);
      
      expect(tree.root.value).toBe(20);
      expect(tree.root.left.value).toBe(10);
      expect(tree.root.right.value).toBe(30);
    });

    it('should handle inserting many values with rotations', () => {
      const values = [50, 25, 75, 10, 30, 60, 80, 5, 15];
      values.forEach((v) => tree.insert(v));
      
      expect(tree.root).toBeTruthy();
      expect(tree.getHeight(tree.root)).toBeGreaterThan(0);
    });
  });

  describe('Delete Operations', () => {
    it('should delete from tree', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.delete(5);
      expect(result.animations).toBeDefined();
    });

    it('should handle deleting root', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      tree.delete(10);
      expect(tree.root).toBeTruthy();
    });

    it('should handle delete from empty tree', () => {
      const result = tree.delete(10);
      expect(result.tree.root).toBeNull();
    });
  });

  describe('Search Operations', () => {
    it('should search in tree', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.search(10);
      expect(result.animations).toBeDefined();
      expect(result.animations.length).toBeGreaterThan(0);
    });

    it('should search in empty tree', () => {
      const result = tree.search(10);
      expect(result.animations).toBeDefined();
    });
  });

  describe('Traversal Operations', () => {
    it('should perform inorder traversal', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.inorderTraversal();
      expect(result.result).toEqual([5, 10, 15]);
      expect(result.animations).toBeDefined();
    });

    it('should perform preorder traversal', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.preorderTraversal();
      expect(result.result).toContain(10);
      expect(result.result).toContain(5);
      expect(result.result).toContain(15);
    });

    it('should perform postorder traversal', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.postorderTraversal();
      expect(result.result.length).toBe(3);
    });

    it('should handle traversal on empty tree', () => {
      const inorder = tree.inorderTraversal();
      expect(inorder.result).toEqual([]);
    });
  });

  describe('Tree Properties', () => {
    it('should calculate height', () => {
      expect(tree.getHeight(tree.root)).toBe(0);
      
      tree.insert(10);
      expect(tree.getHeight(tree.root)).toBeGreaterThan(0);
    });

    it('should calculate balance factor', () => {
      tree.insert(10);
      const balanceFactor = tree.getBalanceFactor(tree.root);
      expect(balanceFactor).toBeDefined();
      expect(typeof balanceFactor).toBe('number');
    });

    it('should maintain AVL property after operations', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      values.forEach((v) => tree.insert(v));
      
      // AVL height should be log(n)
      const height = tree.getHeight(tree.root);
      expect(height).toBeLessThanOrEqual(Math.ceil(1.44 * Math.log2(values.length + 1)));
    });
  });

  describe('Tree Utilities', () => {
    it('should get tree data', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const data = tree.getTreeData();
      expect(data).toBeDefined();
      expect(data.nodes).toBeDefined();
      expect(data.edges).toBeDefined();
    });

    it('should clone tree', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const cloned = tree.safeClone();
      expect(cloned.root).toBeTruthy();
      expect(cloned.root.value).toBe(tree.root.value);
    });

    it('should clone empty tree', () => {
      const cloned = tree.safeClone();
      expect(cloned.root).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle large tree', () => {
      const values = Array.from({ length: 50 }, (_, i) => i);
      values.forEach((v) => tree.insert(v));
      
      expect(tree.root).toBeTruthy();
      expect(tree.getHeight(tree.root)).toBeGreaterThan(0);
    });

    it('should handle inserting in sorted order', () => {
      [1, 2, 3, 4, 5, 6, 7].forEach((v) => tree.insert(v));
      
      // Tree should remain balanced
      const height = tree.getHeight(tree.root);
      expect(height).toBeLessThanOrEqual(4);
    });

    it('should handle inserting in reverse order', () => {
      [7, 6, 5, 4, 3, 2, 1].forEach((v) => tree.insert(v));
      
      // Tree should remain balanced
      const height = tree.getHeight(tree.root);
      expect(height).toBeLessThanOrEqual(4);
    });

    it('should handle repeated insert-delete cycles', () => {
      for (let i = 0; i < 5; i += 1) {
        tree.insert(10);
        tree.delete(10);
      }
      
      expect(tree.root).toBeNull();
    });
  });
});