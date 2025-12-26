import React from 'react';
import { Container, TextField, Typography, Alert } from '@mui/material';
import { useSubmitVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useSubmitVesselVisitNotificationVM';
import { LoadingButton, LoadingOverlay } from '../../components/LoadingComponents'; 

const SubmitVVNPage = () => {
  const {
    formData,
    loading,
    message,
    handleChange,
    handleSubmit,
  } = useSubmitVesselVisitNotificationVM(); 

  return (
    <>
      <LoadingOverlay open={loading} message="Submitting notification..." />
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
        Submit Notification
      </Typography>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ 
            mb: 2, 
            backgroundColor: 'var(--color-success)', 
            color: 'var(--color-text-light)', 
          }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Notification ID (GUID)"
          name="notificationId"
          value={formData.notificationId}
          onChange={handleChange}
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
          Submit
        </LoadingButton>
      </form>
    </Container>
    </>
  );
};

export default SubmitVVNPage;
