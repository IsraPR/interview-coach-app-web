import { useEffect, useState } from 'react';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import { useShallow } from 'zustand/react/shallow';
import JobProfileCard from '@/components/profiles/JobProfileCard';
import EmptyState from '@/components/common/EmptyState';
import CreateProfileModal from '@/components/profiles/CreateProfileModal'; 
import styles from './JobProfilesPage.module.css';

const JobProfilesPage = () => {
  const { profiles, currentProfileId, status, fetchProfiles } = useJobProfileStore(
    useShallow((state) => ({
      profiles: state.profiles,
      currentProfileId: state.currentProfileId,
      status: state.status,
      fetchProfiles: state.fetchProfiles,
    }))
  );

  // State to control the modal's visibility
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const renderContent = () => {
    if (status === 'loading') {
      return <div>Loading profiles...</div>;
    }
    if (status === 'error') {
      return <div>Error fetching profiles. Please try again.</div>;
    }
    if (profiles.length === 0) {
      return (
        <EmptyState
          message="You don't have any job profiles yet. Create one to get started!"
          buttonText="Create New Profile"
          onButtonClick={() => setIsCreateModalOpen(true)} 
        />
      );
    }
    return (
      <div className={styles.grid}>
        {profiles.map((profile) => (
          <JobProfileCard
            key={profile.id}
            profile={profile}
            isActive={profile.id === currentProfileId}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1>Job Profiles To Practice</h1>
          {profiles.length > 0 && (
            <button onClick={() => setIsCreateModalOpen(true)} className={styles.createButton}>
              Create New
            </button>
          )}
        </div>
        {renderContent()}
      </div>
      
      {/* Render the modal outside the main layout */}
      <CreateProfileModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default JobProfilesPage;