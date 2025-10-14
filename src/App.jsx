import React, { useState, useRef, useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { BST } from './logic/tree.js';
import { logInput, logBackend, logInfo } from './logic/logger.js';
import { createGIFFromTree, exportTreeAsPNG, exportTreeAsSVG, exportTreeAsJPEG } from './logic/gifExport.js';
import ControlPanel from './components/ControlPanel/ControlPanel.jsx';
import VisualizationCanvas from './components/VisualizationCanvas/VisualizationCanvas.jsx';
import StatusBar from './components/StatusBar/StatusBar.jsx';
import './index.css';

function App() {
  const [treeInstance, setTreeInstance] = useState(new BST());
  const [treeData, setTreeData] = useState({ nodes: [], edges: [] });
  const [treeType, setTreeType] = useState('BST');
  const [animationQueue, setAnimationQueue] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to start');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [currentAnimationStep, setCurrentAnimationStep] = useState(null);
  const [statusFeed, setStatusFeed] = useState([]);
  const [statusTitle, setStatusTitle] = useState('');
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  
  const captureRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const currentAnimationIndex = useRef(0);

  useEffect(() => {
    const newTreeData = treeInstance.getTreeData();
    setTreeData(newTreeData);
  }, [treeInstance]);


  const executeAnimation = useCallback(() => {
    if (animationQueue.length === 0 || currentAnimationIndex.current >= animationQueue.length) {
      setIsAnimating(false);
      setIsTraversing(false);
      setStatusMessage('Animation complete');
      currentAnimationIndex.current = 0;
      setCurrentAnimationStep(null);
      setCurrentValue(null);
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
      case 'recolor-node':
        const nodeToRecolor = findNodeById(currentStep.nodeId);
        if (nodeToRecolor) {
          nodeToRecolor.color = currentStep.color;
          setTreeData(treeInstance.getTreeData());
        }
        setCurrentAnimationStep(currentStep);
        break;
      case 'show-value':
        setCurrentValue(currentStep.value);
        setStatusFeed(prev => [...prev, String(currentStep.value)]);
        setCurrentAnimationStep(currentStep);
        break;
      case 'reposition':
        currentStep.nodeUpdates.forEach(update => {
          const node = findNodeById(update.nodeId);
          if (node) {
            node.x = update.newX;
            node.y = update.newY;
          }
        });
        setTreeData(treeInstance.getTreeData());
        setCurrentAnimationStep(currentStep);
        break;
      default:
        console.log('Unknown animation type:', currentStep.type);
    }

    currentAnimationIndex.current++;
    
    const stepDuration = currentStep.duration || animationSpeed;
    animationTimeoutRef.current = setTimeout(() => {
      executeAnimation();
    }, stepDuration);
  }, [animationQueue, animationSpeed, treeInstance]);

  useEffect(() => {
    if (!isAnimating) return;
    if (animationQueue.length === 0) return;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    currentAnimationIndex.current = 0;
    executeAnimation();
  }, [animationQueue, isAnimating, executeAnimation]);


  const findNodeById = (nodeId) => {
    const findInTree = (node) => {
      if (!node) return null;
      if (node.id === nodeId) return node;
      return findInTree(node.left) || findInTree(node.right);
    };
    return findInTree(treeInstance.root);
  };

  const handleTreeTypeChange = useCallback((newType) => {
    if (isAnimating) return;
    
    setUndoStack([]);
    setRedoStack([]);
    
    const newTree = new BST();
    
    setTreeInstance(newTree);
    setTreeData(newTree.getTreeData()); 
    setTreeType(newType);
    setStatusMessage(`Switched to ${newType} tree`);
  }, [isAnimating]);

  const handleInsert = useCallback((value) => {
    if (isAnimating) return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setStatusMessage('Please enter a valid number');
      logInput('Insert rejected (invalid number)');
      return;
    }
    
    setUndoStack(prev => [...prev, treeInstance.safeClone()]);
    setRedoStack([]);
    
    logInput(`Insert ${numValue}`);
    const result = treeInstance.insert(numValue);
    logBackend('Insert produced animation steps', { steps: result.animations.length });
    
    flushSync(() => {
      setTreeInstance(result.tree);
      
      const freshTreeData = result.tree.getTreeData();
      setTreeData(freshTreeData);
      
      setAnimationQueue(result.animations);
    });
    
    setIsAnimating(true);
    setCurrentAnimationStep(null);
    setCurrentValue(null);
  }, [isAnimating, treeInstance, executeAnimation]);

  const handleDelete = useCallback((value) => {
    if (isAnimating) return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setStatusMessage('Please enter a valid number');
      logInput('Delete rejected (invalid number)');
      return;
    }
    
    setUndoStack(prev => [...prev, treeInstance.safeClone()]);
    setRedoStack([]);
    
    logInput(`Delete ${numValue}`);
    const result = treeInstance.delete(numValue);
    logBackend('Delete produced animation steps', { steps: result.animations.length });
    setTreeData(result.tree.getTreeData());
    setAnimationQueue(result.animations);
    
    setIsAnimating(true);
    setCurrentAnimationStep(null);
    setCurrentValue(null);
  }, [isAnimating, treeInstance, executeAnimation]);

  const handleSearch = useCallback((value) => {
    if (isAnimating) return;
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setStatusMessage('Please enter a valid number');
      logInput('Search rejected (invalid number)');
      return;
    }
    
    logInput(`Search ${numValue}`);
    const result = treeInstance.search(numValue);
    logBackend('Search produced animation steps', { steps: result.animations.length });
    setAnimationQueue(result.animations);
    
    setIsAnimating(true);
    setCurrentAnimationStep(null);
    setCurrentValue(null);
  }, [isAnimating, treeInstance, executeAnimation]);

  const handleTraverse = useCallback((traversalType) => {
    if (isAnimating) return;
    
    logInput(`Traverse ${traversalType}`);
    setIsTraversing(true);
    setCurrentValue(null);
    setStatusFeed([]);
    setStatusTitle(traversalType.charAt(0).toUpperCase() + traversalType.slice(1) + ':');
    
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
    
    setAnimationQueue(result.animations);
    logBackend(`${traversalType} produced animation steps`, { steps: result.animations.length });
    
    setIsAnimating(true);
    setCurrentAnimationStep(null);
    setCurrentValue(null);
  }, [isAnimating, treeInstance, executeAnimation]);

  const handleUndo = useCallback(() => {
    if (isAnimating || undoStack.length === 0) return;
    logInput('Undo');
    
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, treeInstance.safeClone()]);
    setUndoStack(prev => prev.slice(0, -1));
    setTreeInstance(previousState);
    setTreeData(previousState.getTreeData()); 
    setStatusMessage('Undone');
  }, [isAnimating, undoStack, treeInstance]);

  const handleRedo = useCallback(() => {
    if (isAnimating || redoStack.length === 0) return;
    logInput('Redo');
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, treeInstance.safeClone()]);
    setRedoStack(prev => prev.slice(0, -1));
    setTreeInstance(nextState);
    setTreeData(nextState.getTreeData()); 
    setStatusMessage('Redone');
  }, [isAnimating, redoStack, treeInstance]);

  const handleClear = useCallback(() => {
    if (isAnimating) return;
    logInput('Clear tree');
    
    setUndoStack(prev => [...prev, treeInstance.safeClone()]);
    setRedoStack([]);
    
    const newTree = new BST();
    
    setTreeInstance(newTree);
    setTreeData(newTree.getTreeData()); 
    setStatusMessage('Tree cleared');
    logBackend('Tree cleared');
  }, [isAnimating, treeInstance, treeType]);


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
    
    setStatusMessage('Exporting GIF...');
    
    try {
      await createGIFFromTree(captureRef);
      setStatusMessage('GIF exported successfully!');
    } catch (error) {
      setStatusMessage('Error exporting GIF: ' + error.message);
    }
  }, [isAnimating]);

  const handleExportPNG = useCallback(async () => {
    if (isAnimating) {
      setStatusMessage('Cannot export while animating');
      return;
    }
    
    setStatusMessage('Exporting PNG...');
    
    try {
      await exportTreeAsPNG(captureRef);
      setStatusMessage('PNG exported successfully!');
    } catch (error) {
      setStatusMessage('Error exporting PNG: ' + error.message);
    }
  }, [isAnimating]);

  const handleExportSVG = useCallback(async () => {
    if (isAnimating) {
      setStatusMessage('Cannot export while animating');
      return;
    }
    
    setStatusMessage('Exporting SVG...');
    
    try {
      await exportTreeAsSVG(captureRef);
      setStatusMessage('SVG exported successfully!');
    } catch (error) {
      setStatusMessage('Error exporting SVG: ' + error.message);
    }
  }, [isAnimating]);

  const handleExportJPEG = useCallback(async () => {
    if (isAnimating) {
      setStatusMessage('Cannot export while animating');
      return;
    }
    
    setStatusMessage('Exporting JPEG...');
    
    try {
      await exportTreeAsJPEG(captureRef);
      setStatusMessage('JPEG exported successfully!');
    } catch (error) {
      setStatusMessage('Error exporting JPEG: ' + error.message);
    }
  }, [isAnimating]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>SOFTWARE ENGINEERING (IT303) COURSE PROJECT TITLE: TREE TRAVERSAL VISUALIZER</h1>

        <h2>Carried By:</h2>
        <div className="carried-by">
          <div className='carried-by-name'>Adithya A (231IT002)</div>
          <div className='carried-by-name'>Anshu Kumar (231IT009)</div>
          <div className='carried-by-name'>Naman Sinha (231IT041)</div>
        </div>
      </header>
      
      <main className="app-main">
        <ControlPanel
          isAnimating={isAnimating}
          onTreeTypeChange={handleTreeTypeChange}
          onInsert={handleInsert}
          onDelete={handleDelete}
          onSearch={handleSearch}
          onTraverse={handleTraverse}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          onSpeedChange={handleSpeedChange}
          onExportGif={handleExportGif}
          isTraversing={isTraversing}
          undoDisabled={undoStack.length === 0}
          redoDisabled={redoStack.length === 0}
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
