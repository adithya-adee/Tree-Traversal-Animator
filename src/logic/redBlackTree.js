/**
 * Red-Black Tree Implementation (Self-Balancing BST)
 *
 * More complex than AVL but with same O(log n) guarantee
 * Used in many real-world systems (Java TreeMap, Linux kernel, etc.)
 *
 * Five Properties (MUST maintain all five!):
 * 1. Every node is either RED or BLACK
 * 2. Root is always BLACK
 * 3. All leaves (null) are BLACK
 * 4. RED node cannot have RED child (no consecutive reds)
 * 5. All paths from node to leaves have same number of BLACK nodes
 *
 * Why these rules?
 * - They ensure longest path ≤ 2 * shortest path
 * - This guarantees O(log n) height
 *
 * Balancing uses:
 * - Recoloring (simpler, used when possible)
 * - Rotations (when recoloring isn't enough)
 *
 * Honestly, deletion was the hardest part of this entire project!
 * Had to reference CLRS textbook multiple times to get it right.
 */
import Node from './node.js';

// Color constants for better readability
const RED = 'red';
const BLACK = 'black';

class RedBlackTree {
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

    const bounds = this._getTreeBounds(this.root);
    const leftExtent = rootX - bounds.minX;
    const rightExtent = bounds.maxX - rootX;
    const bottomExtent = bounds.maxY - rootY;

    const availableLeft = rootX - paddingX;
    const availableRight = canvasWidth - rootX - paddingX;
    const availableBottom = canvasHeight - rootY - paddingY;

    let scaleX = 1.0;
    let scaleY = 1.0;

    if (leftExtent > 0) {
      const leftScale = availableLeft / leftExtent;
      scaleX = Math.min(scaleX, leftScale);
    }

    if (rightExtent > 0) {
      const rightScale = availableRight / rightExtent;
      scaleX = Math.min(scaleX, rightScale);
    }

    if (bottomExtent > 0) {
      scaleY = availableBottom / bottomExtent;
    }

