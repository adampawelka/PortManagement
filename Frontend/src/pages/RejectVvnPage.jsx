import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';

const API_URL = 'http://localhost:5000/api/VesselVisitNotifications';

const RejectVvnPage = () => {
  const [notificationId, setNotificationId] = useState('');
  const [reason, setReason] = useState();
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
        status: "Rejected", // El nuevo estado
        Reason: reason,
        // Aquí iría DockId, si fuera obligatorio, pero lo omitimos para simplicidad.
    };
    
    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${API_URL}/${notificationId}/reject`, { // PUT /api/VVN/{id}
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(updateDto)
        });

        if (response.ok) {
            setMessage({ type: 'success', text: `Notification ${notificationId} rejected successfully!` });
            setNotificationId('');
        } else {
            const errorData = await response.json(); 
            setMessage({ type: 'error', text: `Approval failed: ${response.status} - ${errorData.Message || 'Check Backend logs.'}` });
        }
    } catch (err) {
        setMessage({ type: 'error', text: 'Network error or token failure.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Reject Notification </Typography>
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
        <TextField 
          label="Reason" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
          required 
          fullWidth 
          margin="normal"
        />
        
        <Button type="Reject" variant="contained" disabled={loading} sx={{ mt: 3, py: 1.5 }} fullWidth>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Reject'}
        </Button>


      </form>
    </Container>
  );
};

export default RejectVvnPage;