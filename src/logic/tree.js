import Node from './node.js';

/**
 * Binary Search Tree Implementation
 *
 * This class handles all BST operations including insert, delete, search, and traversals.
 * It also manages tree visualization by calculating node positions and generating animation data.
 */
export default class BST {
  constructor() {
    this.root = null;
    this.nodeIdCounter = 0; // Keeps track of unique IDs for each node
  }

  // Generate unique IDs for nodes - needed for React rendering
  generateId() {
    const id = `node-${this.nodeIdCounter}`;
    this.nodeIdCounter += 1;
    return id;
  }

  /**
   * Main function to get all tree data for visualization
   * Calculates positions for each node and returns nodes + edges arrays
   */
  getTreeData() {
    const nodes = [];
    const edges = [];

    if (this.root) {
      // First calculate where each node should be positioned on canvas
      this._calculateTreeLayout();
      // Then collect all nodes and edges into arrays for rendering
      this._collectTreeData(this.root, nodes, edges);
    }

    return { nodes, edges };
  }

  /**
   * Calculates positions for all nodes in the tree
   *
   * This was tricky to implement! The algorithm:
   * 1. Position root at center-top
   * 2. Recursively position all children
   * 3. Calculate if tree overflows canvas
   * 4. Scale down everything if needed to fit
   *
   * Key challenge: Keeping root fixed while scaling children around it
   */
  _calculateTreeLayout() {
    if (!this.root) return;

    const treeInfo = this._getTreeInfo(this.root);

    // Canvas dimensions - tuned to fit most screens
    const canvasWidth = 1400;
    const canvasHeight = 700;
    const paddingX = 60; // Space from edges
    const paddingY = 60;

    // Root stays fixed at center-top - never moves even when scaling
    const rootX = canvasWidth / 2;
    const rootY = 100;

    this.root.x = rootX;
    this.root.y = rootY;

    // Position all nodes relative to root
    this._positionSubtree(
      this.root,
      rootX,
      rootY,
      treeInfo.maxWidth,
      treeInfo.maxHeight,
    );

    // Now check if tree fits within canvas bounds
    const bounds = this._getTreeBounds(this.root);

    // Calculate how far the tree extends from root in each direction
    const leftExtent = rootX - bounds.minX; // Distance to leftmost node
    const rightExtent = bounds.maxX - rootX; // Distance to rightmost node
    const bottomExtent = bounds.maxY - rootY; // Distance to bottom

    // Calculate available space in each direction (accounting for padding)
    const availableLeft = rootX - paddingX;
    const availableRight = canvasWidth - rootX - paddingX;
    const availableBottom = canvasHeight - rootY - paddingY;

    // Determine scale factors needed to fit tree
    let scaleX = 1.0;
    let scaleY = 1.0;

    // Check if left side overflows - if yes, scale it down
    if (leftExtent > 0) {
      const leftScale = availableLeft / leftExtent;
      scaleX = Math.min(scaleX, leftScale);
    }

    // Check if right side overflows
    if (rightExtent > 0) {
      const rightScale = availableRight / rightExtent;
      scaleX = Math.min(scaleX, rightScale);
    }

    // Check if bottom overflows
    if (bottomExtent > 0) {
      scaleY = availableBottom / bottomExtent;
    }

    // Take the most restrictive scale factor
    // Multiply by 0.85 for safety margin (prevents edge cases touching borders)
    const finalScale = Math.min(scaleX, scaleY, 1.0) * 0.85;

    // Scale all nodes around the fixed root position
    // This shrinks children while keeping root at same spot
    this._scaleTree(this.root, rootX, rootY, finalScale);
  }

  _getTreeInfo(node) {
    if (!node) return { maxWidth: 0, maxHeight: 0 };

    const leftInfo = this._getTreeInfo(node.left);
    const rightInfo = this._getTreeInfo(node.right);

    return {
      maxWidth: Math.max(leftInfo.maxWidth, rightInfo.maxWidth) + 1,
      maxHeight: Math.max(leftInfo.maxHeight, rightInfo.maxHeight) + 1,
    };
  }

