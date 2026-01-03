import React from 'react';
import { Container, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSubmitVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useSubmitVesselVisitNotificationVM'; 

const SubmitVVNPage = () => {
  const {
    notificationId,
    loading,
    submitting,
    message,
    notifications,
    setNotificationId,
    handleSubmit,
  } = useSubmitVesselVisitNotificationVM(); 

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /> Loading notifications...</Container>;

  return (
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
        <FormControl fullWidth margin="normal" required disabled={submitting} sx={{ '& .MuiInputLabel-root': { color: 'var(--color-text-dark)' } }}>
          <InputLabel id="notification-submit-label">Notification (Draft or In Progress)</InputLabel>
          <Select
            labelId="notification-submit-label"
            name="notificationId"
            value={notificationId}
            label="Notification (Draft or In Progress)"
            onChange={(e) => setNotificationId(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                color: 'var(--color-text-dark)', 
              },
              '& .MuiOutlinedInput-root': {
                borderColor: 'var(--color-border)', 
              },
            }}
          >
            {notifications.length === 0 ? (
              <MenuItem value="">No draft or in-progress notifications available</MenuItem>
            ) : (
              notifications.map((n) => (
                <MenuItem key={n.id} value={n.id}>
                  {n.id.substring(0, 8)}... - {n.status} - Vessel: {n.vesselName || 'N/A'}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading || submitting} 
          sx={{ 
            mt: 3, 
            py: 1.5, 
            fontSize: 'var(--font-size-button)', 
            backgroundColor: 'var(--color-primary)',
            '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
          }} 
          fullWidth
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </form>
    </Container>
  );
};

export default SubmitVVNPage;
