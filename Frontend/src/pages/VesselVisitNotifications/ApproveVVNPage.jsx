// src/pages/ApproveVvnPage.js
import React from 'react';
import { Container, TextField, Typography, Alert } from '@mui/material';
import { useApproveVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useApproveVesselVisitNotificationVM';
import { LoadingButton, LoadingOverlay } from '../../components/LoadingComponents';

const ApproveVVNPage = () => {
  const {
    notificationId,
    dockID,
    loading,
    message,
    setNotificationId,
    setDock,
    handleApprove,
  } = useApproveVesselVisitNotificationVM();

  return (
    <>
      <LoadingOverlay open={loading} message="Approving notification..." />
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
          fontSize: 'var(--font-size-heading)', // applying font-size from CSS variable
        }}
      >
        Approve Notification
      </Typography>

      {message && <Alert severity={message.type} sx={{ mb: 2, backgroundColor: 'var(--color-alert-bg)', color: 'var(--color-alert-text)' }}>
        {message.text}
      </Alert>}

      <form onSubmit={handleApprove}>
        <TextField 
          label="Notification ID (GUID)" 
          value={notificationId} 
          onChange={(e) => setNotificationId(e.target.value)}
          required 
          fullWidth 
          margin="normal"
          sx={{ 
            input: { 
              fontSize: 'var(--font-size-input)', 
              color: 'var(--color-text-dark)',
            },
            label: { 
              fontSize: 'var(--font-size-label)', 
            },
          }}
        />

        <TextField 
          label="DOCK ID (GUID)" 
          value={dockID} 
          onChange={(e) => setDock(e.target.value)}
          required 
          fullWidth 
          margin="normal"
          helperText="Dock Alpha Example. (230e6a8a-bc83-4f6d-b69e-2f9e1fcab771)"
          sx={{ 
            input: { 
              fontSize: 'var(--font-size-input)', 
              color: 'var(--color-text-dark)',
            },
            label: { 
              fontSize: 'var(--font-size-label)', 
            },
          }}
        />

        <LoadingButton 
          type="submit" 
          variant="contained" 
          loading={loading}
          sx={{ 
            mt: 3, 
            py: 1.5, 
            backgroundColor: 'var(--color-primary)',
            '&:hover': {
              backgroundColor: 'var(--color-primary-dark)', 
            },
          }} 
          fullWidth
        >
          Approve
        </LoadingButton>
      </form>
    </Container>
    </>
  );
};

export default ApproveVVNPage;
