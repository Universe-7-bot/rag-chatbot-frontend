import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="loading-indicator">
      <div className="loading-indicator__avatar">
        <div className="loading-indicator__bot"></div>
      </div>
      <div className="loading-indicator__content">
        <div className="loading-indicator__dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Searching recent news...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;