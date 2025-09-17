import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate, // We still need Navigate for the declarative redirect
} from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import LiveInterviewPage from '@/pages/LiveInterviewPage'; // 👈 1. Import the new page
import { useAuthStore } from '@/store/slices/authSlice';
import styles from './App.module.css';
import { useEffect } from 'react';
import ProfileDropdown from '@/components/layout/ProfileDropdown';
import { useUserStore } from '@/store/slices/userSlice';
import GlobalNotification from '@/components/common/GlobalNotification';
const AppContent = () => {  
  // We only need the token to decide which routes and nav items to show.
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
              <Link to="/" style={{ marginRight: '1rem' }}>
                Home
              </Link>
              {/* 👇 2. Add the navigation link to our new page */}
              <Link to="/interview" style={{ marginRight: '1rem' }}>
                Live Interview
              </Link>
            </>
          )}
        </div>
        <div>
          {!token ? (
            <Link to="/login">Login</Link>
          ) : (
            <ProfileDropdown />
          )}
        </div>
      </nav>

      <main className={styles.mainContent}>
        <Routes>
          {token ? (
            // If user IS logged in
            <>
              <Route path="/" element={<HomePage />} />
              {/* Add a placeholder for the future profile page */}
              <Route path="/profile" element={<div>My Profile Page</div>} />
              <Route path="/interview" element={<LiveInterviewPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // If user IS NOT logged in
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