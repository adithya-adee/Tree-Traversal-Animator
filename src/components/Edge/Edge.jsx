import React from 'react';
import styles from './Edge.module.css';

const Edge = ({ fromX, fromY, toX, toY, type = 'left' }) => {
  const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
  
  const edgeStyle = {
    left: `${fromX}px`,
    top: `${fromY}px`,
    width: `${length}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 50%',
  };

  const getEdgeClass = () => {
    switch (type) {
      case 'left':
        return styles.leftEdge;
      case 'right':
        return styles.rightEdge;
      default:
        return styles.defaultEdge;
    }
  };

  return (
    <div
      className={`${styles.edge} ${getEdgeClass()}`}
      style={edgeStyle}
      data-edge-type={type}
    />
  );
};

export default Edge;
