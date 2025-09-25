// src/components/feedback/SessionList.tsx

import React from 'react';
import type { SessionSummary } from '@/types';
import styles from './SessionList.module.css';

interface SessionListProps {
  sessions: SessionSummary[];
  selectedSessionId: number | null;
  onSessionSelect: (sessionId: number) => void;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, selectedSessionId, onSessionSelect }) => {
  return (
    <div className={styles.listContainer}>
      {sessions.map((session) => (
        <button
          key={session.id}
          className={`${styles.sessionCard} ${session.id === selectedSessionId ? styles.selected : ''}`}
          onClick={() => onSessionSelect(session.id)}
        >
          <div className={styles.cardHeader}>
            <strong>Session from {new Date(session.created_at).toLocaleString()}</strong>
            <span className={styles.rating}>Rating: {session.session_feedback.final_rating}/100</span>
          </div>
          <p className={styles.summary}>
            {session.session_feedback.general_feedback}
          </p>
        </button>
      ))}
    </div>
  );
};

export default SessionList;