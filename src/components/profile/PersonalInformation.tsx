// src/components/profile/PersonalInformation.tsx

import React, { useState, useEffect } from 'react';
import { useUserStore } from '@/store/slices/userSlice';
import { useShallow } from 'zustand/react/shallow';
import styles from './ProfileSections.module.css';

const PersonalInformation = () => {
  const { user, status } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      status: state.status,
    }))
  );

  const [isEditing, setIsEditing] = useState(false);
  // Form state for editing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Call a new `updateUserProfile` action in the userSlice
    console.log('Saving user profile:', { firstName, lastName });
    alert('TODO: API endpoint for updating user profile is needed.');
    setIsEditing(false); // Exit edit mode for now
  };

  if (status === 'loading') {
    return <div>Loading personal information...</div>;
  }

  if (!user) {
    return <div>Could not load user information.</div>;
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.header}>
        <h2>Personal Information</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        // --- EDIT FORM ---
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.actionButton}>
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        // --- VIEW MODE ---
        <div className={styles.content}>
          <div className={styles.infoRow}>
            <span className={styles.label}>First Name</span>
            <span className={styles.value}>{user.first_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Last Name</span>
            <span className={styles.value}>{user.last_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{user.email}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;