/**
 * Red-Black Tree Coverage Tests (Simplified)
 * 
 * Focuses on testing actual Red-Black tree API methods
 * and ensuring color properties are maintained
 */

import {
  describe, it, expect, beforeEach,
} from 'vitest';
import RedBlackTree from '../src/logic/redBlackTree';

describe('Red-Black Tree - Coverage Tests', () => {
  let tree;

  beforeEach(() => {
    tree = new RedBlackTree();
  });

  describe('Insert Operations', () => {
    it('should insert into empty tree with black root', () => {
      const result = tree.insert(10);
      expect(result.tree.root).toBeTruthy();
      expect(result.tree.root.value).toBe(10);
      expect(result.tree.root.color).toBe('black');
      expect(result.animations).toBeDefined();
    });

    it('should insert multiple values maintaining color properties', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      expect(tree.root.value).toBe(10);
      expect(tree.root.color).toBe('black');
    });

    it('should handle rebalancing after insertion', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(30);
      
      expect(tree.root.color).toBe('black');
    });

    it('should handle left-left case', () => {
      tree.insert(30);
      tree.insert(20);
      tree.insert(10);
      
      expect(tree.root.color).toBe('black');
    });

    it('should handle left-right case', () => {
      tree.insert(30);
      tree.insert(10);
      const result = tree.insert(20);
      
      expect(result.tree.root.color).toBe('black');
    });

    it('should handle right-right case', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(30);
      
      expect(tree.root.color).toBe('black');
    });

    it('should handle right-left case', () => {
      tree.insert(10);
      tree.insert(30);
      tree.insert(20);
      
      expect(tree.root.color).toBe('black');
    });

    it('should maintain properties with many insertions', () => {
      const values = [10, 20, 30, 15, 25, 5, 1];
      values.forEach((v) => tree.insert(v));
      
      expect(tree.root.color).toBe('black');
    });
  });

  describe('Delete Operations', () => {
    it('should delete from tree', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.delete(5);
      expect(result.animations).toBeDefined();
      expect(result.tree.root.color).toBe('black');
    });

    it('should handle deleting root', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      tree.delete(10);
      expect(tree.root).toBeTruthy();
      expect(tree.root.color).toBe('black');
    });

    it('should handle delete from empty tree', () => {
      const result = tree.delete(10);
      expect(result.tree.root).toBeNull();
    });

    it('should maintain color properties after deletion', () => {
      [10, 5, 15, 3, 7, 12, 20].forEach((v) => tree.insert(v));
      tree.delete(3);
      
      expect(tree.root.color).toBe('black');
    });
  });

  describe('Search Operations', () => {
    it('should search in tree', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.search(10);
      expect(result.animations).toBeDefined();
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
      expect(result.result.length).toBe(3);
    });

    it('should perform postorder traversal', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const result = tree.postorderTraversal();
      expect(result.result.length).toBe(3);
    });

    it('should handle traversal on empty tree', () => {
      const result = tree.inorderTraversal();
      expect(result.result).toEqual([]);
    });
  });

  describe('Color Properties', () => {
    it('should ensure root is always black', () => {
      tree.insert(10);
      expect(tree.root.color).toBe('black');
      
      tree.insert(5);
      expect(tree.root.color).toBe('black');
      
      tree.insert(15);
      expect(tree.root.color).toBe('black');
    });

    it('should verify no consecutive red nodes', () => {
      const values = [10, 5, 15, 3, 7, 12, 20];
      values.forEach((v) => tree.insert(v));
      
      // Helper to check property
      const hasNoConsecutiveRed = (node) => {
        if (!node) return true;
        
        if (node.color === 'red') {
          if (node.left && node.left.color === 'red') return false;
          if (node.right && node.right.color === 'red') return false;
        }
        
        return hasNoConsecutiveRed(node.left) && hasNoConsecutiveRed(node.right);
      };
      
      expect(hasNoConsecutiveRed(tree.root)).toBe(true);
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

    it('should clone tree with colors', () => {
      tree.insert(10);
      tree.insert(5);
      tree.insert(15);
      
      const cloned = tree.safeClone();
      expect(cloned.root).toBeTruthy();
      expect(cloned.root.value).toBe(tree.root.value);
      expect(cloned.root.color).toBe(tree.root.color);
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
      expect(tree.root.color).toBe('black');
    });

    it('should handle inserting in sorted order', () => {
      [1, 2, 3, 4, 5, 6, 7].forEach((v) => tree.insert(v));
      
      expect(tree.root.color).toBe('black');
      
      const inorder = tree.inorderTraversal();
      expect(inorder.result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should handle inserting in reverse order', () => {
      [7, 6, 5, 4, 3, 2, 1].forEach((v) => tree.insert(v));
      
      expect(tree.root.color).toBe('black');
    });

    it('should handle repeated operations', () => {
      for (let i = 0; i < 5; i += 1) {
        tree.insert(10);
        tree.delete(10);
      }
      
      expect(tree.root).toBeNull();
    });

    it('should maintain properties during complex operations', () => {
      const operations = [
        { op: 'insert', val: 50 },
        { op: 'insert', val: 25 },
        { op: 'insert', val: 75 },
        { op: 'delete', val: 25 },
        { op: 'insert', val: 30 },
        { op: 'delete', val: 50 },
      ];

      operations.forEach(({ op, val }) => {
        if (op === 'insert') {
          tree.insert(val);
        } else {
          tree.delete(val);
        }
      });

      if (tree.root) {
        expect(tree.root.color).toBe('black');
      }
    });
  });

  describe('Animation Generation', () => {
    it('should generate animations for insert', () => {
      const result = tree.insert(10);
      expect(result.animations.length).toBeGreaterThan(0);
    });

    it('should generate animations for delete', () => {
      tree.insert(10);
      tree.insert(5);
      const result = tree.delete(5);
      expect(result.animations.length).toBeGreaterThan(0);
    });

    it('should generate animations for search', () => {
      tree.insert(10);
      const result = tree.search(10);
      expect(result.animations.length).toBeGreaterThan(0);
    });

    it('should generate animations for traversal', () => {
      tree.insert(10);
      tree.insert(5);
      const result = tree.inorderTraversal();
      expect(result.animations.length).toBeGreaterThan(0);
    });
  });
});