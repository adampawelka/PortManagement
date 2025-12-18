import React from 'react';
import { Container, TextField, Typography, Alert } from '@mui/material';
import { useRejectVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useRejectVesselVisitNotificationVM';
import { LoadingButton, LoadingOverlay } from '../../components/LoadingComponents'; 

const RejectVVNPage = () => {
  const {
    notificationId,
    rejectionReason,
    loading,
    message,
    setNotificationId,
    setReason,
    handleReject,
  } = useRejectVesselVisitNotificationVM(); 

  return (
    <>
      <LoadingOverlay open={loading} message="Rejecting notification..." />
      <Container 
        maxWidth="sm" 
        sx={{ 
          mt: 4, 
          backgroundColor: 'var(--color-surface)', 
          p: 4, 
          borderRadius: 'var(--radius-md)', 
          boxShadow: 3,
          fontFamily: 'var(--font-family-base)',
        }}
      >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'var(--color-primary-light)', 
          fontWeight: 600, 
          mb: 3,
          fontSize: 'var(--font-size-heading)', 
        }}
      >
        Reject Notification
      </Typography>
      
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ 
            mb: 2, 
            backgroundColor: 'var(--color-error)',
            color: 'var(--color-text-light)',
          }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleReject}>
        <TextField
          label="Notification ID (GUID)"
          value={notificationId}
          onChange={(e) => setNotificationId(e.target.value)}
          required
          fullWidth
          margin="normal"
          sx={{
            input: { fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)' },
          }}
        />
        <TextField
          label="Reason"
          value={rejectionReason}
          onChange={(e) => setReason(e.target.value)}
          required
          fullWidth
          margin="normal"
          sx={{
            input: { fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)' },
          }}
        />

        <LoadingButton 
          type="submit" 
          variant="contained" 
          loading={loading}
          sx={{ 
            mt: 3, 
            py: 1.5, 
            fontSize: 'var(--font-size-button)', 
            backgroundColor: 'var(--color-primary)',
            '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
          }} 
          fullWidth
        >
          Reject
        </LoadingButton>
      </form>
    </Container>
    </>
  );
};

export default RejectVVNPage;
