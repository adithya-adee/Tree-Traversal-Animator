import React, { useState } from 'react';
import styles from './ControlPanel.module.css';

const ControlPanel = ({
  isAnimating,
  onTreeTypeChange,
  onInsert,
  onDelete,
  onSearch,
  onTraverse,
  onUndo,
  onRedo,
  onClear,
  onSpeedChange,
  onExportGif,
  isTraversing,
  undoDisabled,
  redoDisabled
}) => {
  const [insertValue, setInsertValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTreeType, setSelectedTreeType] = useState('BST');

  const handleTreeTypeChange = (e) => {
    const newType = e.target.value;
    setSelectedTreeType(newType);
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
    const speed = parseInt(e.target.value);
    onSpeedChange(speed);
  };

  return (
    <div className={styles.controlPanel}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Tree Type</h3>
        <select
          className={styles.select}
          value={selectedTreeType}
          onChange={handleTreeTypeChange}
          disabled={isAnimating}
        >
          <option value="BST">Binary Search Tree</option>

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
              min="-999"
              max="999"
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
            className={`${styles.button} ${styles.traversalButton}`}
            onClick={() => handleTraverse('inorder')}
            disabled={isAnimating}
          >
            Inorder
          </button>
          <button
            className={`${styles.button} ${styles.traversalButton}`}
            onClick={() => handleTraverse('preorder')}
            disabled={isAnimating}
          >
            Preorder
          </button>
          <button
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
            className={`${styles.button} ${styles.historyButton}`}
            onClick={onUndo}
            disabled={isAnimating || undoDisabled}
          >
            Undo
          </button>
          <button
            className={`${styles.button} ${styles.historyButton}`}
            onClick={onRedo}
            disabled={isAnimating || redoDisabled}
          >
            Redo
          </button>
          <button
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
          </label>
          <input
            type="range"
            id="speed"
            className={styles.speedSlider}
            min="200"
            max="2000"
            step="100"
            defaultValue="1000"
            onChange={handleSpeedChange}
            disabled={isAnimating}
          />
          <span className={styles.speedValue}>1000ms</span>
        </div>
      </div>

      {isTraversing && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Export Traversal</h3>
          <button
            className={`${styles.button} ${styles.exportButton}`}
            onClick={onExportGif}
            disabled={isAnimating}
          >
            Export Traversal GIF
          </button>
        </div>
      )}

      {isAnimating && (
        <div className={styles.animatingOverlay}>
          <div className={styles.animatingSpinner}></div>
          <span>Animating...</span>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
