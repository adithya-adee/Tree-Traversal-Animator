/**
 * Main Application Component
 *
 * This is the "brain" of the tree visualizer. It handles:
 * - Managing tree instances (BST, AVL, Red-Black)
 * - Animation queue and playback system
 * - State management for the entire app
 * - Undo/redo functionality
 * - Export features (PNG/GIF)
 *
 * The animation system works by:
 * 1. Tree operations generate "animation steps"
 * 2. Steps are queued and processed one by one
 * 3. Each step updates React state to trigger visual changes
 * 4. CSS handles the smooth transitions
 */
import React, {
  useState, useRef, useCallback, useEffect,
} from 'react';
import { flushSync } from 'react-dom';
import BST from './logic/tree';
import AVLTree from './logic/avl';
import RedBlackTree from './logic/redBlackTree';
import { logInput, logBackend } from './logic/logger';
import {
  createGIFFromLiveAnimation,
  exportTreeAsPNG,
  exportTreeAsSVG,
  exportTreeAsJPEG,
} from './logic/gifExport';
import ControlPanel from './components/ControlPanel/ControlPanel';
import VisualizationCanvas from './components/VisualizationCanvas/VisualizationCanvas';
import './index.css';

function App() {
  // Tree state
  const [treeType, setTreeType] = useState('BST'); // Current tree type (BST/AVL/RB)
  const [treeInstance, setTreeInstance] = useState(new BST()); // Actual tree object
  // Visualization data
  const [treeData, setTreeData] = useState({ nodes: [], edges: [] });

  // Animation state
  const [animationQueue, setAnimationQueue] = useState([]); // Animation steps
  const [isAnimating, setIsAnimating] = useState(false); // Currently animating?
  const [animationSpeed, setAnimationSpeed] = useState(1000); // Speed in ms
  const [currentAnimationStep, setCurrentAnimationStep] = useState(null);
  const [isTraversing, setIsTraversing] = useState(false); // Doing a traversal?

  // Status and UI state
  const [statusMessage, setStatusMessage] = useState('Ready to start');
  const [statusFeed, setStatusFeed] = useState([]); // History of messages
  const [statusTitle, setStatusTitle] = useState('');
  const [currentValue, setCurrentValue] = useState(null); // Value being operated on

  // Undo/Redo functionality
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Stop & Reset feature - save state before animations
  const [treeBeforeAnimation, setTreeBeforeAnimation] = useState(null);

  // GIF Export feature
  const [traversalCompleted, setTraversalCompleted] = useState(false);
  const [lastTraversalAnimations, setLastTraversalAnimations] = useState([]);
  const [isRecordingGif, setIsRecordingGif] = useState(false);

  // Refs for animation control and capturing
  const captureRef = useRef(null); // Reference to canvas div for export
  const animationTimeoutRef = useRef(null); // Timeout ID for cancelling
  const currentAnimationIndex = useRef(0); // Track position in queue
  const gifRecorderRef = useRef(null); // GIF recorder instance

  useEffect(() => {
    const newTreeData = treeInstance.getTreeData();
    setTreeData(newTreeData);
  }, [treeInstance]);

  const findNodeById = useCallback(
    (nodeId) => {
      const findInTree = (node) => {
        if (!node) return null;
        if (node.id === nodeId) return node;
        return findInTree(node.left) || findInTree(node.right);
      };
      return findInTree(treeInstance.root);
    },
    [treeInstance],
  );

  /**
   * Core animation engine - processes animation queue step by step
   *
   * This is where the magic happens! The function:
   * 1. Takes one animation step from the queue
   * 2. Applies it to the tree/UI
   * 3. Waits for the specified duration
   * 4. Recursively calls itself for next step
   *
   * Also handles GIF recording by capturing frames during animation
   */
  const executeAnimation = useCallback(async () => {
    // Base case: Animation complete
    if (
      animationQueue.length === 0
      || currentAnimationIndex.current >= animationQueue.length
    ) {
      setIsAnimating(false);
      const wasTraversing = isTraversing;
      const wasRecording = isRecordingGif;
      setIsTraversing(false);
      setStatusMessage('Animation complete');
      currentAnimationIndex.current = 0;
      setCurrentAnimationStep(null);
      setCurrentValue(null);

      // Mark traversal as completed for GIF export
      if (wasTraversing) {
        setTraversalCompleted(true);
      }

      // Finalize GIF if we were recording
      // This combines all captured frames into a final GIF file
      if (wasRecording && gifRecorderRef.current) {
        setStatusMessage('Rendering GIF...');
        try {
          await gifRecorderRef.current.finalize();
          setStatusMessage('GIF exported successfully!');
          logInput('GIF export successful');
        } catch (error) {
          setStatusMessage(`Error finalizing GIF: ${error.message}`);
          logBackend('GIF finalization failed', { error: error.message });
        }
        gifRecorderRef.current = null;
        setIsRecordingGif(false);
      }
      return;
    }

    const currentStep = animationQueue[currentAnimationIndex.current];

    switch (currentStep.type) {
      case 'update-status':
        setStatusMessage(currentStep.message);
        break;
      case 'highlight-node':
        setCurrentAnimationStep(currentStep);
        break;
      case 'recolor-node': {
        const nodeToRecolor = findNodeById(currentStep.nodeId);
        if (nodeToRecolor) {
          nodeToRecolor.color = currentStep.color;
          setTreeData(treeInstance.getTreeData());
        }
        setCurrentAnimationStep(currentStep);
        break;
      }
      case 'show-value':
        setCurrentValue(currentStep.value);
        setStatusFeed((prev) => [...prev, String(currentStep.value)]);
        setCurrentAnimationStep(currentStep);
        break;
      case 'reposition': {
        currentStep.nodeUpdates.forEach((update) => {
          const node = findNodeById(update.nodeId);
          if (node) {
            node.x = update.newX;
            node.y = update.newY;
          }
        });
        setTreeData(treeInstance.getTreeData());
        setCurrentAnimationStep(currentStep);
        break;
      }
      default:
        logBackend('Unknown animation type', { type: currentStep.type });
    }

    currentAnimationIndex.current += 1;

    // Capture frame if recording GIF
    if (isRecordingGif && gifRecorderRef.current) {
      // Wait a bit for DOM to update, then capture frame
      await new Promise((resolve) => { setTimeout(resolve, 100); });
      try {
        await gifRecorderRef.current.captureFrame(currentStep.duration || animationSpeed);
        setStatusMessage(`Capturing frame ${currentAnimationIndex.current}/${animationQueue.length}...`);
      } catch (error) {
        logBackend('Frame capture failed', { error: error.message });
      }
    }

    const stepDuration = isRecordingGif ? 150 : animationSpeed; // Faster when recording
    animationTimeoutRef.current = setTimeout(() => {
      executeAnimation();
    }, stepDuration);
  }, [animationQueue, animationSpeed, treeInstance, findNodeById, isTraversing, isRecordingGif]);

  useEffect(() => {
    if (!isAnimating) return;
    if (animationQueue.length === 0) return;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    currentAnimationIndex.current = 0;
    executeAnimation();
  }, [animationQueue, isAnimating, executeAnimation]);

  const handleTreeTypeChange = useCallback(
    (newType) => {
      if (isAnimating) return;

      setUndoStack([]);
      setRedoStack([]);

      let newTree;
      switch (newType) {
        case 'AVL':
          newTree = new AVLTree();
          break;
        case 'RBTree':
          newTree = new RedBlackTree();
          break;
        case 'BST':
        default:
          newTree = new BST();
          break;
      }

      setTreeType(newType);
      setTreeInstance(newTree);
      setTreeData(newTree.getTreeData());
      setStatusMessage(`Switched to ${newType} tree`);
      logInput(`Switched to ${newType}`);
    },
    [isAnimating],
  );

  const handleInsert = useCallback(
    (value) => {
      if (isAnimating) return;

      const numValue = parseInt(value, 10);
      if (Number.isNaN(numValue)) {
        setStatusMessage('Please enter a valid number');
        logInput('Insert rejected (invalid number)');
        return;
      }

      setUndoStack((prev) => [...prev, treeInstance.safeClone()]);
      setRedoStack([]);

      logInput(`Insert ${numValue}`);
      const result = treeInstance.insert(numValue);
      logBackend('Insert produced animation steps', {
        steps: result.animations.length,
      });

      flushSync(() => {
        // Save tree state before animation for rollback
        setTreeBeforeAnimation(treeInstance.safeClone());

        setTreeInstance(result.tree);

        const freshTreeData = result.tree.getTreeData();
        setTreeData(freshTreeData);

        setAnimationQueue(result.animations);
      });

      setIsAnimating(true);
      setCurrentAnimationStep(null);
      setCurrentValue(null);
    },
    [isAnimating, treeInstance],
  );

  const handleDelete = useCallback(
    (value) => {
      if (isAnimating) return;

      const numValue = parseInt(value, 10);
      if (Number.isNaN(numValue)) {
        setStatusMessage('Please enter a valid number');
        logInput('Delete rejected (invalid number)');
        return;
      }

      setUndoStack((prev) => [...prev, treeInstance.safeClone()]);
      setRedoStack([]);

      // Save tree state before animation for rollback
      setTreeBeforeAnimation(treeInstance.safeClone());

      logInput(`Delete ${numValue}`);
      const result = treeInstance.delete(numValue);
      logBackend('Delete produced animation steps', {
        steps: result.animations.length,
      });
      setTreeData(result.tree.getTreeData());
      setAnimationQueue(result.animations);

      setIsAnimating(true);
      setCurrentAnimationStep(null);
      setCurrentValue(null);
    },
    [isAnimating, treeInstance],
  );

  const handleSearch = useCallback(
    (value) => {
      if (isAnimating) return;

      const numValue = parseInt(value, 10);
      if (Number.isNaN(numValue)) {
        setStatusMessage('Please enter a valid number');
        logInput('Search rejected (invalid number)');
        return;
      }

      // Save tree state before animation for rollback
      setTreeBeforeAnimation(treeInstance.safeClone());

      logInput(`Search ${numValue}`);
      const result = treeInstance.search(numValue);
      logBackend('Search produced animation steps', {
        steps: result.animations.length,
      });
      setAnimationQueue(result.animations);

      setIsAnimating(true);
      setCurrentAnimationStep(null);
      setCurrentValue(null);
    },
    [isAnimating, treeInstance],
  );

  const handleTraverse = useCallback(
    (traversalType) => {
      if (isAnimating) return;

      logInput(`Traverse ${traversalType}`);
      setIsTraversing(true);
      setTraversalCompleted(false); // Reset for new traversal
      setCurrentValue(null);
      setStatusFeed([]);
      setStatusTitle(
        `${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)}:`,
      );

      let result;
      switch (traversalType) {
        case 'inorder':
          result = treeInstance.inorderTraversal();
          break;
        case 'preorder':
          result = treeInstance.preorderTraversal();
          break;
        case 'postorder':
          result = treeInstance.postorderTraversal();
          break;
        default:
          setStatusMessage('Unknown traversal type');
          setIsTraversing(false);
          logBackend('Traverse failed (unknown type)');
          return;
      }

      // Save tree state before animation for rollback
      setTreeBeforeAnimation(treeInstance.safeClone());

      // Save animations for GIF export
      setLastTraversalAnimations(result.animations);
      setAnimationQueue(result.animations);
      logBackend(`${traversalType} produced animation steps`, {
        steps: result.animations.length,
      });

      setIsAnimating(true);
      setCurrentAnimationStep(null);
      setCurrentValue(null);
    },
    [isAnimating, treeInstance],
  );

  const handleUndo = useCallback(() => {
    if (isAnimating || undoStack.length === 0) return;
    logInput('Undo');

    const previousState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev, treeInstance.safeClone()]);
    setUndoStack((prev) => prev.slice(0, -1));
    setTreeInstance(previousState);
    setTreeData(previousState.getTreeData());
    setStatusMessage('Undone');
  }, [isAnimating, undoStack, treeInstance]);

  const handleRedo = useCallback(() => {
    if (isAnimating || redoStack.length === 0) return;
    logInput('Redo');

    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev, treeInstance.safeClone()]);
    setRedoStack((prev) => prev.slice(0, -1));
    setTreeInstance(nextState);
    setTreeData(nextState.getTreeData());
    setStatusMessage('Redone');
  }, [isAnimating, redoStack, treeInstance]);

  const handleClear = useCallback(() => {
    if (isAnimating) return;
    logInput('Clear tree');

    setUndoStack((prev) => [...prev, treeInstance.safeClone()]);
    setRedoStack([]);

    const newTree = new BST();

    setTreeInstance(newTree);
    setTreeData(newTree.getTreeData());
    setStatusMessage('Tree cleared');
    logBackend('Tree cleared');
  }, [isAnimating, treeInstance]);

  const handleStopAndReset = useCallback(() => {
    if (!isAnimating) return;

    logInput('Stop & Reset animation');

    // Clear the animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    // Reset animation state
    setIsAnimating(false);
    setCurrentAnimationStep(null);
    setCurrentValue(null);
    setAnimationQueue([]);
    currentAnimationIndex.current = 0;
    setIsTraversing(false);
    setStatusFeed([]);
    setStatusTitle('');

    // Restore tree to state before animation
    if (treeBeforeAnimation) {
      setTreeInstance(treeBeforeAnimation);
      setTreeData(treeBeforeAnimation.getTreeData());
      setTreeBeforeAnimation(null);
      setStatusMessage('Animation stopped and reset');
      logBackend('Animation stopped, tree restored to pre-animation state');
    } else {
      setStatusMessage('Animation stopped');
      logBackend('Animation stopped');
    }
  }, [isAnimating, treeBeforeAnimation]);

  const handleSpeedChange = useCallback((speed) => {
    setAnimationSpeed(speed);
    setStatusMessage(`Animation speed set to ${speed}ms`);
    logInput(`Speed -> ${speed}ms`);
  }, []);

  const handleExportGif = useCallback(async () => {
    if (isAnimating) {
      setStatusMessage('Cannot export while animating');
      return;
    }

    if (!traversalCompleted || !lastTraversalAnimations.length || !treeBeforeAnimation) {
      setStatusMessage('Please complete a traversal first');
      return;
    }

    setStatusMessage('Preparing GIF export...');
    logInput('Starting GIF export');

    try {
      // Create GIF recorder
      const gifRecorder = await createGIFFromLiveAnimation(captureRef);
      gifRecorderRef.current = gifRecorder;

      // Restore tree to pre-animation state
      flushSync(() => {
        // Clone the tree before animation
        const restoredTree = treeBeforeAnimation.safeClone();
        setTreeInstance(restoredTree);
        setTreeData(restoredTree.getTreeData());
        setStatusFeed([]);
        setStatusTitle('');
        setCurrentValue(null);
        setCurrentAnimationStep(null);
      });

      // Capture initial frame
      await new Promise((resolve) => { setTimeout(resolve, 200); });
      await gifRecorder.captureFrame(500);

      // Set up animation queue and start recording
      setIsRecordingGif(true);
      setAnimationQueue(lastTraversalAnimations);
      currentAnimationIndex.current = 0;
      setIsAnimating(true);
      setIsTraversing(true);

      // The executeAnimation callback will handle frame capture
      // and finalization when animation completes
    } catch (error) {
      setStatusMessage(`Error exporting GIF: ${error.message}`);
      logBackend('GIF export failed', { error: error.message });
      gifRecorderRef.current = null;
      setIsRecordingGif(false);
      // eslint-disable-next-line no-console
      console.error('GIF export error:', error);
    }
  }, [isAnimating, traversalCompleted, lastTraversalAnimations, treeBeforeAnimation]);

  const handleExportImage = useCallback(async (format) => {
    if (isAnimating) {
      setStatusMessage('Cannot export while animating');
      return;
    }

    const formatUpper = format.toUpperCase();
    setStatusMessage(`Exporting ${formatUpper}...`);

    try {
      switch (format.toLowerCase()) {
        case 'png':
          await exportTreeAsPNG(captureRef);
          break;
        case 'svg':
          await exportTreeAsSVG(captureRef);
          break;
        case 'jpeg':
        case 'jpg':
          await exportTreeAsJPEG(captureRef);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      setStatusMessage(`${formatUpper} exported successfully!`);
      logInput(`${formatUpper} export successful`);
    } catch (error) {
      setStatusMessage(`Error exporting ${formatUpper}: ${error.message}`);
      logBackend(`${formatUpper} export failed`, { error: error.message });
    }
  }, [isAnimating]);

  useEffect(
    () => () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    },
    [],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          SOFTWARE ENGINEERING (IT303) COURSE PROJECT TITLE: TREE TRAVERSAL
          VISUALIZER
        </h1>
        <h2>Carried By:</h2>
        <div className="carried-by">
          <div className="carried-by-name">Adithya A (231IT002)</div>
          <div className="carried-by-name">Anshu Kumar (231IT009)</div>
          <div className="carried-by-name">Naman Sinha (231IT041)</div>
        </div>

      </header>
      <main className="app-main">
        <ControlPanel
          isAnimating={isAnimating}
          treeType={treeType}
          onTreeTypeChange={handleTreeTypeChange}
          onInsert={handleInsert}
          onDelete={handleDelete}
          onSearch={handleSearch}
          onTraverse={handleTraverse}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onStopAndReset={handleStopAndReset}
          onSpeedChange={handleSpeedChange}
          onExportGif={handleExportGif}
          onExportImage={handleExportImage}
          isTraversing={isTraversing}
          traversalCompleted={traversalCompleted}
          undoDisabled={undoStack.length === 0}
          redoDisabled={redoStack.length === 0}
          speed={animationSpeed}
        />

        <VisualizationCanvas
          treeData={treeData}
          captureRef={captureRef}
          animationQueue={animationQueue}
          currentAnimationIndex={currentAnimationIndex.current}
          currentAnimationStep={currentAnimationStep}
          currentValue={currentValue}
          statusMessage={statusMessage}
          statusFeed={statusFeed}
          statusTitle={statusTitle}
          onClearStatus={() => setStatusFeed([])}
        />
      </main>
    </div>
  );
}

export default App;
