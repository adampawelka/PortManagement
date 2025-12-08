import React, { useState } from 'react';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import { useVesselsSearchVM } from '../viewmodels/useVesselSearchVM';

const SearchVesselPage = () => {
  const { results, loading, message, handleSearch } = useVesselsSearchVM();

  const [searchFields, setSearchFields] = useState({
    imo: '',
    name: '',
    ownerId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchFields({ ...searchFields, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch({
      imo: searchFields.imo.trim() || undefined,
      name: searchFields.name.trim() || undefined,
      ownerId: searchFields.ownerId.trim() || undefined
    });
  };

  const getCellValue = (value) => value || <span style={{ color: 'var(--color-not-found)' }}>N/A</span>;

  return (
    <Container
      maxWidth="lg"
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
        align="center"
        sx={{
          color: 'var(--color-primary-light)',
          fontWeight: 600,
          mb: 3,
          fontSize: 'var(--font-size-heading)', // zastosowanie zmiennej dla nagłówka strony
        }}
      >
        Search Vessels
      </Typography>

      <form onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <TextField label="IMO" name="imo" value={searchFields.imo} onChange={handleChange} variant="outlined" />
          <TextField label="Vessel Name" name="name" value={searchFields.name} onChange={handleChange} variant="outlined" />
          <TextField label="Operator/Owner ID" name="ownerId" value={searchFields.ownerId} onChange={handleChange} variant="outlined" />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 150,
              py: 1.5,
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-light)',
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
            color: message.type === 'error' ? 'var(--color-text-light)' : undefined,
            backgroundColor:
              message.type === 'error'
                ? 'var(--color-error)'
                : message.type === 'warning'
                ? 'var(--color-warning)'
                : message.type === 'success'
                ? 'var(--color-success)'
                : message.type === 'info'
                ? 'var(--color-info)'
                : undefined
          }}
        >
          {message.text}
        </Alert>
      )}

      {results.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: 'var(--color-surface)' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>IMO</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Vessel Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Owner ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Vessel Type ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((vessel) => (
                <TableRow key={vessel.id} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                  <TableCell>{getCellValue(vessel.id)}</TableCell>
                  <TableCell>{getCellValue(vessel.imo)}</TableCell>
                  <TableCell>{getCellValue(vessel.vesselName)}</TableCell>
                  <TableCell>{getCellValue(vessel.ownerId)}</TableCell>
                  <TableCell>{getCellValue(vessel.vesselTypeId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SearchVesselPage;
