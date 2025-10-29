/**
 * AVL Tree Implementation (Self-Balancing Binary Search Tree)
 *
 * Named after inventors Adelson-Velsky and Landis (1962)
 *
 * Key Properties:
 * - All BST properties hold
 * - For every node: |height(left) - height(right)| ≤ 1
 * - Self-balances using rotations after insert/delete
 *
 * Time Complexity: O(log n) guaranteed for all operations!
 * This is better than regular BST which can degrade to O(n)
 *
 * Uses 4 types of rotations: LL, RR, LR, RL
 */
import Node from './node.js';

class AVLTree {
  constructor() {
    this.root = null;
    this.nodeIdCounter = 0; // For unique node IDs
  }

  getTreeData() {
    const nodes = [];
    const edges = [];

    if (this.root) {
      this._calculateTreeLayout();
      this._collectTreeData(this.root, nodes, edges);
    }

    return { nodes, edges };
  }

  _calculateTreeLayout() {
    if (!this.root) return;

    const treeInfo = this._getTreeInfo(this.root);
    const canvasWidth = 1400;
    const canvasHeight = 700;
    const paddingX = 60;
    const paddingY = 60;
    // Fixed root position - center top of canvas
    const rootX = canvasWidth / 2;
    const rootY = 100;

    this.root.x = rootX;
    this.root.y = rootY;

    this._positionSubtree(
      this.root,
      rootX,
      rootY,
      treeInfo.maxWidth,
      treeInfo.maxHeight,
    );

    // Calculate tree bounds to determine how far it extends from root
    const bounds = this._getTreeBounds(this.root);

    // Calculate how far the tree extends from the root in each direction
    const leftExtent = rootX - bounds.minX; // How far left from root
    const rightExtent = bounds.maxX - rootX; // How far right from root
    const bottomExtent = bounds.maxY - rootY; // How far down from root

    // Calculate available space from root position to canvas edges (with padding)
    const availableLeft = rootX - paddingX;
    const availableRight = canvasWidth - rootX - paddingX;
    const availableBottom = canvasHeight - rootY - paddingY;

    // Calculate scale factors needed to fit each extent within available space
    let scaleX = 1.0;
    let scaleY = 1.0;

    // Check left side
    if (leftExtent > 0) {
      const leftScale = availableLeft / leftExtent;
      scaleX = Math.min(scaleX, leftScale);
    }

    // Check right side
    if (rightExtent > 0) {
      const rightScale = availableRight / rightExtent;
      scaleX = Math.min(scaleX, rightScale);
    }

    // Check bottom
    if (bottomExtent > 0) {
      scaleY = availableBottom / bottomExtent;
    }

    // Use the smaller scale to ensure tree fits in both dimensions
    // Add safety margin to prevent edge overflow
    const finalScale = Math.min(scaleX, scaleY, 1.0) * 0.85;

    // Apply scaling around the FIXED root position
    // This keeps root at the same spot while scaling children
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

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  updateHeight(node) {
    if (node) {
      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }
  }

  /**
   * Right Rotation (LL Case)
   *
   * Used when left subtree is too heavy on the left side
   *
   * Before:        After:
   *     y            x
   *    / \          / \
   *   x  T3   -->  T1  y
   *  / \              / \
   * T1 T2            T2 T3
   *
   * Steps:
   * 1. x becomes new root
   * 2. y becomes right child of x
   * 3. T2 moves from x's right to y's left
   */
  rotateRight(y, animations) {
    animations.push({
      type: 'update-status',
      message: `Right rotation at node ${y.value} (LL case)`,
      duration: 800,
    });

    const x = y.left; // x will be the new root
    const T2 = x.right; // T2 will move to y's left

    // Perform the rotation - this is the core operation!
    x.right = y;
    y.left = T2;

    // Fix parent pointers (important for tree integrity)
    if (T2) T2.parent = y;
    x.parent = y.parent;
    y.parent = x;

    // Update heights bottom-up (y first, then x)
    this.updateHeight(y);
    this.updateHeight(x);

    animations.push({
      type: 'highlight-node',
      nodeId: x.id,
      state: 'pivot',
      duration: 600,
    });

    return x; // New root of this subtree
  }

  /**
   * Left Rotation (RR Case)
   *
   * Used when right subtree is too heavy on the right side
   * Mirror image of right rotation
   *
   * Before:        After:
   *   x              y
   *  / \            / \
   * T1  y    -->   x  T3
   *    / \        / \
   *   T2 T3      T1 T2
   */
  rotateLeft(x, animations) {
    animations.push({
      type: 'update-status',
      message: `Left rotation at node ${x.value} (RR case)`,
      duration: 800,
    });

    const y = x.right; // y will be the new root
    const T2 = y.left; // T2 will move to x's right

    // Perform the rotation
    y.left = x;
    x.right = T2;

    // Fix parent pointers
    if (T2) T2.parent = x;
    y.parent = x.parent;
    x.parent = y;

    // Update heights bottom-up
    this.updateHeight(x);
    this.updateHeight(y);

    animations.push({
      type: 'highlight-node',
      nodeId: y.id,
      state: 'pivot',
      duration: 600,
    });

    return y; // New root of this subtree
  }

  insert(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Inserting ${value} into AVL tree`,
      duration: 500,
    });

    this.root = this._insertNode(this.root, value, animations, null);
    return { tree: this, animations };
  }

  _insertNode(node, value, animations, parent) {
    // Standard BST insertion
    if (!node) {
      const newNode = new Node(value, this.nodeIdCounter);
      this.nodeIdCounter += 1;
      newNode.parent = parent;
      newNode.height = 1;

      animations.push({
        type: 'highlight-node',
        nodeId: newNode.id,
        state: 'inserted',
        duration: 500,
      });

      animations.push({
        type: 'update-status',
        message: `Inserted ${value}`,
        duration: 500,
      });

      return newNode;
    }

    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'visiting',
      duration: 300,
    });

    if (value < node.value) {
      animations.push({
        type: 'update-status',
        message: `${value} < ${node.value}, going left`,
        duration: 500,
      });
      node.left = this._insertNode(node.left, value, animations, node);
    } else if (value > node.value) {
      animations.push({
        type: 'update-status',
        message: `${value} > ${node.value}, going right`,
        duration: 500,
      });
      node.right = this._insertNode(node.right, value, animations, node);
    } else {
      animations.push({
        type: 'update-status',
        message: `${value} already exists, skipping`,
        duration: 500,
      });
      return node;
    }

    // Update height
    this.updateHeight(node);

    // Get balance factor
    const balance = this.getBalanceFactor(node);

    animations.push({
      type: 'update-status',
      message: `Balance factor at ${node.value}: ${balance}`,
      duration: 500,
    });

    // Left-Left Case
    if (balance > 1 && value < node.left.value) {
      animations.push({
        type: 'update-status',
        message: `Left-Left case detected at ${node.value}`,
        duration: 600,
      });
      return this.rotateRight(node, animations);
    }

    // Right-Right Case
    if (balance < -1 && value > node.right.value) {
      animations.push({
        type: 'update-status',
        message: `Right-Right case detected at ${node.value}`,
        duration: 600,
      });
      return this.rotateLeft(node, animations);
    }

    // Left-Right Case
    if (balance > 1 && value > node.left.value) {
      animations.push({
        type: 'update-status',
        message: `Left-Right case detected at ${node.value}`,
        duration: 600,
      });
      node.left = this.rotateLeft(node.left, animations);
      return this.rotateRight(node, animations);
    }

    // Right-Left Case
    if (balance < -1 && value < node.right.value) {
      animations.push({
        type: 'update-status',
        message: `Right-Left case detected at ${node.value}`,
        duration: 600,
      });
      node.right = this.rotateRight(node.right, animations);
      return this.rotateLeft(node, animations);
    }

    return node;
  }

  delete(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Deleting ${value} from AVL tree`,
      duration: 500,
    });

