// src/pages/LiveInterviewPage.tsx

import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  const {
    connectionStatus,
    isRecording,
    transcript,
    startSession,
    stopSession,
  } = useNovaSpeech();

  const currentProfileId = useJobProfileStore((state) => state.currentProfileId);

  // --- THE CORE WORKFLOW ORCHESTRATION ---
  const handleSetupSubmit = async (data: SessionSetupPayload) => {
    if (!currentProfileId) {
      useNotificationStore.getState().showNotification('Cannot start: No job profile is set for the interview.', 'error');
      return;
    }

    setIsSubmitting(true);
    setPageState('LOADING');

    try {
      // Step 1: Create the session setup and get its ID
      const sessionSetup = await coachingSessionService.createSessionSetup(data);
      
      // Step 2: Use the setup ID to create the final session for the profile
      const sessionData = await coachingSessionService.createSessionForProfile(
        currentProfileId,
        { session_setup_id: sessionSetup.id }
      );

      // Step 3: Pass the final configuration to our speech hook to start the WebSocket session
      await startSession(sessionData);

    } catch (error: any) {
      useNotificationStore.getState().showNotification(error.message, 'error');
      setPageState('SETUP'); // Return to setup form on error
    } finally {
      setIsSubmitting(false);
    }
  };

  // This effect transitions from LOADING to IN_PROGRESS once the WebSocket is connected
  useEffect(() => {
    if (pageState === 'LOADING' && connectionStatus === 'CONNECTED') {
      setPageState('IN_PROGRESS');
    }
  }, [connectionStatus, pageState]);

  const handleMicButtonClick = () => {
    if (isRecording) {
      stopSession();
      setPageState('SETUP'); // Return to setup screen after stopping
    }
  };

  const renderContent = () => {
    if (!currentProfileId) {
      return (
        <div className={styles.prerequisiteNotice}>
          <FaExclamationTriangle size={40} className={styles.noticeIcon} />
          <h2>No Active Job Profile</h2>
          <p>Please select a job profile to use for this interview session.</p>
          <Link to="/profiles" className={styles.noticeButton}>
            Go to Job Profiles
          </Link>
        </div>
      );
    }

    switch (pageState) {
      case 'SETUP':
        return (
          <InterviewSetupForm
            isSubmitting={isSubmitting}
            onSubmit={handleSetupSubmit}
          />
        );
      
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