import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ControlPanel.module.css';

function ControlPanel({
  isAnimating,
  treeType,
  onTreeTypeChange,
  onInsert,
  onDelete,
  onSearch,
  onTraverse,
  onUndo,
  onRedo,
  onClear,
  onStopAndReset,
  onSpeedChange,
  onExportGif,
  onExportImage,
  isTraversing,
  traversalCompleted,
  undoDisabled,
  redoDisabled,
  speed,
}) {
  const [insertValue, setInsertValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [imageFormat, setImageFormat] = useState('png');

  const handleTreeTypeChange = (e) => {
    const newType = e.target.value;
    onTreeTypeChange(newType);
  };

  const handleInsert = (e) => {
    e.preventDefault();
    if (insertValue.trim()) {
      onInsert(insertValue);
      setInsertValue('');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (deleteValue.trim()) {
      onDelete(deleteValue);
      setDeleteValue('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setSearchValue('');
    }
  };

  const handleTraverse = (traversalType) => {
    onTraverse(traversalType);
  };

  const handleSpeedChange = (e) => {
    const sliderValue = parseInt(e.target.value, 10);
    // Invert the value so higher slider = faster (lower delay)
    const actualSpeed = 2200 - sliderValue;
    onSpeedChange(actualSpeed);
  };

  return (
    <div className={styles.controlPanel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Tree Type</h3>
        <select
          className={styles.select}
          value={treeType}
          onChange={handleTreeTypeChange}
          disabled={isAnimating}
        >
          <option value="BST">Binary Search Tree</option>
          <option value="AVL">AVL Tree</option>
          <option value="RBTree">Red-Black Tree</option>
        </select>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Operations</h3>

        <div className={styles.operationGroup}>
          <form onSubmit={handleInsert} className={styles.form}>
            <input
              type="number"
              className={styles.input}
              placeholder="Value to insert"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              disabled={isAnimating}
              min="-9999"
              max="9999"
            />
            <button
              type="submit"
              className={`${styles.button} ${styles.insertButton}`}
              disabled={isAnimating || !insertValue.trim()}
            >
              Insert
            </button>
          </form>
        </div>

        <div className={styles.operationGroup}>
          <form onSubmit={handleDelete} className={styles.form}>
            <input
              type="number"
              className={styles.input}
              placeholder="Value to delete"
              value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)}
              disabled={isAnimating}
              min="-999"
              max="999"
            />
            <button
              type="submit"
              className={`${styles.button} ${styles.deleteButton}`}
              disabled={isAnimating || !deleteValue.trim()}
            >
              Delete
            </button>
          </form>
        </div>

        <div className={styles.operationGroup}>
          <form onSubmit={handleSearch} className={styles.form}>
            <input
              type="number"
              className={styles.input}
              placeholder="Value to search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={isAnimating}
              min="-999"
              max="999"
            />
            <button
              type="submit"
              className={`${styles.button} ${styles.searchButton}`}
              disabled={isAnimating || !searchValue.trim()}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Traversals</h3>
        <div className={styles.traversalButtons}>
          <button
            type="button"
            className={`${styles.button} ${styles.traversalButton}`}
            onClick={() => handleTraverse('inorder')}
            disabled={isAnimating}
          >
            Inorder
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.traversalButton}`}
            onClick={() => handleTraverse('preorder')}
            disabled={isAnimating}
          >
            Preorder
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.traversalButton}`}
            onClick={() => handleTraverse('postorder')}
            disabled={isAnimating}
          >
            Postorder
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>History</h3>
        <div className={styles.historyButtons}>
          <button
            type="button"
            className={`${styles.button} ${styles.historyButton}`}
            onClick={onUndo}
            disabled={isAnimating || undoDisabled}
          >
            Undo
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.historyButton}`}
            onClick={onRedo}
            disabled={isAnimating || redoDisabled}
          >
            Redo
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.clearButton}`}
            onClick={onClear}
            disabled={isAnimating}
          >
            Clear
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Settings</h3>
        <div className={styles.speedControl}>
          <label htmlFor="speed" className={styles.speedLabel}>
            Animation Speed:
            <input
              type="range"
              id="speed"
              className={styles.speedSlider}
              min="200"
              max="2000"
              step="100"
              value={2200 - speed}
              onChange={handleSpeedChange}
              disabled={isAnimating}
            />
          </label>
          <span className={styles.speedValue}>{`${speed}ms`}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Export</h3>
        <div className={styles.exportButtons}>
          <div className={styles.imageExportGroup}>
            <select
              className={styles.formatSelect}
              value={imageFormat}
              onChange={(e) => setImageFormat(e.target.value)}
              disabled={isAnimating}
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="svg">SVG</option>
            </select>
            <button
              type="button"
              className={`${styles.button} ${styles.exportButton}`}
              onClick={() => onExportImage(imageFormat)}
              disabled={isAnimating}
            >
              📷 Export Image
            </button>
          </div>
          {traversalCompleted && !isTraversing && (
            <button
              type="button"
              className={`${styles.button} ${styles.exportButton} ${styles.gifButton}`}
              onClick={onExportGif}
              disabled={isAnimating}
            >
              🎬 Export Traversal GIF
            </button>
          )}
        </div>
      </div>

      {isAnimating && (
        <div className={styles.animatingOverlay}>
          <div className={styles.animatingSpinner} />
          <span>Animating...</span>
          {isTraversing && (
            <button
              type="button"
              className={`${styles.button} ${styles.stopButton}`}
              onClick={onStopAndReset}
            >
              ⏹ Stop & Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ControlPanel;

ControlPanel.propTypes = {
  isAnimating: PropTypes.bool.isRequired,
  treeType: PropTypes.string.isRequired,
  onTreeTypeChange: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onTraverse: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onStopAndReset: PropTypes.func.isRequired,
  onSpeedChange: PropTypes.func.isRequired,
  onExportGif: PropTypes.func.isRequired,
  onExportImage: PropTypes.func.isRequired,
  isTraversing: PropTypes.bool.isRequired,
  traversalCompleted: PropTypes.bool.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
};
