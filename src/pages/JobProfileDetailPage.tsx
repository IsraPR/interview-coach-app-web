import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobProfileStore } from '@/store/slices/jobProfileSlice';
import type { JobProfile, UpdateJobProfilePayload } from '@/types';
import * as jobProfileService from '@/services/jobProfileService';
import { useNotificationStore } from '@/store/slices/notificationSlice';
import JobProfileForm from '@/components/profiles/JobProfileForm';
import styles from './JobProfileDetailPage.module.css';

const JobProfileDetailPage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<JobProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchProfiles = useJobProfileStore((state) => state.fetchProfiles);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) return;
      setIsLoading(true);
      try {
        const data = await jobProfileService.getProfileById(Number(profileId));
        setProfile(data);
      } catch (error: any) {
        useNotificationStore.getState().showNotification(error.message, 'error');
        navigate('/profiles'); // Redirect back to the list if profile not found
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [profileId, navigate]);

  const handleUpdate = async (data: UpdateJobProfilePayload) => {
    if (!profileId) return;
    setIsSubmitting(true);
    try {
      const updatedProfile = await jobProfileService.updateProfile(Number(profileId), data);
      setProfile(updatedProfile); // Update local state with the new data
      setIsEditing(false); // Exit edit mode
      await fetchProfiles(); // Re-fetch the main list to update the card summary
      useNotificationStore.getState().showNotification('Profile updated successfully!', 'success');
    } catch (error: any) {
      useNotificationStore.getState().showNotification(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>{isEditing ? 'Edit Profile' : profile.profile_name}</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <JobProfileForm
          existingProfile={profile}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className={styles.detailsView}>
          <div className={styles.detailItem}>
            <strong>Target Role:</strong>
            <p>{profile.target_role}</p>
          </div>
          <div className={styles.detailItem}>
            <strong>Job Description:</strong>
            <pre className={styles.description}>{profile.job_description_text}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProfileDetailPage;