
import { easingFunctions, getAnimationDuration, createAnimationStep } from './utils.js';

export const ANIMATION_TYPES = {
  UPDATE_STATUS: 'update-status',
  HIGHLIGHT_NODE: 'highlight-node',
  RECOLOR_NODE: 'recolor-node',
  REPOSITION: 'reposition',
  HIGHLIGHT_EDGE: 'highlight-edge',
  FADE_IN: 'fade-in',
  FADE_OUT: 'fade-out',
  PULSE: 'pulse',
  SHAKE: 'shake'
};

export const HIGHLIGHT_STATES = {
  DEFAULT: 'default',
  CURRENT: 'current',
  PATH: 'path',
  VISITED: 'visited',
  PIVOT: 'pivot',
  FOUND: 'found',
  SEARCHING: 'searching',
  INSERTING: 'inserting',
  DELETING: 'deleting'
};

export const ANIMATION_CONFIG = {
  DEFAULT_DURATION: 1000,
  FAST_DURATION: 500,
  SLOW_DURATION: 2000,
  EASING: 'easeInOutCubic',
  HIGHLIGHT_DURATION: 300,
  REPOSITION_DURATION: 800,
  RECOLOR_DURATION: 400
};

export const createAnimationStep = (type, data = {}, duration = ANIMATION_CONFIG.DEFAULT_DURATION) => {
  return {
    type,
    ...data,
    duration,
    timestamp: Date.now(),
    id: `anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};

export const createStatusUpdate = (message, duration = ANIMATION_CONFIG.DEFAULT_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.UPDATE_STATUS, { message }, duration);
};

export const createNodeHighlight = (nodeId, state = HIGHLIGHT_STATES.CURRENT, duration = ANIMATION_CONFIG.HIGHLIGHT_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.HIGHLIGHT_NODE, { nodeId, state }, duration);
};

export const createNodeRecolor = (nodeId, color, duration = ANIMATION_CONFIG.RECOLOR_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.RECOLOR_NODE, { nodeId, color }, duration);
};

export const createNodeReposition = (nodeUpdates, duration = ANIMATION_CONFIG.REPOSITION_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.REPOSITION, { nodeUpdates }, duration);
};

export const createEdgeHighlight = (edgeId, state = HIGHLIGHT_STATES.CURRENT, duration = ANIMATION_CONFIG.HIGHLIGHT_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.HIGHLIGHT_EDGE, { edgeId, state }, duration);
};

export const createFadeIn = (nodeId, duration = ANIMATION_CONFIG.DEFAULT_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.FADE_IN, { nodeId }, duration);
};

export const createFadeOut = (nodeId, duration = ANIMATION_CONFIG.DEFAULT_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.FADE_OUT, { nodeId }, duration);
};

export const createPulse = (nodeId, duration = ANIMATION_CONFIG.HIGHLIGHT_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.PULSE, { nodeId }, duration);
};

export const createShake = (nodeId, duration = ANIMATION_CONFIG.HIGHLIGHT_DURATION) => {
  return createAnimationStep(ANIMATION_TYPES.SHAKE, { nodeId }, duration);
};

export const generateSearchAnimation = (tree, value) => {
  const animations = [];
  animations.push(createStatusUpdate(`Searching for ${value}...`));
  
  let current = tree.root;
  const path = [];
  
  while (current) {
    path.push(current);
    animations.push(createNodeHighlight(current.id, HIGHLIGHT_STATES.SEARCHING));
    
    if (value === current.value) {
      animations.push(createStatusUpdate(`Found ${value}!`));
      animations.push(createNodeHighlight(current.id, HIGHLIGHT_STATES.FOUND));
      break;
    } else if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  
  if (!current) {
    animations.push(createStatusUpdate(`${value} not found in the tree`));
  }
  
  return animations;
};

export const generateInsertionAnimation = (tree, value) => {
  const animations = [];
  animations.push(createStatusUpdate(`Inserting ${value}...`));
  
  if (!tree.root) {
    animations.push(createStatusUpdate(`Creating root node with value ${value}`));
    return animations;
  }
  
  let current = tree.root;
  const path = [];
  
  while (current) {
    path.push(current);
    animations.push(createNodeHighlight(current.id, HIGHLIGHT_STATES.SEARCHING));
    
    if (value < current.value) {
      if (!current.left) {
        animations.push(createStatusUpdate(`Inserting ${value} as left child of ${current.value}`));
        break;
      }
      current = current.left;
    } else if (value > current.value) {
      if (!current.right) {
        animations.push(createStatusUpdate(`Inserting ${value} as right child of ${current.value}`));
        break;
      }
      current = current.right;
    } else {
      animations.push(createStatusUpdate(`Value ${value} already exists in the tree`));
      return animations;
    }
  }
  
  animations.push(createStatusUpdate(`Successfully inserted ${value}`));
  return animations;
};

export const generateDeletionAnimation = (tree, value) => {
  const animations = [];
  animations.push(createStatusUpdate(`Searching for ${value} to delete...`));
  
  let current = tree.root;
  const path = [];
  
  while (current && current.value !== value) {
    path.push(current);
    animations.push(createNodeHighlight(current.id, HIGHLIGHT_STATES.SEARCHING));
    
    if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  
  if (!current) {
    animations.push(createStatusUpdate(`${value} not found for deletion`));
    return animations;
  }
  
  animations.push(createNodeHighlight(current.id, HIGHLIGHT_STATES.DELETING));
  animations.push(createStatusUpdate(`Deleting ${value}...`));
  
  if (!current.left && !current.right) {
    animations.push(createStatusUpdate(`Deleting leaf node ${value}`));
  } else if (!current.left || !current.right) {
    animations.push(createStatusUpdate(`Deleting node ${value} with one child`));
  } else {
    animations.push(createStatusUpdate(`Deleting node ${value} with two children`));
  }
  
  animations.push(createStatusUpdate(`Successfully deleted ${value}`));
  return animations;
};

export const generateTraversalAnimation = (tree, traversalType) => {
  const animations = [];
  const result = [];
  
  animations.push(createStatusUpdate(`Starting ${traversalType} traversal...`));
  
  const traverse = (node, type) => {
    if (!node) return;
    
    if (type === 'preorder') {
      animations.push(createNodeHighlight(node.id, HIGHLIGHT_STATES.VISITED));
      result.push(node.value);
      traverse(node.left, type);
      traverse(node.right, type);
    } else if (type === 'inorder') {
      traverse(node.left, type);
      animations.push(createNodeHighlight(node.id, HIGHLIGHT_STATES.VISITED));
      result.push(node.value);
      traverse(node.right, type);
    } else if (type === 'postorder') {
      traverse(node.left, type);
      traverse(node.right, type);
      animations.push(createNodeHighlight(node.id, HIGHLIGHT_STATES.VISITED));
      result.push(node.value);
    }
  };
  
  traverse(tree.root, traversalType);
  
  animations.push(createStatusUpdate(`${traversalType} traversal complete: ${result.join(', ')}`));
  return { animations, result };
};

export const generateAVLRotationAnimation = (pivotNode, rotationType) => {
  const animations = [];
  
  animations.push(createStatusUpdate(`AVL Fix: ${rotationType} rotation needed`));
  animations.push(createNodeHighlight(pivotNode.id, HIGHLIGHT_STATES.PIVOT));
  
  if (pivotNode.left) {
    animations.push(createNodeHighlight(pivotNode.left.id, HIGHLIGHT_STATES.PIVOT));
  }
  if (pivotNode.right) {
    animations.push(createNodeHighlight(pivotNode.right.id, HIGHLIGHT_STATES.PIVOT));
  }
  
  animations.push(createStatusUpdate(`Performing ${rotationType} rotation...`));
  
  return animations;
};

export const generateRedBlackFixAnimation = (caseType, nodes) => {
  const animations = [];
  
  switch (caseType) {
    case 'case1':
      animations.push(createStatusUpdate('Fix-up (Case 1): Uncle is Red. Recoloring Parent, Uncle, and Grandparent.'));
      break;
    case 'case2':
      animations.push(createStatusUpdate('Fix-up (Case 2): Uncle is Black (Triangle). Performing rotation...'));
      break;
    case 'case3':
      animations.push(createStatusUpdate('Fix-up (Case 3): Uncle is Black (Line). Recoloring and rotating...'));
      break;
    default:
      animations.push(createStatusUpdate('Applying Red-Black tree fix-up...'));
  }
  
  nodes.forEach(node => {
    if (node) {
      animations.push(createNodeHighlight(node.id, HIGHLIGHT_STATES.CURRENT));
    }
  });
  
  return animations;
};

export const generateRepositionAnimation = (nodeUpdates) => {
  const animations = [];
  
  animations.push(createStatusUpdate('Repositioning nodes after rotation...'));
  animations.push(createNodeReposition(nodeUpdates));
  
  return animations;
};

export const generateColorChangeAnimation = (nodeId, newColor) => {
  const animations = [];
  
  animations.push(createNodeRecolor(nodeId, newColor));
  
  return animations;
};

export const combineAnimations = (...animationSequences) => {
  return animationSequences.flat();
};

export const addDelay = (animations, delay = 500) => {
  return animations.map((animation, index) => ({
    ...animation,
    delay: index * delay
  }));
};

export const createTimedSequence = (animations, baseDelay = 0) => {
  let currentTime = baseDelay;
  
  return animations.map(animation => {
    const timedAnimation = {
      ...animation,
      startTime: currentTime,
      endTime: currentTime + animation.duration
    };
    currentTime += animation.duration + 100; 
    return timedAnimation;
  });
};

export const validateAnimationStep = (step) => {
  const requiredFields = ['type', 'duration', 'timestamp'];
  const validTypes = Object.values(ANIMATION_TYPES);
  
  for (const field of requiredFields) {
    if (!(field in step)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  if (!validTypes.includes(step.type)) {
    return { valid: false, error: `Invalid animation type: ${step.type}` };
  }
  
  if (typeof step.duration !== 'number' || step.duration <= 0) {
    return { valid: false, error: 'Duration must be a positive number' };
  }
  
  return { valid: true };
};

export const getComplexityBasedDuration = (complexity) => {
  const baseDuration = ANIMATION_CONFIG.DEFAULT_DURATION;
  const complexityMultiplier = {
    'simple': 0.5,
    'medium': 1.0,
    'complex': 1.5,
    'very-complex': 2.0
  };
  
  return Math.round(baseDuration * (complexityMultiplier[complexity] || 1.0));
};

export const createTreeOperationSequence = (operation, tree, value) => {
  switch (operation) {
    case 'insert':
      return generateInsertionAnimation(tree, value);
    case 'delete':
      return generateDeletionAnimation(tree, value);
    case 'search':
      return generateSearchAnimation(tree, value);
    case 'inorder':
      return generateTraversalAnimation(tree, 'inorder');
    case 'preorder':
      return generateTraversalAnimation(tree, 'preorder');
    case 'postorder':
      return generateTraversalAnimation(tree, 'postorder');
    default:
      return [createStatusUpdate(`Unknown operation: ${operation}`)];
  }
};
