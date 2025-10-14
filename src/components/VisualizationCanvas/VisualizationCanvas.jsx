import React, { useMemo, useRef, useEffect, useState } from 'react';
import Node from '../Node/Node.jsx';
import Edge from '../Edge/Edge.jsx';
import StatusBar from '../StatusBar/StatusBar.jsx';
import TraversalArrow from '../TraversalArrow/TraversalArrow.jsx';
import styles from './VisualizationCanvas.module.css';

const VisualizationCanvas = ({ 
  treeData, 
  captureRef, 
  animationQueue, 
  currentAnimationIndex,
  currentAnimationStep,
  currentValue,
  statusMessage,
  statusFeed = [],
  statusTitle = '',
  onClearStatus = null
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const updateSize = () => {
      setContainerWidth(el.clientWidth);
      setContainerHeight(el.clientHeight);
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const canvasDimensions = useMemo(() => {
    if (!treeData.nodes || treeData.nodes.length === 0) {
      return { width: 800, height: 600 };
    }

    const nodes = treeData.nodes;
    const padding = 100;
    
    const minX = Math.min(...nodes.map(n => n.x)) - padding;
    const maxX = Math.max(...nodes.map(n => n.x)) + padding;
    const minY = Math.min(...nodes.map(n => n.y)) - padding;
    const maxY = Math.max(...nodes.map(n => n.y)) + padding;
    
    return {
      width: Math.max(800, maxX - minX),
      height: Math.max(600, maxY - minY),
      minX,
      minY
    };
  }, [treeData]);

  const rootCenterOffsetX = useMemo(() => {
    if (!treeData.nodes || treeData.nodes.length === 0 || containerWidth === 0) return 0;
    const rootNode = treeData.nodes[0]; 
    const rootXWithinCanvas = rootNode.x - (canvasDimensions.minX || 0);
    const desiredCenter = containerWidth / 2;
    return desiredCenter - rootXWithinCanvas;
  }, [treeData, canvasDimensions, containerWidth]);


  const renderNodes = () => {
    if (!treeData.nodes) return null;

    return treeData.nodes.map(node => {
      return (
        <Node
          key={node.id}
          id={node.id}
          value={node.value}
          x={(node.x - canvasDimensions.minX) + rootCenterOffsetX}
          y={node.y - canvasDimensions.minY}
          rbColor={node.color}
          highlightState="default"
          currentAnimationStep={currentAnimationStep}
        />
      );
    });
  };

  const renderEdges = () => {
    if (!treeData.edges) return null;

    return treeData.edges.map((edge, index) => {
      const fromNode = treeData.nodes.find(n => n.id === edge.from);
      const toNode = treeData.nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return null;

      return (
        <Edge
          key={`${edge.from}-${edge.to}-${index}`}
          fromX={(fromNode.x - canvasDimensions.minX) + rootCenterOffsetX}
          fromY={fromNode.y - canvasDimensions.minY}
          toX={(toNode.x - canvasDimensions.minX) + rootCenterOffsetX}
          toY={toNode.y - canvasDimensions.minY}
          type={edge.type}
        />
      );
    });
  };

  const renderTraversalArrow = () => {
    if (!currentAnimationStep || currentAnimationStep.type !== 'highlight-node') {
      return null;
    }

    const currentNode = treeData.nodes.find(node => node.id === currentAnimationStep.nodeId);
    if (!currentNode) return null;

    return (
      <TraversalArrow
        x={(currentNode.x - canvasDimensions.minX) + rootCenterOffsetX}
        y={currentNode.y - canvasDimensions.minY - 60}
        visible={true}
      />
    );
  };

  return (
    <div className={styles.canvasContainer} ref={containerRef}>
      <div 
        ref={captureRef}
        className={styles.canvas}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {treeData.nodes && treeData.nodes.length > 0 ? (
          <>
            {renderEdges()}
            {renderNodes()}
            {renderTraversalArrow()}
            {currentValue && (
              <div className={styles.currentValueDisplay}>
                <div className={styles.valueLabel}>Current Value:</div>
                <div className={styles.valueNumber}>{currentValue}</div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🌳</div>
            <h3 className={styles.emptyStateTitle}>No Tree Yet</h3>
            <p className={styles.emptyStateMessage}>
              Start by inserting some values to build your tree!
            </p>
          </div>
        )}
        <div className={styles.statusDock}>
          <StatusBar message={statusMessage} messages={statusFeed} title={statusTitle} onClear={onClearStatus} size="large" />
        </div>
      </div>
    </div>
  );
};

export default VisualizationCanvas;
