// src/components/profile/ResumeSection.tsx

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/slices/userSlice';
import { useShallow } from 'zustand/react/shallow'; 
import type { ResumePayload } from '@/types';
import styles from './ProfileSections.module.css';

const ResumeSection = () => {
  const { resume, resumeStatus, saveResume } = useUserStore(
    useShallow((state) => ({
      resume: state.resume,
      resumeStatus: state.resumeStatus,
      saveResume: state.saveResume,
    }))
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [currentRole, setCurrentRole] = useState('');
  const [keySkills, setKeySkills] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (resume) {
      setCurrentRole(resume.current_role);
      setKeySkills(resume.key_skills.join(', '));
      setDescription(resume.description);
    } else {
      setCurrentRole('');
      setKeySkills('');
      setDescription('');
    }
  }, [resume, isEditing]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const payload: ResumePayload = {
      current_role: currentRole,
      key_skills: keySkills.split(',').map(skill => skill.trim()).filter(skill => skill),
      description: description,
    };

    try {
      await saveResume(payload);
      setIsEditing(false); 
    } catch (error) {
      // Error handling is done in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resumeStatus === 'loading') {
    return <div>Loading resume...</div>;
  }

  // If not editing and no resume exists, show the empty state
  if (!isEditing && !resume) {
    return (
      <div className={styles.sectionContainer}>
        <div className={styles.header}>
          <h2>Resume</h2>
        </div>
        <div className={styles.emptyContent}>
          <p>You haven't created a resume yet.</p>
          <button onClick={() => setIsEditing(true)} className={styles.actionButton}>
            Create Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.header}>
        <h2>Resume</h2>
        {!isEditing && resume && ( // Only show Edit button if there is a resume to edit
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            Edit
          </button>
        )}
      </div>
      
      {isEditing ? (
        // --- EDIT/CREATE FORM ---
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="currentRole">Current Role</label>
            <input id="currentRole" type="text" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="keySkills">Key Skills (comma-separated)</label>
            <input id="keySkills" type="text" value={keySkills} onChange={(e) => setKeySkills(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.actionButton}>
              {isSubmitting ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </form>
      ) : (
        // --- VIEW MODE ---
        <div className={styles.content}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Current Role</span>
            <span className={styles.value}>{resume?.current_role}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Key Skills</span>
            <div className={styles.skillsContainer}>
              {resume?.key_skills.map((skill, index) => <span key={index} className={styles.skillTag}>{skill}</span>)}
            </div>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Description</span>
            <p className={styles.value}>{resume?.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSection;