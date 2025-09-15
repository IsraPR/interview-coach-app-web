import React from 'react';

interface SuccessBannerProps {
  message: string | null;
}

const SuccessBanner: React.FC<SuccessBannerProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        color: '#155724',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '4px',
      }}
    >
      {message}
    </div>
  );
};

export default SuccessBanner;