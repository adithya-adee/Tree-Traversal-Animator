
export const generateId = () => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const deepClone = (obj, visited = new WeakMap()) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (visited.has(obj)) {
    return visited.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    const clonedArray = [];
    visited.set(obj, clonedArray);
    for (let i = 0; i < obj.length; i++) {
      clonedArray[i] = deepClone(obj[i], visited);
    }
    return clonedArray;
  }

  if (typeof obj === 'object') {
    const clonedObj = {};
    visited.set(obj, clonedObj);
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key], visited);
      }
    }
    return clonedObj;
  }

  return obj;
};

export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const calculateAngle = (x1, y1, x2, y2) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

export const generateRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const isValidValue = (value) => {
  const num = parseInt(value);
  return !isNaN(num) && num >= -999 && num <= 999;
};

export const formatNumber = (num) => {
  return num.toString();
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const calculateTreeDimensions = (treeData) => {
  if (!treeData || !treeData.nodes || treeData.nodes.length === 0) {
    return { width: 800, height: 600 };
  }

  const nodes = treeData.nodes;
  const minX = Math.min(...nodes.map(n => n.x));
  const maxX = Math.max(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxY = Math.max(...nodes.map(n => n.y));

  return {
    width: Math.max(800, maxX - minX + 200),
    height: Math.max(600, maxY - minY + 200),
    minX: minX - 100,
    minY: minY - 100
  };
};

export const isPointInCircle = (pointX, pointY, circleX, circleY, radius) => {
  const distance = calculateDistance(pointX, pointY, circleX, circleY);
  return distance <= radius;
};

export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

export const easingFunctions = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => (--t) * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

export const getAnimationDuration = (distance, baseSpeed = 1000) => {
  const minDuration = 300;
  const maxDuration = 2000;
  const duration = Math.max(minDuration, Math.min(maxDuration, distance * 2));
  return duration;
};

export const createAnimationStep = (type, data, duration = 1000) => {
  return {
    type,
    ...data,
    duration,
    timestamp: Date.now()
  };
};

export const isValidTreeType = (type) => {
  return ['BST'].includes(type);
};

export const getTreeTypeDisplayName = (type) => {
  const typeMap = {
    'BST': 'Binary Search Tree'
  };
  return typeMap[type] || 'Unknown Tree Type';
};

export const calculateNodePosition = (node, parent, direction, level, index) => {
  const baseX = 400; 
  const baseY = 50;
  const levelHeight = 80;
  const levelWidth = Math.pow(2, level) * 100;
  
  const x = baseX + (index - Math.pow(2, level) / 2) * levelWidth;
  const y = baseY + level * levelHeight;
  
  return { x, y };
};

export const areNodesConnected = (node1, node2, edges) => {
  return edges.some(edge => 
    (edge.from === node1.id && edge.to === node2.id) ||
    (edge.from === node2.id && edge.to === node1.id)
  );
};

export const getConnectedNodes = (nodeId, edges) => {
  const connected = [];
  edges.forEach(edge => {
    if (edge.from === nodeId) {
      connected.push(edge.to);
    } else if (edge.to === nodeId) {
      connected.push(edge.from);
    }
  });
  return connected;
};

export const calculateBalanceFactor = (node) => {
  if (!node) return 0;
  const leftHeight = node.left ? node.left.height : 0;
  const rightHeight = node.right ? node.right.height : 0;
  return leftHeight - rightHeight;
};

export const isTreeBalanced = (node) => {
  if (!node) return true;
  
  const balance = calculateBalanceFactor(node);
  if (Math.abs(balance) > 1) return false;
  
  return isTreeBalanced(node.left) && isTreeBalanced(node.right);
};

export const getTreeStatistics = (treeData) => {
  if (!treeData || !treeData.nodes) {
    return { nodeCount: 0, height: 0, balance: 0 };
  }
  
  const nodeCount = treeData.nodes.length;
  const maxY = Math.max(...treeData.nodes.map(n => n.y));
  const height = Math.floor((maxY - 50) / 80) + 1;
  
  return {
    nodeCount,
    height,
    balance: 0 
  };
};
