import React from 'react';
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody 
} from '@mui/material';
import { useVesselsListVM } from '../../viewmodels/Vessels/useVesselsListVM';

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
          fontSize: 'var(--font-size-heading)', // zastosowanie zmiennej dla nagłówka
        }}
      >
        Vessels List ({vessels.length})
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

      {!loading && vessels.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2,
            backgroundColor: 'var(--color-info)',
            color: 'var(--color-text-dark)'
          }} 
          aria-live="polite"
        >
          No vessels found.
        </Alert>
      )}

      {vessels.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="vessels table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>IMO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vessels.map((vessel) => (
                <TableRow key={vessel.id} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
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
