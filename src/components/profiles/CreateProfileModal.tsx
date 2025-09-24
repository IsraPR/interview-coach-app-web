import React, { useState } from 'react';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import JobProfileForm from './JobProfileForm';
import styles from './CreateProfileModal.module.css';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createProfile = useJobProfileStore((state) => state.createProfile);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createProfile(data);
      onClose(); // Close the modal on success
    } catch (error) {
      // The error notification is already handled in the slice
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
        <JobProfileForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateProfileModal;