export class Node {
  constructor(value, id, x = 0, y = 0) {
    this.value = value;
    this.id = id;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 1; 
    this.color = 'red';
    this.x = x;
    this.y = y;
  }
}


export class BST {
  constructor() {
    this.root = null;
    this.nodeIdCounter = 0;
  }

  generateId() {
    return `node-${this.nodeIdCounter++}`;
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
    const canvasWidth = 800;
    const canvasHeight = 600;
    const rootX = canvasWidth / 2;
    const rootY = 80;
    
    this.root.x = rootX;
    this.root.y = rootY;
    
    this._positionSubtree(this.root, rootX, rootY, treeInfo.maxWidth, treeInfo.maxHeight);
  }

  
  _getTreeInfo(node) {
    if (!node) return { maxWidth: 0, maxHeight: 0 };
    
    const leftInfo = this._getTreeInfo(node.left);
    const rightInfo = this._getTreeInfo(node.right);
    
    return {
      maxWidth: Math.max(leftInfo.maxWidth, rightInfo.maxWidth) + 1,
      maxHeight: Math.max(leftInfo.maxHeight, rightInfo.maxHeight) + 1
    };
  }

  _positionSubtree(node, parentX, parentY, maxWidth, maxHeight) {
    if (!node) return;
    
    const horizontalSpacing = 120;
    const verticalSpacing = 80;
    
    if (node.left) {
      const leftOffset = Math.pow(2, maxHeight - 1) * horizontalSpacing / 2;
      node.left.x = parentX - leftOffset;
      node.left.y = parentY + verticalSpacing;
      this._positionSubtree(node.left, node.left.x, node.left.y, maxWidth - 1, maxHeight - 1);
    }
    
    if (node.right) {
      const rightOffset = Math.pow(2, maxHeight - 1) * horizontalSpacing / 2;
      node.right.x = parentX + rightOffset;
      node.right.y = parentY + verticalSpacing;
      this._positionSubtree(node.right, node.right.x, node.right.y, maxWidth - 1, maxHeight - 1);
    }
  }

