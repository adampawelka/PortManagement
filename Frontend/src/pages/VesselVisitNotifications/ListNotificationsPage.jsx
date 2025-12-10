import React from 'react';
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody 
} from '@mui/material';
import { useVesselVisitNotificationsVM } from '../../viewmodels/VesselVisitNotifications/useVesselVisitNotificationsListVM';

const ListNotificationsPage = () => {
  const { notifications, loading, error } = useVesselVisitNotificationsVM();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Container 
      maxWidth="xl" 
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
        Vessel Visit Notifications List ({notifications.length})
      </Typography>

      {loading && (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            color: 'var(--color-text-light)',
            backgroundColor: 'var(--color-error)',
          }} 
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}

      {!loading && notifications.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2,
            backgroundColor: 'var(--color-info)',
            color: 'var(--color-text-dark)'
          }} 
          aria-live="polite"
        >
          No vessel visit notifications found.
        </Alert>
      )}

      {notifications.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="notifications table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Vessel Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Vessel IMO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Submitted By</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ETA</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ETD</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Notification ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Rejection Reason</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Assigned Dock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((n) => (
                <TableRow key={n.id} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                  <TableCell>{n.vesselName || 'N/A'}</TableCell>
                  <TableCell>{n.vesselIMO || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{
                        fontWeight: 'bold', 
                        color: 
                          n.status === 'Submitted' ? 'var(--color-warning)' : 
                          n.status === 'Approved' ? 'var(--color-success)' : 
                          n.status === 'Rejected' ? 'var(--color-error)' : 
                          'var(--color-not-found)',
                      }}
                    >
                      {n.status || 'State'}
                    </Typography>
                  </TableCell>
                  <TableCell>{n.submittedByName || 'N/A'}</TableCell>
                  <TableCell>{formatDate(n.eta)}</TableCell>
                  <TableCell>{formatDate(n.etd)}</TableCell>
                  <TableCell>{n.id}</TableCell>
                  <TableCell>{n.rejectionReason || 'Notification not Rejected'}</TableCell>
                  <TableCell>{n.assignedDockId || 'No dock'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ListNotificationsPage;
