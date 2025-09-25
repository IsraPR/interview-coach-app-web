// src/pages/FeedbackPage.tsx

import { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSessionHistoryStore } from '@/store/slices/sessionHistorySlice';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import { useShallow } from 'zustand/react/shallow';
import SessionList from '@/components/feedback/SessionList';
import SessionDetailView from '@/components/feedback/SessionDetailView';
import styles from './FeedbackPage.module.css';

const FeedbackPage = () => {
  const location = useLocation();
  // Check if we arrived here from an interview page redirect
  const isFreshlyRedirected = location.state?.fromInterview === true;

  const { sessions, listStatus, fetchSessions } = useSessionHistoryStore(
    useShallow((state) => ({
      sessions: state.sessions,
      listStatus: state.listStatus,
      fetchSessions: state.fetchSessions,
    }))
  );
  const currentProfileId = useJobProfileStore((state) => state.currentProfileId);
  
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  // Start in polling mode if we were just redirected
  const [isPolling, setIsPolling] = useState(isFreshlyRedirected);
  // Use a ref to store the session count before the new one arrives
  const initialSessionCount = useRef(0);

  // Effect to fetch initial data
  useEffect(() => {
    if (currentProfileId) {
      fetchSessions(currentProfileId).then(() => {
        // If we were redirected, we need to know how many sessions there were *before* the new one.
        if (isFreshlyRedirected) {
          initialSessionCount.current = useSessionHistoryStore.getState().sessions.length;
        }
      });
    }
  }, [currentProfileId, fetchSessions, isFreshlyRedirected]);

  // Effect for polling logic
  useEffect(() => {
    // Only run this effect if we are in polling mode and have a profile ID
    if (!isPolling || !currentProfileId) return;

    const interval = setInterval(async () => {
      console.log('Polling for new session feedback...');
      await fetchSessions(currentProfileId);
      const newSessions = useSessionHistoryStore.getState().sessions;

      // Check if a new session has appeared in the list
      if (newSessions.length > initialSessionCount.current) {
        console.log('New session found! Stopping poll.');
        setIsPolling(false); // Stop polling
        // Automatically select the newest session (assuming the API returns it first)
        if (newSessions[0]) {
          setSelectedSessionId(newSessions[0].id);
        }
      }
    }, 3000); // Poll every 3 seconds

    // Safety timeout: stop polling after 30 seconds regardless
    const timeout = setTimeout(() => {
      console.log('Polling timed out.');
      setIsPolling(false);
    }, 30000);

    // Cleanup function to stop the timers when the component unmounts or polling stops
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isPolling, currentProfileId, fetchSessions]);

  // Effect to automatically select the first session when the list loads (and we are not polling)
  useEffect(() => {
    if (!isPolling && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId, isPolling]);

  const renderContent = () => {
    // 1. Show the polling/generating feedback view first
    if (isPolling) {
      return (
        <div className={styles.centeredMessage}>
          <div className={styles.spinner}></div>
          <h2>Generating your feedback report...</h2>
          <p>This may take a moment. Please wait.</p>
        </div>
      );
    }

    // 2. Handle prerequisite checks
    if (!currentProfileId) {
      return (
        <div className={styles.centeredMessage}>
          <h2>No Active Job Profile</h2>
          <p>Please select a job profile to view its session history.</p>
          <Link to="/profiles" className={styles.linkButton}>Go to Job Profiles</Link>
        </div>
      );
    }

    // 3. Handle loading and error states
    if (listStatus === 'loading') {
      return <div className={styles.centeredMessage}>Loading session history...</div>;
    }
    if (listStatus === 'error') {
      return <div className={styles.centeredMessage}>Error loading sessions.</div>;
    }

    // 4. Handle the empty state
    if (sessions.length === 0) {
      return (
        <div className={styles.centeredMessage}>
          <h2>No Completed Sessions</h2>
          <p>You have no completed interview sessions for this job profile yet.</p>
          <Link to="/interview" className={styles.linkButton}>Start a New Interview</Link>
        </div>
      );
    }

    // 5. Render the main master-detail layout
    return (
      <div className={styles.masterDetailLayout}>
        <aside className={styles.masterView}>
          <SessionList
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            onSessionSelect={setSelectedSessionId}
          />
        </aside>
        <main className={styles.detailView}>
          {selectedSessionId ? (
            <SessionDetailView sessionId={selectedSessionId} />
          ) : (
            <div className={styles.centeredMessage}>Select a session to view details.</div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Session Feedback</h1>
      {renderContent()}
    </div>
  );
};

export default FeedbackPage;