    const finalScale = Math.min(scaleX, scaleY, 1.0) * 0.85;
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
      minX,
      maxX,
      minY,
      maxY,
    };
  }

  _scaleTree(node, centerX, centerY, scale) {
    if (!node) return;

    const targetNode = node;
    targetNode.x = centerX + (node.x - centerX) * scale;
    targetNode.y = centerY + (node.y - centerY) * scale;
    targetNode.scale = scale;

    this._scaleTree(node.left, centerX, centerY, scale);
    this._scaleTree(node.right, centerX, centerY, scale);
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

  // Rotation methods
  rotateLeft(node, animations) {
    animations.push({
      type: 'update-status',
      message: `Left rotation at node ${node.value}`,
      duration: 800,
    });

    const rightChild = node.right;
    node.right = rightChild.left;

    if (node.right) {
      node.right.parent = node;
    }

    rightChild.parent = node.parent;

    if (!node.parent) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }

    rightChild.left = node;
    node.parent = rightChild;

    animations.push({
      type: 'highlight-node',
      nodeId: rightChild.id,
      state: 'pivot',
      duration: 600,
    });
  }

  rotateRight(node, animations) {
    animations.push({
      type: 'update-status',
      message: `Right rotation at node ${node.value}`,
      duration: 800,
    });

    const leftChild = node.left;
    node.left = leftChild.right;

    if (node.left) {
      node.left.parent = node;
    }

    leftChild.parent = node.parent;

    if (!node.parent) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }

    leftChild.right = node;
    node.parent = leftChild;

    animations.push({
      type: 'highlight-node',
      nodeId: leftChild.id,
      state: 'pivot',
      duration: 600,
    });
  }

  insert(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Inserting ${value} into Red-Black tree`,
      duration: 500,
    });

    const newNode = new Node(value, this.nodeIdCounter);
    this.nodeIdCounter += 1;
    newNode.color = RED; // New nodes are always red
    newNode.left = null;
    newNode.right = null;
    newNode.parent = null;

    if (!this.root) {
      newNode.color = BLACK; // Root is always black
      this.root = newNode;

      animations.push({
        type: 'highlight-node',
        nodeId: newNode.id,
        state: 'inserted',
        duration: 500,
      });

      animations.push({
        type: 'recolor-node',
        nodeId: newNode.id,
        color: BLACK,
        duration: 500,
      });

      animations.push({
        type: 'update-status',
        message: `Inserted ${value} as black root`,
        duration: 500,
      });

      return { tree: this, animations };
    }

    // Standard BST insertion
    let current = this.root;
    let parent = null;

    while (current) {
      parent = current;

      animations.push({
        type: 'highlight-node',
        nodeId: current.id,
        state: 'visiting',
        duration: 300,
      });

      if (value < current.value) {
        animations.push({
          type: 'update-status',
          message: `${value} < ${current.value}, going left`,
          duration: 500,
        });
        current = current.left;
      } else if (value > current.value) {
        animations.push({
          type: 'update-status',
          message: `${value} > ${current.value}, going right`,
          duration: 500,
        });
        current = current.right;
      } else {
        animations.push({
          type: 'update-status',
          message: `${value} already exists, skipping`,
          duration: 500,
        });
        return { tree: this, animations };
      }
    }

    newNode.parent = parent;

    if (value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    animations.push({
      type: 'highlight-node',
      nodeId: newNode.id,
      state: 'inserted',
      duration: 500,
    });

    animations.push({
      type: 'recolor-node',
      nodeId: newNode.id,
      color: RED,
      duration: 500,
    });

    animations.push({
      type: 'update-status',
      message: `Inserted ${value} as red node, checking balance...`,
      duration: 500,
    });

    // Fix Red-Black tree properties
    this._fixInsert(newNode, animations);

    return { tree: this, animations };
  }

  _fixInsert(node, animations) {
    while (node.parent && node.parent.color === RED) {
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;

        if (uncle && uncle.color === RED) {
          // Case 1: Uncle is red - recolor
          animations.push({
            type: 'update-status',
            message: 'Uncle is red, recoloring parent, uncle, and grandparent',
            duration: 700,
          });

          node.parent.color = BLACK;
          uncle.color = BLACK;
          node.parent.parent.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: uncle.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.parent.id,
            color: RED,
            duration: 500,
          });

          node = node.parent.parent;
        } else {
          // Case 2: Uncle is black
          if (node === node.parent.right) {
            // Left-Right case
            animations.push({
              type: 'update-status',
              message: 'Left-Right case: rotate left at parent',
              duration: 700,
            });

            // After rotation, node moves up and parent moves down to become left child
            const tempNode = node;
            this.rotateLeft(tempNode.parent, animations);
            node = tempNode.left;
          }

          // Left-Left case
          animations.push({
            type: 'update-status',
            message: 'Left-Left case: recolor and rotate right',
            duration: 700,
          });

          node.parent.color = BLACK;
          node.parent.parent.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.parent.id,
            color: RED,
            duration: 500,
          });

          this.rotateRight(node.parent.parent, animations);
        }
      } else {
        // Mirror cases
        const uncle = node.parent.parent.left;

        if (uncle && uncle.color === RED) {
          animations.push({
            type: 'update-status',
            message: 'Uncle is red, recoloring parent, uncle, and grandparent',
            duration: 700,
          });

          node.parent.color = BLACK;
          uncle.color = BLACK;
          node.parent.parent.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: uncle.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.parent.id,
            color: RED,
            duration: 500,
          });

          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            animations.push({
              type: 'update-status',
              message: 'Right-Left case: rotate right at parent',
              duration: 700,
            });

            // After rotation, node moves up and parent moves down to become right child
            const tempNode = node;
            this.rotateRight(tempNode.parent, animations);
            node = tempNode.right;
          }

          animations.push({
            type: 'update-status',
            message: 'Right-Right case: recolor and rotate left',
            duration: 700,
          });

          node.parent.color = BLACK;
          node.parent.parent.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.parent.id,
            color: RED,
            duration: 500,
          });

          this.rotateLeft(node.parent.parent, animations);
        }
      }

      if (node === this.root) {
        break;
      }
    }

    // Root must always be black
    if (this.root.color !== BLACK) {
      this.root.color = BLACK;

      animations.push({
        type: 'recolor-node',
        nodeId: this.root.id,
        color: BLACK,
        duration: 500,
      });

      animations.push({
        type: 'update-status',
        message: 'Root recolored to black',
        duration: 500,
      });
    }
  }

  delete(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Deleting ${value} from Red-Black tree`,
      duration: 500,
    });

    const node = this._findNode(this.root, value);

    if (!node) {
      animations.push({
        type: 'update-status',
        message: `Value ${value} not found`,
        duration: 800,
      });
      return { tree: this, animations };
    }

    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'found',
      duration: 500,
    });

    this._deleteNode(node, animations);

    return { tree: this, animations };
  }

  _findNode(node, value) {
    while (node) {
      if (value === node.value) {
        return node;
      }
      if (value < node.value) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return null;
  }

  _deleteNode(node, animations) {
    let replacement;

    if (!node.left || !node.right) {
      replacement = node;
    } else {
      replacement = this._findMin(node.right);
    }

    const replacementChild = replacement.left ? replacement.left : replacement.right;

    if (replacementChild) {
      replacementChild.parent = replacement.parent;
    }

    if (!replacement.parent) {
      this.root = replacementChild;
    } else if (replacement === replacement.parent.left) {
      replacement.parent.left = replacementChild;
    } else {
      replacement.parent.right = replacementChild;
    }

    if (replacement !== node) {
      node.value = replacement.value;
      animations.push({
        type: 'update-status',
        message: `Replaced ${node.value} with successor`,
        duration: 600,
      });
    }

    if (replacement.color === BLACK && replacementChild) {
      this._fixDelete(replacementChild, animations);
    }
  }

  _fixDelete(node, animations) {
    while (node !== this.root && node.color === BLACK) {
      if (node === node.parent.left) {
        let sibling = node.parent.right;

        if (sibling.color === RED) {
          sibling.color = BLACK;
          node.parent.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: sibling.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: RED,
            duration: 500,
          });

          this.rotateLeft(node.parent, animations);
          sibling = node.parent.right;
        }

        if ((!sibling.left || sibling.left.color === BLACK)
          && (!sibling.right || sibling.right.color === BLACK)) {
          sibling.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: sibling.id,
            color: RED,
            duration: 500,
          });

          node = node.parent;
        } else {
          if (!sibling.right || sibling.right.color === BLACK) {
            if (sibling.left) sibling.left.color = BLACK;
            sibling.color = RED;

            if (sibling.left) {
              animations.push({
                type: 'recolor-node',
                nodeId: sibling.left.id,
                color: BLACK,
                duration: 500,
              });
            }

            animations.push({
              type: 'recolor-node',
              nodeId: sibling.id,
              color: RED,
              duration: 500,
            });

            this.rotateRight(sibling, animations);
            sibling = node.parent.right;
          }

          sibling.color = node.parent.color;
          node.parent.color = BLACK;

          if (sibling.right) sibling.right.color = BLACK;

          animations.push({
            type: 'recolor-node',
            nodeId: sibling.id,
            color: node.parent.color,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: BLACK,
            duration: 500,
          });

          if (sibling.right) {
            animations.push({
              type: 'recolor-node',
              nodeId: sibling.right.id,
              color: BLACK,
              duration: 500,
            });
          }

          this.rotateLeft(node.parent, animations);
          node = this.root;
        }
      } else {
        // Mirror cases
        let sibling = node.parent.left;

        if (sibling.color === RED) {
          sibling.color = BLACK;
          node.parent.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: sibling.id,
            color: BLACK,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: RED,
            duration: 500,
          });

          this.rotateRight(node.parent, animations);
          sibling = node.parent.left;
        }

        if ((!sibling.right || sibling.right.color === BLACK)
          && (!sibling.left || sibling.left.color === BLACK)) {
          sibling.color = RED;

          animations.push({
            type: 'recolor-node',
            nodeId: sibling.id,
            color: RED,
            duration: 500,
          });

          node = node.parent;
        } else {
          if (!sibling.left || sibling.left.color === BLACK) {
            if (sibling.right) sibling.right.color = BLACK;
            sibling.color = RED;

            if (sibling.right) {
              animations.push({
                type: 'recolor-node',
                nodeId: sibling.right.id,
                color: BLACK,
                duration: 500,
              });
            }

            animations.push({
              type: 'recolor-node',
              nodeId: sibling.id,
              color: RED,
              duration: 500,
            });

            this.rotateLeft(sibling, animations);
            sibling = node.parent.left;
          }

          sibling.color = node.parent.color;
          node.parent.color = BLACK;

          if (sibling.left) sibling.left.color = BLACK;

          animations.push({
            type: 'recolor-node',
            nodeId: sibling.id,
            color: node.parent.color,
            duration: 500,
          });

          animations.push({
            type: 'recolor-node',
            nodeId: node.parent.id,
            color: BLACK,
            duration: 500,
          });

          if (sibling.left) {
            animations.push({
              type: 'recolor-node',
              nodeId: sibling.left.id,
              color: BLACK,
              duration: 500,
            });
          }

          this.rotateRight(node.parent, animations);
          node = this.root;
        }
      }
    }

    if (node) node.color = BLACK;
  }

  _findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  search(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Searching for ${value} in Red-Black tree`,
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

  // Traversal methods
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
    const newTree = new RedBlackTree();
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

export default RedBlackTree;
