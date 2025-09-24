import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className={styles.emptyStateContainer}>
      <FaFolderOpen className={styles.icon} size={60} />
      <p className={styles.message}>{message}</p>
      <button onClick={onButtonClick} className={styles.button}>
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyState;