// src/pages/LiveInterviewPage.tsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNovaSpeech } from '@/hooks/useNovaSpeech';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import { useNotificationStore } from '@/store/slices/notificationSlice';
import * as coachingSessionService from '@/services/coachingSessionService';
import { FaMicrophone, FaStop, FaExclamationTriangle } from 'react-icons/fa';
import styles from './LiveInterviewPage.module.css';
import InterviewSetupForm from '@/components/interview/InterviewSetupForm';
import type { SessionSetupPayload } from '@/types';

type PageState = 'SETUP' | 'LOADING' | 'IN_PROGRESS';

const LiveInterviewPage = () => {
  const [pageState, setPageState] = useState<PageState>('SETUP');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    connectionStatus,
    isRecording,
    transcript,
    startSession,
    stopSession,
  } = useNovaSpeech();

  const currentProfileId = useJobProfileStore((state) => state.currentProfileId);

  const handleSetupSubmit = async (data: SessionSetupPayload) => {
    if (!currentProfileId) {
      useNotificationStore.getState().showNotification('Cannot start: No job profile is set for the interview.', 'error');
      return;
    }
    setIsSubmitting(true);
    setPageState('LOADING');
    try {
      const sessionSetup = await coachingSessionService.createSessionSetup(data);
      const sessionData = await coachingSessionService.createSessionForProfile(
        currentProfileId,
        { session_setup_id: sessionSetup.id }
      );
      await startSession(sessionData);
    } catch (error: any) {
      useNotificationStore.getState().showNotification(error.message, 'error');
      setPageState('SETUP');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (pageState === 'LOADING' && connectionStatus === 'CONNECTED') {
      setPageState('IN_PROGRESS');
    }
  }, [connectionStatus, pageState]);

  const handleMicButtonClick = async () => {
    if (isRecording) {
      await stopSession();
      // Navigate to the feedback page and pass a state flag.
      navigate('/feedback', { state: { fromInterview: true } });
    }
  };

  const renderContent = () => {
    if (!currentProfileId) {
      return (
        <div className={styles.prerequisiteNotice}>
          <FaExclamationTriangle size={40} className={styles.noticeIcon} />
          <h2>No Active Job Profile</h2>
          <p>Please select a job profile to use for this interview session.</p>
          <Link to="/profiles" className={styles.noticeButton}>Go to Job Profiles</Link>
        </div>
      );
    }

    switch (pageState) {
      case 'SETUP':
        return <InterviewSetupForm isSubmitting={isSubmitting} onSubmit={handleSetupSubmit} />;
      case 'LOADING':
        return (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Preparing your interview session...</p>
          </div>
        );
      case 'IN_PROGRESS':
        const isButtonDisabled = connectionStatus === 'CONNECTING';
        const buttonClass = isRecording
          ? `${styles.micButton} ${styles.micButtonRecording}`
          : `${styles.micButton} ${styles.micButtonReady}`;

        return (
          <>
            <div className={`${styles.statusIndicator} ${styles[`status${connectionStatus}`]}`}>
              {connectionStatus}
            </div>
            <div className={styles.transcriptBox}>
              {transcript || 'The interviewer\'s response will appear here...'}
            </div>
            <div className={styles.controls}>
              <button
                onClick={handleMicButtonClick}
                className={buttonClass}
                disabled={isButtonDisabled}
                aria-label={isRecording ? 'Stop speaking' : 'Start speaking'}
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className={styles.liveInterviewPageContainer}>
      <h2 className={styles.pageTitle}>Live Interview Practice</h2>
      {renderContent()}
    </div>
  );
};

export default LiveInterviewPage;