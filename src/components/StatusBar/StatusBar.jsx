import React from 'react';
import styles from './StatusBar.module.css';

const StatusBar = ({ message = 'Ready to start', size = 'normal', messages = [], onClear = null, title = '' }) => {
  return (
    <div className={`${styles.statusBar} ${size === 'large' ? styles.large : ''}`}>
      <div className={styles.statusContent}>
        <div className={styles.statusIcon}>
          <div className={styles.statusDot}></div>
        </div>
        <div className={`${styles.statusMessage} ${styles.messageList}`}>
          {title && <span className={styles.messageItem}><strong>{title}</strong></span>}
          {messages && messages.map((m, idx) => (
            <span key={idx} className={styles.messageItem}>{m}</span>
          ))}
          {!messages || messages.length === 0 ? (
            <span className={styles.messageItem}>{message}</span>
          ) : null}
        </div>
        {onClear && (
          <button className={styles.clearBtn} onClick={onClear} aria-label="Clear status feed">Clear</button>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
