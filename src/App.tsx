import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate // 👈 1. Import useNavigate
} from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/slices/authSlice';
import { useShallow } from 'zustand/react/shallow';

// 👇 2. Create a new component for our main application content
const AppContent = () => {
  // Now we are inside a component that is a descendant of <Router>
  const navigate = useNavigate(); // 👈 3. Safely call the hook here

  const { token, logout } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      logout: state.logout,
    }))
  );

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true }); // 👈 4. Use the navigate function
  };

  return (
    <>
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

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
};

// 👇 5. The main App component now just sets up the Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;