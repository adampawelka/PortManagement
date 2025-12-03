import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';

const API_URL = 'http://localhost:5000/api/VesselVisitNotifications';

const SubmitVvnPage = () => {
  const [notificationId, setNotificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 
  const { getAccessTokenSilently } = useAuth0();

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!notificationId) {
        setMessage({ type: 'error', text: 'Notification ID is required.' });
        return;
    }
    
    setLoading(true);
    setMessage(null);

    // DTO para la actualización (asumo UpdatingVesselVisitNotificationDto)
    const updateDto = {
        status: "Submitted", // El nuevo estado
        // Aquí iría DockId, si fuera obligatorio, pero lo omitimos para simplicidad.
    };
    
    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_URL}/${notificationId}/submit`, { 
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(updateDto)
        });

        if (response.ok) {
            setMessage({ type: 'success', text: `Notification ${notificationId} submitted successfully!` });
            setNotificationId('');
        } else {
            const errorData = await response.json(); 
            setMessage({ type: 'error', text: `Submit failed: ${response.status} - ${errorData.Message || 'Check Backend logs.'}` });
        }
    } catch (err) {
        setMessage({ type: 'error', text: 'Network error or token failure.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Submit Notification (US 2.2.7)</Typography>
      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <form onSubmit={handleApprove}>
        <TextField 
          label="Notification ID (GUID)" 
          value={notificationId} 
          onChange={(e) => setNotificationId(e.target.value)}
          required 
          fullWidth 
          margin="normal"
        />

        <Button type="Submit" variant="contained" disabled={loading} sx={{ mt: 3, py: 1.5 }} fullWidth>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </form>
    </Container>
  );
};

export default SubmitVvnPage;