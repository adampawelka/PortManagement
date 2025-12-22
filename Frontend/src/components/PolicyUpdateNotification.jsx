import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PolicyUpdateNotification.css';

const PolicyUpdateNotification = ({ policyVersion, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleViewPolicy = () => {
    navigate('/privacy-policy');
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="policy-update-notification">
      <div className="notification-content">
        <div className="notification-icon">📄</div>
        <div className="notification-text">
          <strong>Privacy Policy Update</strong>
          <p>
            Our privacy policy has been updated to version {policyVersion}. 
            Please review the changes to understand how we handle your data.
          </p>
        </div>
        <div className="notification-actions">
          <button onClick={handleViewPolicy} className="btn btn-primary">
            Review Policy
          </button>
          <button onClick={handleDismiss} className="btn btn-secondary">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};