  _positionSubtree(node, parentX, parentY, maxWidth, maxHeight) {
    if (!node) return;

    const horizontalSpacing = 50;
    const verticalSpacing = 60;

    if (node.left) {
      // Use a more moderate spacing formula that doesn't grow too aggressively
      const heightFactor = Math.min(maxHeight - 1, 2);
      const leftOffset = Math.max(
        horizontalSpacing,
        (2 ** heightFactor * horizontalSpacing) / 2,
      );
      const leftChild = node.left;
      leftChild.x = parentX - leftOffset;
      leftChild.y = parentY + verticalSpacing;
      this._positionSubtree(
        leftChild,
        leftChild.x,
        leftChild.y,
        maxWidth - 1,
        maxHeight - 1,
      );
    }

    if (node.right) {
      // Use a more moderate spacing formula that doesn't grow too aggressively
      const heightFactor = Math.min(maxHeight - 1, 2);
      const rightOffset = Math.max(
        horizontalSpacing,
        (2 ** heightFactor * horizontalSpacing) / 2,
      );
      const rightChild = node.right;
      rightChild.x = parentX + rightOffset;
      rightChild.y = parentY + verticalSpacing;
      this._positionSubtree(
        rightChild,
        rightChild.x,
        rightChild.y,
        maxWidth - 1,
        maxHeight - 1,
      );
    }
  }

  _getTreeBounds(node) {
    if (!node) {
      return {
        minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity,
      };
    }

    let minX = node.x;
    let maxX = node.x;
    let minY = node.y;
    let maxY = node.y;

    if (node.left) {
      const leftBounds = this._getTreeBounds(node.left);
      minX = Math.min(minX, leftBounds.minX);
      maxX = Math.max(maxX, leftBounds.maxX);
      minY = Math.min(minY, leftBounds.minY);
      maxY = Math.max(maxY, leftBounds.maxY);
    }

    if (node.right) {
      const rightBounds = this._getTreeBounds(node.right);
      minX = Math.min(minX, rightBounds.minX);
      maxX = Math.max(maxX, rightBounds.maxX);
      minY = Math.min(minY, rightBounds.minY);
      maxY = Math.max(maxY, rightBounds.maxY);
    }

    return {
      minX, maxX, minY, maxY,
    };
  }

  _scaleTree(node, centerX, centerY, scale) {
    if (!node) return;

    const targetNode = node;
    // Scale position relative to center
    targetNode.x = centerX + (node.x - centerX) * scale;
    targetNode.y = centerY + (node.y - centerY) * scale;

    // Store scale factor for rendering
    targetNode.scale = scale;

    this._scaleTree(node.left, centerX, centerY, scale);
    this._scaleTree(node.right, centerX, centerY, scale);
  }

  _translateTree(node, offsetX, offsetY) {
    if (!node) return;

    const targetNode = node;
    targetNode.x += offsetX;
    targetNode.y += offsetY;

    this._translateTree(node.left, offsetX, offsetY);
    this._translateTree(node.right, offsetX, offsetY);
  }

  _collectTreeData(node, nodes, edges) {
    if (!node) return;

    nodes.push({
      id: node.id,
      value: node.value,
      x: node.x,
      y: node.y,
      color: node.color,
      height: node.height,
      scale: node.scale || 1.0,
    });

    if (node.left) {
      edges.push({
        from: node.id,
        to: node.left.id,
        type: 'left',
      });
      this._collectTreeData(node.left, nodes, edges);
    }

    if (node.right) {
      edges.push({
        from: node.id,
        to: node.right.id,
        type: 'right',
      });
      this._collectTreeData(node.right, nodes, edges);
    }
  }

  insert(value) {
    const animations = [];

    if (!this.root) {
      const newNode = new Node(value, this.generateId());
      this.root = newNode;
      this.root.x = 400;
      this.root.y = 50;
      animations.push({
        type: 'update-status',
        message: `Inserted ${value} as root node`,
        duration: 1000,
      });
      return { tree: this, animations };
    }

    let current = this.root;
    const path = [];

    while (current) {
      path.push(current);

      if (value < current.value) {
        if (!current.left) {
          const newNode = new Node(value, this.generateId());
          current.left = newNode;
          newNode.parent = current;
          BST.positionNode(newNode, current, 'left');

          animations.push({
            type: 'update-status',
            message: `Inserted ${value} successfully`,
            duration: 1000,
          });
          return { tree: this, animations };
        }
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) {
          const newNode = new Node(value, this.generateId());
          current.right = newNode;
          newNode.parent = current;
          BST.positionNode(newNode, current, 'right');

          animations.push({
            type: 'update-status',
            message: `Inserted ${value} successfully`,
            duration: 1000,
          });
          return { tree: this, animations };
        }
        current = current.right;
      } else {
        animations.push({
          type: 'update-status',
          message: `Value ${value} already exists in the tree`,
          duration: 1000,
        });
        return { tree: this, animations };
      }
    }