    this.root = this._deleteNode(this.root, value, animations);
    return { tree: this, animations };
  }

  _deleteNode(node, value, animations) {
    if (!node) {
      animations.push({
        type: 'update-status',
        message: `Value ${value} not found`,
        duration: 800,
      });
      return node;
    }

    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'visiting',
      duration: 300,
    });

    if (value < node.value) {
      node.left = this._deleteNode(node.left, value, animations);
    } else if (value > node.value) {
      node.right = this._deleteNode(node.right, value, animations);
    } else {
      // Node found
      animations.push({
        type: 'highlight-node',
        nodeId: node.id,
        state: 'found',
        duration: 500,
      });

      // Node with only one child or no child
      if (!node.left || !node.right) {
        const temp = node.left ? node.left : node.right;
        if (temp) temp.parent = node.parent;
        return temp;
      }
      {
        // Node with two children
        const temp = this._findMin(node.right);
        animations.push({
          type: 'highlight-node',
          nodeId: temp.id,
          state: 'pivot',
          duration: 500,
        });

        node.value = temp.value;
        node.right = this._deleteNode(node.right, temp.value, animations);
      }
    }

    if (!node) return node;

    // Update height
    this.updateHeight(node);

    // Get balance factor
    const balance = this.getBalanceFactor(node);

    animations.push({
      type: 'update-status',
      message: `Balance factor at ${node.value}: ${balance}`,
      duration: 500,
    });

    // Left-Left Case
    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
      return this.rotateRight(node, animations);
    }

    // Left-Right Case
    if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left, animations);
      return this.rotateRight(node, animations);
    }

    // Right-Right Case
    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
      return this.rotateLeft(node, animations);
    }

    // Right-Left Case
    if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right, animations);
      return this.rotateLeft(node, animations);
    }

    return node;
  }

  _findMin(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  search(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Searching for ${value} in AVL tree`,
      duration: 500,
    });

    this._searchNode(this.root, value, animations);
    return { animations };
  }

  _searchNode(node, value, animations) {
    if (!node) {
      animations.push({
        type: 'update-status',
        message: `Value ${value} not found`,
        duration: 800,
      });
      return false;
    }

    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'visiting',
      duration: 300,
    });

    if (value === node.value) {
      animations.push({
        type: 'highlight-node',
        nodeId: node.id,
        state: 'found',
        duration: 800,
      });
      animations.push({
        type: 'update-status',
        message: `Found ${value}!`,
        duration: 800,
      });
      return true;
    }

    if (value < node.value) {
      animations.push({
        type: 'update-status',
        message: `${value} < ${node.value}, going left`,
        duration: 500,
      });
      return this._searchNode(node.left, value, animations);
    }

    animations.push({
      type: 'update-status',
      message: `${value} > ${node.value}, going right`,
      duration: 500,
    });
    return this._searchNode(node.right, value, animations);
  }

  // Traversal methods (same as BST)
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

  _inorderHelper(node, result, animations) {
    if (!node) return;

    this._inorderHelper(node.left, result, animations);

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

    this._inorderHelper(node.right, result, animations);
  }

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

  _preorderHelper(node, result, animations) {
    if (!node) return;

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

    this._preorderHelper(node.left, result, animations);
    this._preorderHelper(node.right, result, animations);
  }

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

  _postorderHelper(node, result, animations) {
    if (!node) return;

    this._postorderHelper(node.left, result, animations);
    this._postorderHelper(node.right, result, animations);

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

  safeClone() {
    const newTree = new AVLTree();
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

export default AVLTree;
