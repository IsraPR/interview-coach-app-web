import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import styles from './DropdownMenu.module.css';

interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={styles.dropdownButton}>
        <FaEllipsisV />
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {/* This renders the menu items passed from the parent */}
          {React.Children.map(children, child =>
            React.cloneElement(child as React.ReactElement, {
              onClick: () => {
                (child as React.ReactElement).props.onClick();
                setIsOpen(false); // Close menu after an item is clicked
              },
            })
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;