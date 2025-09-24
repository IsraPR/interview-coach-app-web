import React, { useState, useEffect } from 'react';
import type { JobProfile, CreateJobProfilePayload } from '@/types';
import styles from './JobProfileForm.module.css';

interface JobProfileFormProps {
  // If an existing profile is passed, we're in "edit" mode
  existingProfile?: JobProfile;
  // The function to call when the form is submitted
  onSubmit: (data: CreateJobProfilePayload) => Promise<void>;
  // A flag to indicate if the submission is in progress
  isSubmitting: boolean;
}

const JobProfileForm: React.FC<JobProfileFormProps> = ({ existingProfile, onSubmit, isSubmitting }) => {
  const [profileName, setProfileName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // If we are in "edit" mode, pre-fill the form with the existing data
  useEffect(() => {
    if (existingProfile) {
      setProfileName(existingProfile.profile_name);
      setTargetRole(existingProfile.target_role);
      setJobDescription(existingProfile.job_description_text);
    }
  }, [existingProfile]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      profile_name: profileName,
      target_role: targetRole,
      job_description_text: jobDescription,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="profileName">Profile Name</label>
        <input
          id="profileName"
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="e.g., Senior Frontend Developer"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="targetRole">Target Role</label>
        <input
          id="targetRole"
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g., Frontend Engineer at a FAANG company"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={10}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Saving...' : (existingProfile ? 'Save Changes' : 'Create Profile')}
      </button>
    </form>
  );
};

export default JobProfileForm;