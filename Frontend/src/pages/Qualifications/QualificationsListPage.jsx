import React from 'react';
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody 
} from '@mui/material';
import { useQualificationsListVM } from '../../viewmodels/Qualifications/useQualificationsListVM';

const QualificationsListPage = () => {
  const { qualifications, loading, error } = useQualificationsListVM();

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
        Qualifications List ({qualifications.length})
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

      {!loading && qualifications.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2, 
            backgroundColor: 'var(--color-info)',
            color: 'var(--color-text-dark)',
          }}
        >
          No qualifications found.
        </Alert>
      )}

      {qualifications.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 'var(--shadow-sm)' }}>
          <Table size="small" aria-label="qualifications table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qualifications.map((q, index) => (
                <TableRow key={q.id || index} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                  <TableCell>{q.id || 'N/A'}</TableCell>
                  <TableCell>{q.code || 'N/A'}</TableCell>
                  <TableCell>{q.name || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default QualificationsListPage;
