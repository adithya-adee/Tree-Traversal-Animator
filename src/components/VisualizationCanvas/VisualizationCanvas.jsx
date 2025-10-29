import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Node from '../Node/Node';
import Edge from '../Edge/Edge';
import StatusBar from '../StatusBar/StatusBar';
import TraversalArrow from '../TraversalArrow/TraversalArrow';
import styles from './VisualizationCanvas.module.css';

function VisualizationCanvas({
  treeData,
  captureRef,
  currentAnimationStep,
  currentValue,
  statusMessage,
  statusFeed = [],
  statusTitle = '',
  onClearStatus = null,
}) {
  const containerRef = useRef(null);

  const renderNodes = () => {
    if (!treeData.nodes) return null;

    return treeData.nodes.map((node) => (
      <Node
        key={node.id}
        id={node.id}
        value={node.value}
        x={node.x}
        y={node.y}
        rbColor={node.color}
        highlightState="default"
        currentAnimationStep={currentAnimationStep}
        scale={node.scale || 1.0}
      />
    ));
  };

  const renderEdges = () => {
    if (!treeData.edges) return null;

    return treeData.edges.map((edge, index) => {
      const fromNode = treeData.nodes.find((n) => n.id === edge.from);
      const toNode = treeData.nodes.find((n) => n.id === edge.to);

      if (!fromNode || !toNode) return null;

      return (
        <Edge
          key={`${edge.from}-${edge.to}-${String(index)}`}
          fromX={fromNode.x}
          fromY={fromNode.y}
          toX={toNode.x}
          toY={toNode.y}
          type={edge.type}
          scale={fromNode.scale || 1.0}
        />
      );
    });
  };

  const renderTraversalArrow = () => {
    if (
      !currentAnimationStep
      || currentAnimationStep.type !== 'highlight-node'
    ) {
      return null;
    }

    const currentNode = treeData.nodes.find(
      (node) => node.id === currentAnimationStep.nodeId,
    );
    if (!currentNode) return null;

    return (
      <TraversalArrow
        x={currentNode.x}
        y={currentNode.y - 60}
        visible
      />
    );
  };

  return (
    <div className={styles.canvasContainer} ref={containerRef}>
      <div
        ref={captureRef}
        className={styles.canvas}
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
          <StatusBar
            message={statusMessage}
            messages={statusFeed}
            title={statusTitle}
            onClear={onClearStatus}
            size="large"
          />
        </div>
      </div>
    </div>
  );
}

export default VisualizationCanvas;

VisualizationCanvas.propTypes = {
  treeData: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.string,
      }),
    ),
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        type: PropTypes.string,
      }),
    ),
  }).isRequired,
  captureRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  currentAnimationStep: PropTypes.shape({
    type: PropTypes.string,
    nodeId: PropTypes.string,
    state: PropTypes.string,
  }),
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  statusMessage: PropTypes.string.isRequired,
  statusFeed: PropTypes.arrayOf(PropTypes.string),
  statusTitle: PropTypes.string,
  onClearStatus: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
};

VisualizationCanvas.defaultProps = {
  currentAnimationStep: null,
  currentValue: null,
  statusFeed: [],
  statusTitle: '',
  onClearStatus: null,
};
