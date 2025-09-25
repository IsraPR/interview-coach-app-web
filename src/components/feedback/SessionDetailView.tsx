// src/components/feedback/SessionDetailView.tsx

import React, { useEffect } from 'react';
import { useSessionHistoryStore } from '@/store/slices/sessionHistorySlice';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import { useShallow } from 'zustand/react/shallow';
import styles from './SessionDetailView.module.css';
import { FaCheckCircle, FaExclamationTriangle, FaUser, FaRobot } from 'react-icons/fa';

interface SessionDetailViewProps {
  sessionId: number;
}

const SessionDetailView: React.FC<SessionDetailViewProps> = ({ sessionId }) => {
  const { selectedSessionDetail, detailStatus, fetchSessionDetail } = useSessionHistoryStore(
    useShallow((state) => ({
      selectedSessionDetail: state.selectedSessionDetail,
      detailStatus: state.detailStatus,
      fetchSessionDetail: state.fetchSessionDetail,
    }))
  );
  const currentProfileId = useJobProfileStore((state) => state.currentProfileId);

  useEffect(() => {
    if (currentProfileId) {
      fetchSessionDetail(currentProfileId, sessionId);
    }
  }, [sessionId, currentProfileId, fetchSessionDetail]);

  if (detailStatus === 'loading') {
    return <div className={styles.centered}>Loading session details...</div>;
  }

  // Also check for the nested session_feedback object for safety
  if (detailStatus === 'error' || !selectedSessionDetail || !selectedSessionDetail.session_feedback) {
    return <div className={styles.centered}>Could not load session details.</div>;
  }

  const { session_feedback, full_transcript } = selectedSessionDetail;

  return (
    <div className={styles.detailContainer}>
      <h2 className={styles.title}>Session Feedback</h2>
      
      <div className={styles.feedbackGrid}>
        <div className={`${styles.feedbackCard} ${styles.strengths}`}>
          <h3 className={styles.cardTitle}><FaCheckCircle /> Strengths</h3>
          {/* --- FIX #1 IS HERE --- */}
          <ul>
            {Array.isArray(session_feedback.strengths) && session_feedback.strengths.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className={`${styles.feedbackCard} ${styles.improvements}`}>
          <h3 className={styles.cardTitle}><FaExclamationTriangle /> Areas for Improvement</h3>
          {/* --- FIX #2 IS HERE --- */}
          <ul>
            {Array.isArray(session_feedback.areas_of_improvement) && session_feedback.areas_of_improvement.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className={styles.feedbackCard}>
        <h3 className={styles.cardTitle}>General Feedback</h3>
        {/* Add a safety check for the general feedback string as well */}
        <p>{session_feedback.general_feedback || 'No general feedback available.'}</p>
      </div>

      <h2 className={styles.title}>Full Transcript</h2>
      <div className={styles.transcriptContainer}>
        {Array.isArray(full_transcript) && full_transcript.map((entry, index) => (
          <div key={index} className={`${styles.transcriptEntry} ${styles[entry.role]}`}>
            <div className={styles.icon}>
              {entry.role === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className={styles.content}>
              <span className={styles.role}>{entry.role === 'user' ? 'You' : 'Coach'}</span>
              <p>{entry.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionDetailView;