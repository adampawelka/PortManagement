import React from 'react';
import {
  Container,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useRejectVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useRejectVesselVisitNotificationVM';
import { LoadingButton, LoadingOverlay } from '../../components/LoadingComponents';

const RejectVVNPage = () => {
  const {
    formData,
    loading,
    submitting,
    message,
    notifications,
    handleChange,
    handleReject,
  } = useRejectVesselVisitNotificationVM();

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress /> Loading notifications...
      </Container>
    );
  }

  return (
    <>
      <LoadingOverlay open={submitting} message="Rejecting notification..." />
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
            sx={{ mb: 2, backgroundColor: 'var(--color-error)', color: 'var(--color-text-light)' }}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleReject}>
          <FormControl fullWidth margin="normal" required disabled={submitting}>
            <InputLabel id="notification-reject-label">Notification (Submitted)</InputLabel>
            <Select
              labelId="notification-reject-label"
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

          <TextField
            label="Reason"
            name="rejectionReason"
            value={formData.rejectionReason}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={submitting}
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
