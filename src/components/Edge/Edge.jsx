import React from 'react';
import PropTypes from 'prop-types';
import styles from './Edge.module.css';

function Edge({
  fromX,
  fromY,
  toX,
  toY,
  type = 'left',
  scale = 1.0,
}) {
  const length = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

  const edgeStyle = {
    left: `${fromX}px`,
    top: `${fromY}px`,
    width: `${length}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 50%',
    '--edge-scale': scale,
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
}

export default Edge;

Edge.propTypes = {
  fromX: PropTypes.number.isRequired,
  fromY: PropTypes.number.isRequired,
  toX: PropTypes.number.isRequired,
  toY: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['left', 'right']),
  scale: PropTypes.number,
};

Edge.defaultProps = {
  type: 'left',
  scale: 1.0,
};
