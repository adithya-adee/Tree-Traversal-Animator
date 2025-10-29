import React from 'react';
import PropTypes from 'prop-types';
import styles from './StatusBar.module.css';

function StatusBar({
  message = 'Ready to start',
  size = 'normal',
  messages = [],
  onClear = null,
  title = '',
}) {
  return (
    <div
      className={`${styles.statusBar} ${size === 'large' ? styles.large : ''}`}
    >
      <div className={styles.statusContent}>
        <div className={styles.statusIcon}>
          <div className={styles.statusDot} />
        </div>
        <div className={`${styles.statusMessage} ${styles.messageList}`}>
          {title && (
            <span className={styles.messageItem}>
              <strong>{title}</strong>
            </span>
          )}
          {messages
            && messages.map((m) => (
              <span key={`msg-${m}`} className={styles.messageItem}>
                {m}
              </span>
            ))}
          {!messages || messages.length === 0 ? (
            <span className={styles.messageItem}>{message}</span>
          ) : null}
        </div>
        {onClear && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={onClear}
            aria-label="Clear status feed"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default StatusBar;

StatusBar.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'large']),
  messages: PropTypes.arrayOf(PropTypes.string),
  onClear: PropTypes.oneOfType([PropTypes.func, PropTypes.oneOf([null])]),
  title: PropTypes.string,
};

StatusBar.defaultProps = {
  message: 'Ready to start',
  size: 'normal',
  messages: [],
  onClear: null,
  title: '',
};
