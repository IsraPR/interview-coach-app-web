import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import { useAuthStore } from '@/store/slices/authSlice';
import { useShallow } from 'zustand/react/shallow';
import styles from './App.module.css';

const AppContent = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      logout: state.logout,
    }))
  );

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.rootLayout}>
      <nav style={{ padding: '1rem', background: '#eee', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {token && (
            <Link to="/" style={{ marginRight: '1rem' }}>
              Home
            </Link>
          )}
        </div>
        <div>
          {!token ? (
            <Link to="/login">Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>

      <main className={styles.mainContent}>
        <Routes>
          {token ? (
            // If user IS logged in
            <>
              <Route path="/" element={<HomePage />} />
              {/* Add other protected routes here, e.g., /dashboard, /profile */}
              
              {/* 👇 This is a catch-all that redirects any invalid URL back to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // If user IS NOT logged in
            <>
              <Route path="/login" element={<LoginPage />} />

              {/* 👇 This is a catch-all that redirects any invalid URL to the login page */}
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