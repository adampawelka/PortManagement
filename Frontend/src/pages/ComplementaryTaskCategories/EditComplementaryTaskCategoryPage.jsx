import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useEditComplementaryTaskCategoryVM } from '../../viewmodels/ComplementaryTaskCategories/useEditComplementaryTaskCategoryVM';

const EditComplementaryTaskCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vm = useEditComplementaryTaskCategoryVM(id);

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        p: 4,
        backgroundColor: 'var(--color-surface)',
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
          fontSize: 'var(--font-size-large)',
          mb: 3,
        }}
      >
        Edit Complementary Task Category
      </Typography>

      {vm.loading && (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      )}

      {vm.message && (
        <Alert severity={vm.message.type} sx={{ mb: 2 }}>
          {vm.message.text}
        </Alert>
      )}

      <form onSubmit={vm.handleSubmit}>
        <TextField
          label="Code"
          name="code"
          value={vm.formData.code}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Name"
          name="name"
          value={vm.formData.name}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={vm.formData.description}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Default Duration (optional, in minutes)"
          name="defaultDuration"
          value={vm.formData.defaultDuration}
          onChange={vm.handleChange}
          type="number"
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={vm.submitting || !vm.isFormValid}
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-light)',
            '&:hover': { backgroundColor: 'var(--color-primary-light)' },
          }}
        >
          {vm.submitting ? <CircularProgress size={24} color="inherit" /> : 'Update Category'}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/categories')}
        >
          Cancel
        </Button>
      </form>
    </Container>
  );
};

export default EditComplementaryTaskCategoryPage;
