import React from 'react';
import {
  Container, Typography, CircularProgress, Alert,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Box
} from '@mui/material';
import { useVesselTypesListVM } from '../../viewmodels/useVesselTypesListVM';

const renderConstraints = (constraints) => {
  if (!constraints) return 'N/A';

  const items = [
    `Max Rows: ${constraints.maxRows || 'N/A'}`,
    `Max Bays: ${constraints.maxBays || 'N/A'}`,
    `Max Tiers: ${constraints.maxTiers || 'N/A'}`
  ];

  return (
    <Box component="ul" sx={{ m: 0, pl: 2, lineHeight: 1.5, fontSize: 'var(--font-size-small)' }}>
      {items.map((text, idx) => (
        <li key={idx} style={{ marginBottom: idx < items.length - 1 ? 6 : 0 }}>
          {text}
        </li>
      ))}
    </Box>
  );
};

const VesselTypePage = () => {
  const { vesselTypes, loading, error } = useVesselTypesListVM();

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 4,
        backgroundColor: 'var(--color-surface)',
        p: 4,
        borderRadius: 'var(--radius-md)',
        boxShadow: 3,
        maxWidth: '90vw',
        overflowX: 'auto',
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
        Vessel Types List ({vesselTypes.length})
      </Typography>

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}

      {!loading && vesselTypes.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }} aria-live="polite">
          No vessel types found.
        </Alert>
      )}

      {vesselTypes.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table
            size="small"
            aria-label="vessel types table"
            sx={{ tableLayout: 'fixed', width: '100%' }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 'var(--font-size-table-header)',
                    width: 180,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)', width: '20%' }}>
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 'var(--font-size-table-header)',
                    width: '40%',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 'var(--font-size-table-header)',
                    width: 80,
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Capacity
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 'var(--font-size-table-header)',
                    width: '20%',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                  }}
                >
                  Constraints
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vesselTypes.map((type, idx) => (
                <TableRow key={type.id || idx} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                  <TableCell
                    sx={{
                      width: 180,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={type.id}
                  >
                    {type.id}
                  </TableCell>
                  <TableCell sx={{ width: '20%' }}>{type.name || 'N/A'}</TableCell>
                  <TableCell
                    sx={{
                      width: '40%',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {type.description || 'N/A'}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: 80,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {type.capacity || 0}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: '20%',
                      p: 0.5,
                      fontSize: 'var(--font-size-small)',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    {renderConstraints(type.constraints)}
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

export default VesselTypePage;
