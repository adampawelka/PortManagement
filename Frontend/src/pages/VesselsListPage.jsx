import React from 'react';
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody 
} from '@mui/material';
import { useVesselsListVM } from '../viewmodels/useVesselsListVM';

const VesselsListPage = () => {
  const { vessels, loading, error } = useVesselsListVM();

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: 4, 
        backgroundColor: 'var(--color-surface)', 
        p: 4, 
        borderRadius: 'var(--radius-md)', 
        boxShadow: 3 
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: 'var(--color-primary-light)', 
          fontWeight: 600, 
          mb: 3 
        }}
      >
        Vessels List ({vessels.length})
      </Typography>

      {loading && (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}

      {!loading && vessels.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }} aria-live="polite">
          No vessels found.
        </Alert>
      )}

      {vessels.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="vessels table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>IMO</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vessels.map((vessel) => (
                <TableRow key={vessel.id}>
                  <TableCell>{vessel.id || 'N/A'}</TableCell>
                  <TableCell>{vessel.vesselName || 'N/A'}</TableCell>
                  <TableCell>{vessel.imo || 'N/A'}</TableCell>
                  <TableCell>{vessel.ownerId || 'N/A'}</TableCell>
                  <TableCell>{vessel.vesselTypeId || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default VesselsListPage;
