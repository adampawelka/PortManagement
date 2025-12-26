// src/components/Resources/AddResourcePage.js
import React from 'react';
import { Container, Typography, Alert, TextField } from '@mui/material';
import { useAddResourceVM } from '../../viewmodels/Resources/useAddResourceVM';  // Import ViewModel
import { LoadingButton, LoadingOverlay, LoadingSpinner } from '../../components/LoadingComponents';

const AddResourcePage = () => {
  const { formData, loading, submitting, message, error, handleChange, handleSubmit, criticalError } = useAddResourceVM();

  // While the form is loading
  if (loading) {
    return (
      <Container sx={{ mt: 4, fontFamily: 'var(--font-family-base)' }}>
        <LoadingSpinner size="large" message="Loading initial data..." />
      </Container>
    );
  }

  // If critical error occurred, block form completely
  if (criticalError) {
    return (
      <Container sx={{ mt: 4, fontFamily: 'var(--font-family-base)' }}>
        <Alert severity="error">Cannot reach the server. Form is disabled. Try again later.</Alert>
      </Container>
    );
  }

  return (
    <>
      <LoadingOverlay open={submitting} message="Creating resource..." />
      <Container 
        maxWidth="sm" 
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
          fontSize: 'var(--font-size-large)' 
        }}
      >
        Add New Resource
      </Typography>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Code (Unique Identifier)"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Type (e.g., Crane, Forklift, Staff)"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
          variant="outlined"
        />
        <TextField
          label="Status (active, inactive, maintenance)"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Capacity (Decimal)"
          name="capacity"
          type="number"
          inputProps={{ step: "0.01" }}
          value={formData.capacity}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Setup Time (Minutes)"
          name="setupTime"
          type="number"
          inputProps={{ min: 0 }}
          value={formData.setupTime}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={submitting}
          disabled={criticalError}
          fullWidth
          sx={{ 
            mt: 3, 
            py: 1.5, 
            backgroundColor: 'var(--color-primary)', 
            color: 'var(--color-text-light)',
            '&:hover': { backgroundColor: 'var(--color-primary-light)' }
          }}
        >
          Create Resource
        </LoadingButton>
      </form>
    </Container>
    </>
  );
};

export default AddResourcePage;
