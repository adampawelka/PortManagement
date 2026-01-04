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
import { useSubmitVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useSubmitVesselVisitNotificationVM';
import { LoadingButton, LoadingOverlay } from '../../components/LoadingComponents';

const SubmitVVNPage = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    notifications,
    loading,
    submitting,
    message,
  } = useSubmitVesselVisitNotificationVM();

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /> Loading notifications...</Container>;

  return (
    <>
      <LoadingOverlay open={submitting} message="Submitting notification..." />
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
              backgroundColor: message.type === 'error' ? 'var(--color-error)' : 'var(--color-success)',
              color: 'var(--color-text-light)',
            }}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required disabled={submitting}>
            <InputLabel id="notification-select-label">Notification (Draft or In Progress)</InputLabel>
            <Select
              labelId="notification-select-label"
              name="notificationId"
              value={formData.notificationId}
              onChange={handleChange}
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
            Submit
          </LoadingButton>
        </form>
      </Container>
    </>
  );
};

export default SubmitVVNPage;
