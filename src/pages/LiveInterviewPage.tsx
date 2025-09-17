// src/pages/LiveInterviewPage.tsx
import { useNovaSpeech } from '@/hooks/useNovaSpeech';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import styles from './LiveInterviewPage.module.css';

const LiveInterviewPage = () => {
  const {
    connectionStatus,
    isRecording,
    transcript,
    // error,
    startSession,
    stopSession,
  } = useNovaSpeech();

  const handleMicButtonClick = () => {
    if (isRecording) {
      stopSession();
    } else {
      // We only want to start a session if we are in a stable state
      if (connectionStatus === 'IDLE' || connectionStatus === 'CONNECTED' || connectionStatus === 'DISCONNECTED' || connectionStatus === 'ERROR') {
        startSession();
      }
    }
  };

  // --- THE FIX IS HERE ---
  // The button should only be disabled when the application is in a transient state.
  const isButtonDisabled = connectionStatus === 'CONNECTING';

  const buttonClass = isRecording
    ? `${styles.micButton} ${styles.micButtonRecording}`
    : `${styles.micButton} ${styles.micButtonReady}`;

  return (
    <div className={styles.liveInterviewPageContainer}>
      <h2>Live Interview Practice</h2>

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

    </div>
  );
};

export default LiveInterviewPage;