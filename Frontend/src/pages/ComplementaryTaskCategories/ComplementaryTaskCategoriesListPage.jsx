import React, { useEffect } from 'react';
import { 
  Container, Typography, CircularProgress, Alert, 
  Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { useComplementaryTaskCategoriesListVM } from '../../viewmodels/ComplementaryTaskCategories/useComplementaryTaskCategoriesListVM';

const ComplementaryTaskCategoriesListPage = () => {
  const { categories, loading, error, fetchCategories } = useComplementaryTaskCategoriesListVM();

  // Fetch categories przy mountowaniu komponentu
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        Complementary Task Categories ({categories.length})
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

      {!loading && categories.length === 0 && !error && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 2,
            backgroundColor: 'var(--color-info)',
            color: 'var(--color-text-dark)'
          }} 
          aria-live="polite"
        >
          No complementary task categories found.
        </Alert>
      )}

      {categories.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small" aria-label="categories table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: 'var(--font-size-table-header)' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} sx={{ '&:hover': { backgroundColor: 'var(--color-background)' } }}>
                  <TableCell>{cat.code || 'N/A'}</TableCell>
                  <TableCell>{cat.name || 'N/A'}</TableCell>
                  <TableCell>{cat.description || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ComplementaryTaskCategoriesListPage;
