import React from 'react';

interface ErrorBannerProps {
  message: string | null;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  if (!message) {
    return null; // Don't render anything if there's no message
  }

  return (
    <div
      style={{
        backgroundColor: '#ffdddd',
        border: '1px solid #f44336',
        color: '#f44336',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '4px',
      }}
    >
      {message}
    </div>
  );
};

export default ErrorBanner;