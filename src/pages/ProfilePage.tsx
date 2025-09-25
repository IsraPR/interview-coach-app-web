import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/slices/userSlice';
import { useShallow } from 'zustand/react/shallow';
import styles from './ProfilePage.module.css';
import { FaUser, FaFileAlt } from 'react-icons/fa';

import PersonalInformation from '@/components/profile/PersonalInformation';
import ResumeSection from '@/components/profile/ResumeSection';

type ActiveTab = 'profile' | 'resume';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  const { fetchUserProfile, fetchResume } = useUserStore(
    useShallow((state) => ({
      fetchUserProfile: state.fetchUserProfile,
      fetchResume: state.fetchResume,
    }))
  );

  useEffect(() => {
    fetchUserProfile();
    fetchResume();
  }, [fetchUserProfile, fetchResume]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className={styles.icon} />
            Personal Information
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'resume' ? styles.active : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <FaFileAlt className={styles.icon} />
            Resume
          </button>
        </nav>
      </div>
      <main className={styles.content}>
        {activeTab === 'profile' && <PersonalInformation />}
        {activeTab === 'resume' && <ResumeSection />}
      </main>
    </div>
  );
};

export default ProfilePage;