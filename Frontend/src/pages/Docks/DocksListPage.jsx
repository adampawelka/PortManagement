import React from 'react';
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody 
} from '@mui/material';
import { useDocksVM } from '../viewmodels/useDocksListVM';

const DocksListPage = () => {
  const { docks, loading, error, renderAllowedVesselTypes } = useDocksVM();

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        mt: 4, 
        backgroundColor: 'var(--color-surface)', 
        p: 4, 
        borderRadius: 'var(--radius-md)', 
        boxShadow: 'var(--shadow-md)',
        fontFamily: 'var(--font-family-base)',
        color: 'var(--color-text-dark)',
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
        Docks List ({docks.length})
      </Typography>

      {loading && (
        <CircularProgress sx={{ display: 'block', margin: '20px auto', color: 'var(--color-primary)' }} />
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            color: 'var(--color-text-light)',
            backgroundColor: 'var(--color-error)',
          }}
        >
          {error}
        </Alert>
      )}

      {!loading && docks.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2, 
            backgroundColor: 'var(--color-info)',
            color: 'var(--color-text-dark)',
          }}
        >
          No docks found.
        </Alert>
      )}

      {docks.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 'var(--shadow-sm)' }}>
          <Table size="small" aria-label="docks table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Length (m)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Depth (m)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Max Draft (m)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Allowed Vessel Types</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {docks.map((dock, index) => (
                <TableRow key={dock.id || index} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                  <TableCell>{dock.id || 'N/A'}</TableCell>
                  <TableCell>{dock.dockName || 'N/A'}</TableCell>
                  <TableCell>{dock.dockLocation || 'N/A'}</TableCell>
                  <TableCell>{dock.length || 'N/A'}</TableCell>
                  <TableCell>{dock.depth || 'N/A'}</TableCell>
                  <TableCell>{dock.maxDraft || 'N/A'}</TableCell>
                  <TableCell>{renderAllowedVesselTypes(dock.allowedVesselTypes)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default DocksListPage;
