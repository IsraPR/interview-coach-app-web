// src/components/interview/InterviewSetupForm.tsx

import React, { useState } from 'react';
import type { SessionSetupPayload } from '@/types';
import styles from './InterviewSetupForm.module.css';

interface InterviewSetupFormProps {
  isSubmitting: boolean;
  onSubmit: (data: SessionSetupPayload) => void;
}

const InterviewSetupForm: React.FC<InterviewSetupFormProps> = ({ isSubmitting, onSubmit }) => {
  const [interviewerName, setInterviewerName] = useState('Spaski');
  const [interviewerAttitude, setInterviewerAttitude] = useState('Friendly');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      interviewer_name: interviewerName,
      interviewer_attitude: interviewerAttitude,
      preferred_language: preferredLanguage,
    });
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.title}>Interview Setup</h3>
      <p className={styles.subtitle}>Configure the personality of your interviewer.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="interviewerName">Interviewer Name</label>
          <input
            id="interviewerName"
            type="text"
            value={interviewerName}
            onChange={(e) => setInterviewerName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="interviewerAttitude">Interviewer Attitude</label>
          <input
            id="interviewerAttitude"
            type="text"
            value={interviewerAttitude}
            onChange={(e) => setInterviewerAttitude(e.target.value)}
            placeholder="e.g., Skeptical, Enthusiastic, Formal"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="preferredLanguage">Language</label>
          <input
            id="preferredLanguage"
            type="text"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Starting Session...' : 'Start Interview'}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetupForm;