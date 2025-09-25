import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import LiveInterviewPage from '@/pages/LiveInterviewPage';
import JobProfilesPage from '@/pages/JobProfilesPage';
import JobProfileDetailPage from '@/pages/JobProfileDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import { useAuthStore } from '@/store/slices/authSlice';
import styles from './App.module.css';
import { useEffect } from 'react';
import ProfileDropdown from '@/components/layout/ProfileDropdown';
import { useUserStore } from '@/store/slices/userSlice';
import GlobalNotification from '@/components/common/GlobalNotification';

const AppContent = () => {
  const token = useAuthStore((state) => state.token);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);
  const clearUserProfile = useUserStore((state) => state.clearUserProfile);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      clearUserProfile();
    }
  }, [token, fetchUserProfile, clearUserProfile]);

  return (
    <div className={styles.rootLayout}>
      <GlobalNotification />
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          {token && (
            <>
              <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
              <Link to="/profiles" style={{ marginRight: '1rem' }}>Job Profiles</Link>
              <Link to="/interview" style={{ marginRight: '1rem' }}>Live Interview</Link>
            </>
          )}
        </div>
        <div>
          {!token ? <Link to="/login">Login</Link> : <ProfileDropdown />}
        </div>
      </nav>

      <main className={styles.mainContent}>
        <Routes>
          {token ? (
            // Logged-in routes
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/interview" element={<LiveInterviewPage />} />
              <Route path="/profiles" element={<JobProfilesPage />} />
              <Route path="/profiles/:profileId" element={<JobProfileDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // Logged-out routes
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;