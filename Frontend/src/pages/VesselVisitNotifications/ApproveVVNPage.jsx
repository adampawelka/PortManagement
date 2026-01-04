import React from 'react';
import {
  Container,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useApproveVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useApproveVesselVisitNotificationVM';
import { LoadingButton, LoadingOverlay } from '../../components/LoadingComponents';

const ApproveVVNPage = () => {
  const {
    formData,
    loading,
    submitting,
    message,
    notifications,
    docks,
    handleChange,
    handleApprove,
  } = useApproveVesselVisitNotificationVM();

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /> Loading notifications and docks...</Container>;

  return (
    <>
      <LoadingOverlay open={submitting} message="Approving notification..." />
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
          Approve Notification
        </Typography>

        {message && (
          <Alert
            severity={message.type}
            sx={{
              mb: 2,
              backgroundColor: message.type === 'error' ? 'var(--color-error)' : 'var(--color-success)',
              color: 'var(--color-text-light)',
            }}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleApprove}>
          <FormControl fullWidth margin="normal" required disabled={submitting}>
            <InputLabel id="notification-select-label">Notification (Submitted)</InputLabel>
            <Select
              labelId="notification-select-label"
              name="notificationId"
              value={formData.notificationId}
              onChange={handleChange}
            >
              {notifications.length === 0 ? (
                <MenuItem value="">No submitted notifications available</MenuItem>
              ) : (
                notifications.map(n => (
                  <MenuItem key={n.id} value={n.id}>
                    {n.id.substring(0, 8)}... - Vessel: {n.vesselName || 'N/A'}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required disabled={submitting}>
            <InputLabel id="dock-select-label">Dock</InputLabel>
            <Select
              labelId="dock-select-label"
              name="dockID"
              value={formData.dockID}
              onChange={handleChange}
            >
              {docks.length === 0 ? (
                <MenuItem value="">No docks available</MenuItem>
              ) : (
                docks.map(d => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.dockName || d.name} - {d.location || 'N/A'}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={submitting}
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
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
