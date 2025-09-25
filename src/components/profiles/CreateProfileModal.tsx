import React, { useState } from 'react';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import JobProfileForm from './JobProfileForm';
import styles from './CreateProfileModal.module.css';
import type { CreateJobProfilePayload } from '@/types'; // Import the type

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProfile = useJobProfileStore((state) => state.createProfile);

  const handleSubmit = async (data: CreateJobProfilePayload) => { // Use the specific type
    setIsSubmitting(true);
    try {
      await createProfile(data);
      onClose();
    } catch (error) {
      console.error('Failed to create profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Create New Job Profile</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.content}>
          <JobProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default CreateProfileModal;