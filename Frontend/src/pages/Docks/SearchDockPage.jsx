import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, CircularProgress, Alert,
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box
} from '@mui/material';
import { useApi } from '../../services/api';
import { useSearchDocksVM } from '../../viewmodels/Docks/useDockSearchVM';

const SearchDockPage = () => {
  const { apiFetch } = useApi();
  const { results, loading, message, fetchDocks, renderAllowedVesselTypes } = useSearchDocksVM(apiFetch);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [vesselTypeId, setVesselTypeId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!name && !location && !vesselTypeId) return;
    fetchDocks({ name, location, vesselTypeId });
  };

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
          fontSize: 'var(--font-size-heading)',
          mb: 3,
        }}
      >
        Search Docks
      </Typography>

      <form onSubmit={handleSearch}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="outlined"
          />
          <TextField
            label="Vessel Type ID"
            value={vesselTypeId}
            onChange={(e) => setVesselTypeId(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 150,
              py: 1.5,
              backgroundColor: 'var(--color-primary)',
              '&:hover': { backgroundColor: 'var(--color-primary-light)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>
      </form>

      {message && (
        <Alert
          severity={message.type}
          sx={{
            mb: 2,
            backgroundColor: message.type === 'error' ? 'var(--color-error)' : 'var(--color-info)',
            color: message.type === 'error' ? 'var(--color-text-light)' : 'var(--color-text-dark)'
          }}
        >
          {message.text}
        </Alert>
      )}

      {results.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 'var(--shadow-sm)' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-surface-alt)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Depth (m)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Length (m)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Max Draft (m)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Allowed Vessel Types</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((dock) => (
                <TableRow key={dock.id}>
                  <TableCell sx={{ fontSize: 'var(--font-size-sm)' }}>{dock.dockName || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: 'var(--font-size-sm)' }}>{dock.dockLocation || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: 'var(--font-size-sm)' }}>{dock.depth || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: 'var(--font-size-sm)' }}>{dock.length || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: 'var(--font-size-sm)' }}>{dock.maxDraft || 'N/A'}</TableCell>
                  <TableCell sx={{ fontSize: 'var(--font-size-sm)' }}>
                    {renderAllowedVesselTypes(dock.allowedVesselTypes)}
                  </TableCell>

                  <TableCell sx={{ fontSize: 'var(--font-size-sm)' }}>{dock.id || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SearchDockPage;
