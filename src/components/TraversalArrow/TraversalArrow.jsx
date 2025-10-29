import React from 'react';
import PropTypes from 'prop-types';
import styles from './TraversalArrow.module.css';

function TraversalArrow({ x, y, visible }) {
  if (!visible) return null;

  return (
    <div
      className={styles.traversalArrow}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      →
    </div>
  );
}

export default TraversalArrow;

TraversalArrow.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};
