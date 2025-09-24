
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import type { JobProfile } from '@/types';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import styles from './JobProfileCard.module.css';
import { FaBriefcase, FaBullseye, FaCheckCircle, FaTrash } from 'react-icons/fa';
import DropdownMenu from '@/components/common/DropdownMenu';
import ConfirmationModal from '@/components/common/ConfirmationModal';

interface JobProfileCardProps {
  profile: JobProfile;
  isActive: boolean;
}

const JobProfileCard: React.FC<JobProfileCardProps> = ({ profile, isActive }) => {
  const navigate = useNavigate(); 
  const { setCurrentProfile, deleteProfile } = useJobProfileStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSetCurrent = () => setCurrentProfile(profile.id);
  const handleDelete = () => {
    deleteProfile(profile.id);
    setIsModalOpen(false);
  };
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if the click was on the dropdown menu
    if ((e.target as HTMLElement).closest(`.${styles.menuContainer}`)) {
      return;
    }
    navigate(`/profiles/${profile.id}`);
  };

  return (
    <>
      {/* 👇 Add the onClick handler to the main div */}
      <div className={`${styles.card} ${isActive ? styles.activeCard : ''}`} onClick={handleCardClick}>
        <div className={styles.cardTop}>
          {isActive && <div className={styles.activeBadge}>Active</div>}
          <div className={styles.menuContainer}>
            <DropdownMenu>
              <button onClick={handleSetCurrent} className={styles.menuItem} disabled={isActive}>
                <FaCheckCircle /> Set for live interview
              </button>
              <button onClick={() => setIsModalOpen(true)} className={`${styles.menuItem} ${styles.deleteItem}`}>
                <FaTrash /> Delete
              </button>
            </DropdownMenu>
          </div>
        </div>
        
        <div className={styles.cardHeader}>
          <FaBriefcase className={styles.icon} />
          <h3 className={styles.profileName}>{profile.profile_name}</h3>
        </div>
        
        <div className={styles.cardBody}>
          <div className={styles.detailItem}>
            <FaBullseye className={styles.detailIcon} />
            <p className={styles.targetRole}>{profile.target_role}</p>
          </div>
          <p className={styles.description}>
            {profile.job_description_text.substring(0, 100)}...
          </p>
        </div>
        
        <div className={styles.cardFooter}>
          <span>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Job Profile"
        message={`Are you sure you want to delete the "${profile.profile_name}" profile? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        confirmText="Delete"
      />
    </>
  );
};

export default JobProfileCard;