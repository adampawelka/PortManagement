import React from 'react';
import { Container, TextField, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useRejectVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useRejectVesselVisitNotificationVM'; 

const RejectVVNPage = () => {
  const {
    notificationId,
    rejectionReason,
    loading,
    submitting,
    message,
    notifications,
    setNotificationId,
    setReason,
    handleReject,
  } = useRejectVesselVisitNotificationVM(); 

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
        <FormControl fullWidth margin="normal" required disabled={submitting} sx={{ '& .MuiInputLabel-root': { color: 'var(--color-text-dark)' } }}>
          <InputLabel id="notification-reject-label">Notification (Submitted)</InputLabel>
          <Select
            labelId="notification-reject-label"
            name="notificationId"
            value={notificationId}
            label="Notification (Submitted)"
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
              <MenuItem value="">No submitted notifications available</MenuItem>
            ) : (
              notifications.map((n) => (
                <MenuItem key={n.id} value={n.id}>
                  {n.id.substring(0, 8)}... - Vessel: {n.vesselName || 'N/A'}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          label="Reason"
          value={rejectionReason}
          onChange={(e) => setReason(e.target.value)}
          required
          fullWidth
          margin="normal"
          multiline
          rows={3}
          sx={{
            input: { fontFamily: 'var(--font-family-base)', fontSize: 'var(--font-size-base)' },
          }}
        />

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
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Reject'}
        </Button>
      </form>
    </Container>
  );
};

export default RejectVVNPage;
