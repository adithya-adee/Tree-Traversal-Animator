import React from 'react';
import styles from './TraversalArrow.module.css';

const TraversalArrow = ({ x, y, visible }) => {
  if (!visible) return null;

  return (
    <div
      className={styles.traversalArrow}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      →
    </div>
  );
};

export default TraversalArrow;