    // If no insertion occurred (shouldn't normally happen), return current tree state
    return { tree: this, animations };
  }

  static positionNode(node, parent, direction) {
    const level = BST.getLevel(node);
    const horizontalSpacing = 150;
    const verticalSpacing = 100;

    const levelWidth = 2 ** level * horizontalSpacing;

    const targetNode = node;
    if (direction === 'left') {
      targetNode.x = parent.x - levelWidth;
    } else {
      targetNode.x = parent.x + levelWidth;
    }
    targetNode.y = parent.y + verticalSpacing;
  }

  static getLevel(node) {
    let level = 0;
    let current = node.parent;
    while (current) {
      level += 1;
      current = current.parent;
    }
    return level;
  }

  static getNodeIndex() {
    return 0;
  }

  /**
   * Search for a value in the BST
   * Simple but efficient - follows BST property to navigate
   * Time: O(h) where h is height
   */
  search(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Searching for ${value}`,
      duration: 500,
    });

    let current = this.root;
    while (current) {
      // Found it!
      if (value === current.value) {
        animations.push({
          type: 'highlight-node',
          nodeId: current.id,
          state: 'found',
          duration: 500,
        });
        animations.push({
          type: 'update-status',
          message: `Found ${value}!`,
          duration: 1000,
        });
        return { found: true, animations };
      }
      // Go left or right based on BST property
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    // Reached null - value not in tree
    animations.push({
      type: 'update-status',
      message: `${value} not found in the tree`,
      duration: 1000,
    });
    return { found: false, animations };
  }

  /**
   * Delete a value from the BST
   * Handles three cases: leaf, one child, two children
   * Two children case is the tricky one - use inorder successor!
   * Time: O(h)
   */
  delete(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Deleting ${value}`,
      duration: 500,
    });

    // Recursively find and delete the node
    const result = this._deleteNode(this.root, value, animations);
    this.root = result.node;

    animations.push({
      type: 'update-status',
      message: `Deleted ${value} successfully`,
      duration: 1000,
    });

    return { tree: this, animations };
  }

  /**
   * Recursive helper for deletion
   * This implements the standard BST delete algorithm with three cases
   */
  _deleteNode(node, value, animations) {
    // Base case: value not found
    if (!node) {
      animations.push({
        type: 'update-status',
        message: `${value} not found for deletion`,
        duration: 1000,
      });
      return { node: null };
    }

    const targetNode = node;

    // Recursive case: search for the value
    if (value < node.value) {
      const result = this._deleteNode(node.left, value, animations);
      targetNode.left = result.node;
      if (targetNode.left) targetNode.left.parent = targetNode;
    } else if (value > node.value) {
      const result = this._deleteNode(node.right, value, animations);
      targetNode.right = result.node;
      if (targetNode.right) targetNode.right.parent = targetNode;
    } else {
      // Found the node to delete!
      animations.push({
        type: 'highlight-node',
        nodeId: node.id,
        state: 'current',
        duration: 500,
      });

      // CASE 1: Leaf node (no children) - just remove it
      if (!node.left && !node.right) {
        animations.push({
          type: 'update-status',
          message: `Deleting leaf node ${value}`,
          duration: 1000,
        });
        return { node: null };
      }

      // CASE 2a: Only right child - replace with right child
      if (!node.left) {
        animations.push({
          type: 'update-status',
          message: `Deleting ${value} (only right child)`,
          duration: 1000,
        });
        if (targetNode.right) targetNode.right.parent = targetNode.parent;
        return { node: targetNode.right };
      }

      // CASE 2b: Only left child - replace with left child
      if (!node.right) {
        animations.push({
          type: 'update-status',
          message: `Deleting ${value} (only left child)`,
          duration: 1000,
        });
        if (targetNode.left) targetNode.left.parent = targetNode.parent;
        return { node: targetNode.left };
      }

      // CASE 3: Two children - replace with inorder successor
      // Inorder successor = smallest value in right subtree
      // This maintains BST property because it's greater than left subtree
      // but smaller than all other nodes in right subtree!
      const minNode = BST.findMin(node.right);
      animations.push({
        type: 'highlight-node',
        nodeId: minNode.id,
        state: 'pivot',
        duration: 500,
      });
      animations.push({
        type: 'update-status',
        message: `Replacing ${value} with ${minNode.value}`,
        duration: 1000,
      });

      // Copy successor's value to current node
      targetNode.value = minNode.value;

      const result = this._deleteNode(targetNode.right, minNode.value, animations);
      targetNode.right = result.node;
      if (targetNode.right) targetNode.right.parent = targetNode;
    }

    return { node };
  }

  static findMin(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  /**
   * Inorder Traversal (Left-Root-Right)
   * Key property: Produces SORTED order for BST!
   * This is why it's called "inorder" - it visits nodes in sorted order
   * Time: O(n) - visits every node once
   */
  inorderTraversal() {
    const animations = [];
    const result = [];

    animations.push({
      type: 'update-status',
      message: 'Starting inorder traversal (Left-Root-Right)',
      duration: 500,
    });

    this._inorderHelper(this.root, result, animations);

    animations.push({
      type: 'update-status',
      message: `Inorder traversal complete: ${result.join(' → ')}`,
      duration: 1000,
    });

    return { result, animations };
  }

  // Recursive helper for inorder - order matters!
  // Visit left subtree first, then node, then right subtree
  _inorderHelper(node, result, animations) {
    if (!node) return;

    // Step 1: Process left subtree
    this._inorderHelper(node.left, result, animations);

    // Step 2: Process current node (this is where we "visit" it)
    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'visited',
      duration: 500,
    });
    animations.push({
      type: 'show-value',
      nodeId: node.id,
      value: node.value,
      duration: 500,
    });
    result.push(node.value);

    // Step 3: Process right subtree
    this._inorderHelper(node.right, result, animations);
  }

  /**
   * Preorder Traversal (Root-Left-Right)
   * Useful for: Creating a copy of the tree, prefix expression evaluation
   * Visit order: Process node BEFORE its children
   * Time: O(n)
   */
  preorderTraversal() {
    const animations = [];
    const result = [];

    animations.push({
      type: 'update-status',
      message: 'Starting preorder traversal (Root-Left-Right)',
      duration: 500,
    });

    this._preorderHelper(this.root, result, animations);

    animations.push({
      type: 'update-status',
      message: `Preorder traversal complete: ${result.join(' → ')}`,
      duration: 1000,
    });

    return { result, animations };
  }

  // Preorder: Visit node first, then its children
  _preorderHelper(node, result, animations) {
    if (!node) return;

    // Step 1: Process current node FIRST
    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'visited',
      duration: 500,
    });
    animations.push({
      type: 'show-value',
      nodeId: node.id,
      value: node.value,
      duration: 500,
    });
    result.push(node.value);

    // Step 2 & 3: Then process children
    this._preorderHelper(node.left, result, animations);

    this._preorderHelper(node.right, result, animations);
  }

  /**
   * Postorder Traversal (Left-Right-Root)
   * Useful for: Deleting tree (children before parent), postfix expression evaluation
   * Visit order: Process node AFTER its children
   * Time: O(n)
   */
  postorderTraversal() {
    const animations = [];
    const result = [];

    animations.push({
      type: 'update-status',
      message: 'Starting postorder traversal (Left-Right-Root)',
      duration: 500,
    });

    this._postorderHelper(this.root, result, animations);

    animations.push({
      type: 'update-status',
      message: `Postorder traversal complete: ${result.join(' → ')}`,
      duration: 1000,
    });

    return { result, animations };
  }

  // Postorder: Visit children first, then the node itself
  _postorderHelper(node, result, animations) {
    if (!node) return;

    // Step 1 & 2: Process both children first
    this._postorderHelper(node.left, result, animations);
    this._postorderHelper(node.right, result, animations);

    // Step 3: Process current node LAST (after children are done)
    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'visited',
      duration: 500,
    });
    animations.push({
      type: 'show-value',
      nodeId: node.id,
      value: node.value,
      duration: 500,
    });
    result.push(node.value);
  }

  clone() {
    const newTree = new BST();
    newTree.nodeIdCounter = this.nodeIdCounter;
    newTree.root = this._cloneNode(this.root);
    return newTree;
  }

  _cloneNode(node) {
    if (!node) return null;

    const cloned = new Node(node.value, node.id, node.x, node.y);
    cloned.height = node.height;
    cloned.color = node.color;
    cloned.scale = node.scale;
    cloned.left = this._cloneNode(node.left);
    cloned.right = this._cloneNode(node.right);

    if (cloned.left) cloned.left.parent = cloned;
    if (cloned.right) cloned.right.parent = cloned;

    return cloned;
  }

  _cloneNodeWithIds(node) {
    if (!node) return null;

    const cloned = new Node(node.value, node.id, node.x, node.y);
    cloned.height = node.height;
    cloned.color = node.color;
    cloned.scale = node.scale;
    cloned.left = this._cloneNodeWithIds(node.left);
    cloned.right = this._cloneNodeWithIds(node.right);

    if (cloned.left) cloned.left.parent = cloned;
    if (cloned.right) cloned.right.parent = cloned;

    return cloned;
  }

  safeClone() {
    const newTree = new BST();
    newTree.nodeIdCounter = this.nodeIdCounter;
    newTree.root = this._safeCloneNode(this.root);
    return newTree;
  }

  _safeCloneNode(node) {
    if (!node) return null;

    const cloned = new Node(node.value, node.id, node.x, node.y);
    cloned.height = node.height;
    cloned.color = node.color;
    cloned.scale = node.scale;

    cloned.left = this._safeCloneNode(node.left);
    cloned.right = this._safeCloneNode(node.right);

    if (cloned.left) cloned.left.parent = cloned;
    if (cloned.right) cloned.right.parent = cloned;

    return cloned;
  }
}
