import React from 'react';
import { usePrivacyPolicyVM } from '../../viewmodels/PrivacyPolicy/usePrivacyPolicyVM';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  const { policy, loading, error } = usePrivacyPolicyVM();
  
  if (loading) return <div>Loading privacy policy...</div>;
  if (error) return <div>Error loading privacy policy: {error}</div>;
  
  return (
    <div className="privacy-policy-page">
      <h1>Privacy Policy</h1>
      <div className="policy-meta">
        <span>Version: {policy.version}</span>
        <span>Last Updated: {new Date(policy.updatedAt).toLocaleDateString()}</span>
      </div>
      <div className="policy-content" dangerouslySetInnerHTML={{ __html: policy.content }} />
      
      <section className="data-rights-section">
        <h2>Your Data Rights</h2>
        <p>Under GDPR, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Restrict processing</li>
          <li>Data portability</li>
          <li>Object to processing</li>
        </ul>
        
        <div className="action-buttons">
          <a href="/data-rights" className="btn btn-primary">Exercise Your Rights</a>
          <a href="/privacy-policy/history" className="btn btn-secondary">View Policy History</a>
        </div>
      </section>
      
      <section className="non-user-info">
        <h3>For Non-System Users</h3>
        <p>
          If your personal data appears in our system but you are not a registered user 
          (e.g., as vessel crew member), you can exercise your rights by contacting us at:
        </p>
        <p><strong>Email:</strong> privacy@portlogix-system.com</p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;