import React, { useState } from 'react';
import { useDataRightsVM } from '../../viewmodels/PrivacyPolicy/useDataRightsVM';
import './DataRightsPage.css';

const DataRightsPage = () => {
  const { submitAccessRequest, submitRectificationRequest, submitDeletionRequest, loading, error, success } = useDataRightsVM();
  const [requestType, setRequestType] = useState('access');
  const [details, setDetails] = useState('');
  const [format, setFormat] = useState('json');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = { details, format };
    
    switch(requestType) {
      case 'access':
        await submitAccessRequest(requestData);
        break;
      case 'rectification':
        await submitRectificationRequest(requestData);
        break;
      case 'deletion':
        await submitDeletionRequest(requestData);
        break;
      default:
        break;
    }
  };

  return (
    <div className="data-rights-page">
      <h1>Exercise Your Data Rights</h1>
      
      {success && (
        <div className="alert alert-success">
          Your request has been submitted successfully. You will receive a confirmation email shortly.
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          Error submitting request: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="data-rights-form">
        <div className="form-group">
          <label>Request Type:</label>
          <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
            <option value="access">Access my data</option>
            <option value="rectification">Correct my data</option>
            <option value="deletion">Delete my data</option>
          </select>
        </div>
        
        {requestType === 'access' && (
          <div className="form-group">
            <label>Format:</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        )}
        
        <div className="form-group">
          <label>Additional Details:</label>
          <textarea 
            value={details} 
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please provide any additional information about your request..."
            rows={4}
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      
      <div className="info-section">
        <h3>What happens next?</h3>
        <ul>
          <li>Your request will be logged with a unique reference number</li>
          <li>You will receive an email acknowledgement within 24 hours</li>
          <li>We will process your request within 30 days as required by GDPR</li>
          <li>For data access requests, you'll receive your data in the requested format</li>
        </ul>
      </div>
    </div>
  );
};

export default DataRightsPage;