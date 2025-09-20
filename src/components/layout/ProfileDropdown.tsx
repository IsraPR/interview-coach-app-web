import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/store/slices/userSlice';
import { useAuthStore } from '@/store/slices/authSlice';
import { FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import styles from './ProfileDropdown.module.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Select state and actions
  const user = useUserStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.profileContainer} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.profileButton}>
        <FaUserCircle size={28} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {/* Conditionally render user info or a loading state */}
          {user ? (
            <div className={styles.userInfo}>
              <strong>{`${user.first_name} ${user.last_name}`}</strong>
              <span>{user.email}</span>
            </div>
          ) : (
            <div className={styles.userInfo}>
              <strong>Loading...</strong>
            </div>
          )}
          
          <ul className={styles.menuList}>
            <li>
              <Link to="/profile" className={styles.menuItem} onClick={() => setIsOpen(false)}>
                <FaUser className={styles.icon} />
                My Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.menuItem}>
                <FaSignOutAlt className={styles.icon} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;