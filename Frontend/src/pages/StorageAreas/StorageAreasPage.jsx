import React from 'react';
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Box, List, ListItem, ListItemText 
} from '@mui/material';
import { useStorageAreasListVM } from '../../viewmodels/StorageAreas/useStorageAreasListVM'; 

const StorageAreasPage = () => {
  const { storageAreas, loading, error } = useStorageAreasListVM(); 

  const renderDockDistances = (dockDistances) => {
    if (!dockDistances || dockDistances.length === 0) {
      return 'No dock distance information available.';
    }

    return (
      <Box sx={{ overflowY: 'auto', maxHeight: 120 }}>
        <List dense>
          {dockDistances.map((dock, index) => (
            <ListItem key={dock.dockId || index} sx={{ py: 0, px: 0.5 }}>
              <ListItemText
                primary={`${dock.dockName || 'N/A'}: ${dock.distance || 0} meters`}
                primaryTypographyProps={{ style: { fontSize: 'var(--font-size-small)' } }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
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
        Storage Areas List ({storageAreas.length})
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


      {!loading && storageAreas.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2,
            backgroundColor: 'var(--color-info)',
            color: 'var(--color-text-dark)' 
          }} 
          aria-live="polite"
        >
          No storage areas found.
        </Alert>
      )}

      {storageAreas.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="storage areas table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Max Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Current Occupancy</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Dock Distances</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storageAreas.map((area) => (
                <TableRow key={area.id || area.storageAreaName}>
                  <TableCell>{area.id || 'N/A'}</TableCell>
                  <TableCell>{area.storageAreaLocation || 'N/A'}</TableCell>
                  <TableCell>{area.storageAreaType || 'General'}</TableCell>
                  <TableCell>{area.maxCapacity || 0}</TableCell>
                  <TableCell>{area.currentOccupancy || 0}</TableCell>
                  <TableCell sx={{ maxHeight: 120, overflowY: 'auto', p: 0.5, fontSize: 'var(--font-size-small)' }}>
                    {renderDockDistances(area.dockDistances)} 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default StorageAreasPage;
