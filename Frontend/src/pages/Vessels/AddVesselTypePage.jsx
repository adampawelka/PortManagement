import React from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useAddVesselTypeVM } from '../../viewmodels/VesselTypes/useAddVesselTypeVM';

const AddVesselTypePage = () => {
  const { formData, loading, message, handleChange, handleSubmit } = useAddVesselTypeVM();

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        backgroundColor: 'var(--color-surface)',
        p: 4,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'var(--color-primary-light)',
          fontWeight: 600,
          mb: 3,
          fontSize: 'var(--font-size-large)',
        }}
      >
        Add New Vessel Type
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{
            mb: 2,
            color: message.type === 'error' ? 'var(--color-text-light)' : undefined,
            backgroundColor:
              message.type === 'error'
                ? 'var(--color-error)'
                : message.type === 'success'
                ? 'var(--color-success)'
                : message.type === 'info'
                ? 'var(--color-info)'
                : undefined,
          }}
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
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
        />
        <TextField
          label="Capacity (TEUs)"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />

        <Typography variant="h6" sx={{ mt: 3, color: 'var(--color-primary)' }}>
          Operational Constraints:
        </Typography>
        <TextField
          label="Max Rows"
          name="maxRows"
          type="number"
          value={formData.maxRows}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Max Bays"
          name="maxBays"
          type="number"
          value={formData.maxBays}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Max Tiers"
          name="maxTiers"
          type="number"
          value={formData.maxTiers}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-light)',
            '&:hover': { backgroundColor: 'var(--color-primary-light)' },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Vessel Type'}
        </Button>
      </form>
    </Container>
  );
};

export default AddVesselTypePage;
