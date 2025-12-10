import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material';
import { useVesselTypeSearchVM } from '../../viewmodels/VesselTypes/useVesselTypeSearchVM';

const SearchVesselTypePage = () => {
  const { results, loading, message, handleSearch } = useVesselTypeSearchVM();

  const [searchParams, setSearchParams] = useState({
    name: '',
    description: '',
    minCapacity: '',
    maxCapacity: '',
  });

  const handleChange = (field) => (e) => {
    setSearchParams({ ...searchParams, [field]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch({
      name: searchParams.name,
      description: searchParams.description,
      minCapacity: searchParams.minCapacity ? Number(searchParams.minCapacity) : undefined,
      maxCapacity: searchParams.maxCapacity ? Number(searchParams.maxCapacity) : undefined,
    });
  };

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
          fontSize: 'var(--font-size-heading)', // użycie zmiennej dla nagłówka strony
        }}
      >
        Search Vessel Types
      </Typography>

      <form onSubmit={onSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Name"
            value={searchParams.name}
            onChange={handleChange('name')}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Description"
            value={searchParams.description}
            onChange={handleChange('description')}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Min Capacity"
            type="number"
            value={searchParams.minCapacity}
            onChange={handleChange('minCapacity')}
            variant="outlined"
            sx={{ width: '150px' }}
          />
          <TextField
            label="Max Capacity"
            type="number"
            value={searchParams.maxCapacity}
            onChange={handleChange('maxCapacity')}
            variant="outlined"
            sx={{ width: '150px' }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minWidth: 150,
              py: 1.5,
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-light)',
              '&:hover': { backgroundColor: 'var(--color-primary-light)' },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>
      </form>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      {results.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Capacity (TEUs)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Constraints (R/B/T)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID (Guid)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name || 'N/A'}</TableCell>
                  <TableCell>{type.description || 'N/A'}</TableCell>
                  <TableCell>{type.capacity || 0}</TableCell>
                  <TableCell>
                    {type.constraints
                      ? `R:${type.constraints.maxRows} / B:${type.constraints.maxBays} / T:${type.constraints.maxTiers}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{type.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SearchVesselTypePage;
