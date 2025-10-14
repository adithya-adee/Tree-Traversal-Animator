import React from 'react';
import styles from './Node.module.css';

const Node = ({ id, value, x, y, rbColor = 'red', highlightState = 'default', currentAnimationStep = null }) => {
  const getActualHighlightState = () => {
    if (currentAnimationStep && currentAnimationStep.type === 'highlight-node' && currentAnimationStep.nodeId === id) {
      return currentAnimationStep.state || 'current';
    }
    return highlightState;
  };

  const actualHighlightState = getActualHighlightState();

  const getNodeColor = () => {
    if (actualHighlightState === 'found') {
      return '#4CAF50'; 
    }
    if (actualHighlightState === 'current') {
      return '#2196F3'; 
    }
    if (actualHighlightState === 'visited') {
      return '#FF9800'; 
    }
    if (actualHighlightState === 'pivot') {
      return '#9C27B0'; 
    }
    if (actualHighlightState === 'path') {
      return '#607D8B';
    }
    if (actualHighlightState === 'searching') {
      return '#FF5722'; 
    }
    if (actualHighlightState === 'inserting') {
      return '#4CAF50'; 
    }
    if (actualHighlightState === 'deleting') {
      return '#F44336'; 
    }
    
    if (rbColor === 'black') {
      return '#333';
    }
    if (rbColor === 'red') {
      return '#F44336';
    }
    
    return '#667eea';
  };

  const getBorderColor = () => {
    if (actualHighlightState === 'found') {
      return '#2E7D32';
    }
    if (actualHighlightState === 'current') {
      return '#1565C0';
    }
    if (actualHighlightState === 'visited') {
      return '#E65100';
    }
    if (actualHighlightState === 'pivot') {
      return '#6A1B9A';
    }
    if (actualHighlightState === 'path') {
      return '#37474F';
    }
    if (actualHighlightState === 'searching') {
      return '#D84315';
    }
    if (actualHighlightState === 'inserting') {
      return '#388E3C';
    }
    if (actualHighlightState === 'deleting') {
      return '#C62828';
    }
    
    return '#667eea';
  };

  const getAnimationClass = () => {
    switch (actualHighlightState) {
      case 'current':
        return styles.current;
      case 'found':
        return styles.found;
      case 'visited':
        return styles.visited;
      case 'pivot':
        return styles.pivot;
      case 'path':
        return styles.path;
      case 'searching':
        return styles.searching;
      case 'inserting':
        return styles.inserting;
      case 'deleting':
        return styles.deleting;
      default:
        return styles.default;
    }
  };

  const nodeStyle = {
    left: `${x}px`,
    top: `${y}px`,
    backgroundColor: getNodeColor(),
    borderColor: getBorderColor(),
  };

  return (
    <div
      className={`${styles.node} ${getAnimationClass()}`}
      style={nodeStyle}
      data-node-id={id}
      data-value={value}
    >
      <span className={styles.nodeValue}>{value}</span>
      {rbColor && (
        <div className={`${styles.colorIndicator} ${styles[rbColor]}`}></div>
      )}
    </div>
  );
};

export default Node;