  _collectTreeData(node, nodes, edges) {
    if (!node) return;
    
    nodes.push({
      id: node.id,
      value: node.value,
      x: node.x,
      y: node.y,
      color: node.color,
      height: node.height
    });

    if (node.left) {
      edges.push({
        from: node.id,
        to: node.left.id,
        type: 'left'
      });
      this._collectTreeData(node.left, nodes, edges);
    }

    if (node.right) {
      edges.push({
        from: node.id,
        to: node.right.id,
        type: 'right'
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
        duration: 1000
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
          this._positionNode(newNode, current, 'left');
          
         
          animations.push({
            type: 'update-status',
            message: `Inserted ${value} successfully`,
            duration: 1000
          });
          return { tree: this, animations };
        }
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) {
          const newNode = new Node(value, this.generateId());
          current.right = newNode;
          newNode.parent = current;
          this._positionNode(newNode, current, 'right');
          
          
          animations.push({
            type: 'update-status',
            message: `Inserted ${value} successfully`,
            duration: 1000
          });
          return { tree: this, animations };
        }
        current = current.right;
      } else {
        animations.push({
          type: 'update-status',
          message: `Value ${value} already exists in the tree`,
          duration: 1000
        });
        return { tree: this, animations };
      }
    }
  }

  _positionNode(node, parent, direction) {
    const level = this._getLevel(node);
    const horizontalSpacing = 150; 
    const verticalSpacing = 100;   
    
    const levelWidth = Math.pow(2, level) * horizontalSpacing;
    
    if (direction === 'left') {
      node.x = parent.x - levelWidth;
    } else {
      node.x = parent.x + levelWidth;
    }
    node.y = parent.y + verticalSpacing;
  }

  _getLevel(node) {
    let level = 0;
    let current = node.parent;
    while (current) {
      level++;
      current = current.parent;
    }
    return level;
  }

  _getNodeIndex(node) {
  
    return 0;
  }

  search(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Searching for ${value}`,
      duration: 500
    });

    let current = this.root;
    while (current) {
      if (value === current.value) {
        animations.push({
          type: 'update-status',
          message: `Found ${value}!`,
          duration: 1000
        });
        return { found: true, animations };
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    animations.push({
      type: 'update-status',
      message: `${value} not found in the tree`,
      duration: 1000
    });
    return { found: false, animations };
  }

  delete(value) {
    const animations = [];
    animations.push({
      type: 'update-status',
      message: `Deleting ${value}`,
      duration: 500
    });

    const result = this._deleteNode(this.root, value, animations);
    this.root = result.node;
    
    animations.push({
      type: 'update-status',
      message: `Deleted ${value} successfully`,
      duration: 1000
    });
    
    return { tree: this, animations };
  }

  _deleteNode(node, value, animations) {
    if (!node) {
      animations.push({
        type: 'update-status',
        message: `${value} not found for deletion`,
        duration: 1000
      });
      return { node: null };
    }

    if (value < node.value) {
      const result = this._deleteNode(node.left, value, animations);
      node.left = result.node;
      if (node.left) node.left.parent = node;
    } else if (value > node.value) {
      const result = this._deleteNode(node.right, value, animations);
      node.right = result.node;
      if (node.right) node.right.parent = node;
    } else {
      animations.push({
        type: 'highlight-node',
        nodeId: node.id,
        state: 'current',
        duration: 500
      });

      if (!node.left && !node.right) {
        animations.push({
          type: 'update-status',
          message: `Deleting leaf node ${value}`,
          duration: 1000
        });
        return { node: null };
      } else if (!node.left) {
        
        animations.push({
          type: 'update-status',
          message: `Deleting ${value} (only right child)`,
          duration: 1000
        });
        if (node.right) node.right.parent = node.parent;
        return { node: node.right };
      } else if (!node.right) {
       
        animations.push({
          type: 'update-status',
          message: `Deleting ${value} (only left child)`,
          duration: 1000
        });
        if (node.left) node.left.parent = node.parent;
        return { node: node.left };
      } else {
        const minNode = this._findMin(node.right);
        animations.push({
          type: 'highlight-node',
          nodeId: minNode.id,
          state: 'pivot',
          duration: 500
        });
        animations.push({
          type: 'update-status',
          message: `Replacing ${value} with ${minNode.value}`,
          duration: 1000
        });

        
        node.value = minNode.value;
        
        const result = this._deleteNode(node.right, minNode.value, animations);
        node.right = result.node;
        if (node.right) node.right.parent = node;
      }
    }

    return { node };
  }

  _findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  inorderTraversal() {
    const animations = [];
    const result = [];
    
    animations.push({
      type: 'update-status',
      message: 'Starting inorder traversal (Left-Root-Right)',
      duration: 500
    });

    this._inorderHelper(this.root, result, animations);
    
    animations.push({
      type: 'update-status',
      message: `Inorder traversal complete: ${result.join(' → ')}`,
      duration: 1000
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
      duration: 500
    });
    animations.push({
      type: 'show-value',
      nodeId: node.id,
      value: node.value,
      duration: 500
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
      duration: 500
    });

    this._preorderHelper(this.root, result, animations);
    
    animations.push({
      type: 'update-status',
      message: `Preorder traversal complete: ${result.join(' → ')}`,
      duration: 1000
    });

    return { result, animations };
  }

  _preorderHelper(node, result, animations) {
    if (!node) return;

    animations.push({
      type: 'highlight-node',
      nodeId: node.id,
      state: 'visited',
      duration: 500
    });
    animations.push({
      type: 'show-value',
      nodeId: node.id,
      value: node.value,
      duration: 500
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
      duration: 500
    });

    this._postorderHelper(this.root, result, animations);
    
    animations.push({
      type: 'update-status',
      message: `Postorder traversal complete: ${result.join(' → ')}`,
      duration: 1000
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
      duration: 500
    });
    animations.push({
      type: 'show-value',
      nodeId: node.id,
      value: node.value,
      duration: 500
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
    
    cloned.left = this._safeCloneNode(node.left);
    cloned.right = this._safeCloneNode(node.right);
    
    
    if (cloned.left) cloned.left.parent = cloned;
    if (cloned.right) cloned.right.parent = cloned;
    
    return cloned;
  }
}


