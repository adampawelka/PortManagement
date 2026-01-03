// src/pages/ApproveVvnPage.js
import React from 'react';
import { Container, TextField, Button, Typography, Alert, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useApproveVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useApproveVesselVisitNotificationVM';

const ApproveVVNPage = () => {
  const {
    notificationId,
    dockID,
    loading,
    submitting,
    message,
    notifications,
    docks,
    setNotificationId,
    setDock,
    handleApprove,
  } = useApproveVesselVisitNotificationVM();

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /> Loading notifications and docks...</Container>;

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
          fontSize: 'var(--font-size-heading)', // applying font-size from CSS variable
        }}
      >
        Approve Notification
      </Typography>

      {message && <Alert severity={message.type} sx={{ mb: 2, backgroundColor: 'var(--color-alert-bg)', color: 'var(--color-alert-text)' }}>
        {message.text}
      </Alert>}

      <form onSubmit={handleApprove}>
        <FormControl fullWidth margin="normal" required disabled={submitting} sx={{ '& .MuiInputLabel-root': { color: 'var(--color-text-dark)' } }}>
          <InputLabel id="notification-select-label">Notification (Submitted)</InputLabel>
          <Select
            labelId="notification-select-label"
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

        <FormControl fullWidth margin="normal" required disabled={submitting} sx={{ '& .MuiInputLabel-root': { color: 'var(--color-text-dark)' } }}>
          <InputLabel id="dock-select-label">Dock</InputLabel>
          <Select
            labelId="dock-select-label"
            name="dockId"
            value={dockID}
            label="Dock"
            onChange={(e) => setDock(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                color: 'var(--color-text-dark)', 
              },
              '& .MuiOutlinedInput-root': {
                borderColor: 'var(--color-border)', 
              },
            }}
          >
            {docks.length === 0 ? (
              <MenuItem value="">No docks available</MenuItem>
            ) : (
              docks.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.dockName || d.name} - {d.location || 'N/A'}
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
            backgroundColor: 'var(--color-primary)',
            '&:hover': {
              backgroundColor: 'var(--color-primary-dark)', 
            },
          }} 
          fullWidth
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Approve'}
        </Button>
      </form>
    </Container>
  );
};

export default ApproveVVNPage;
