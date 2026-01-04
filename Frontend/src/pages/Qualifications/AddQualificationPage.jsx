import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAddQualificationVM } from "../../viewmodels/Qualifications/useAddQualificationVM";
import { useApi } from "../../services/api";

const AddQualificationPage = () => {
  const { apiFetch } = useApi();
  const vm = useAddQualificationVM(apiFetch);

  // While initial data is loading (if any)
  if (vm.loading && !vm.success && !vm.error) {
    return (
      <Container
        sx={{
          mt: "var(--spacing-xl)",
          fontFamily: "var(--font-family-base)",
          color: "var(--color-text-dark)",
        }}
      >
        Loading form...
      </Container>
    );
  }

  // If critical API error occurred
  if (vm.criticalError) {
    return (
      <Container
        sx={{
          mt: "var(--spacing-xl)",
          fontFamily: "var(--font-family-base)",
        }}
      >
        <Alert severity="error">
          Cannot reach the server. Form is disabled. Try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: "var(--spacing-xl)",
        p: "var(--spacing-lg)",
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        boxShadow: 3,
        fontFamily: "var(--font-family-base)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          color: "var(--color-primary-light)",
          fontWeight: 600,
          fontSize: "var(--font-size-large)",
          mb: "var(--spacing-lg)",
        }}
      >
        Add New Qualification
      </Typography>

      {vm.message && (
        <Alert severity={vm.message.type} sx={{ mb: "var(--spacing-md)" }}>
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

        <Button
          type="submit"
          variant="contained"
          disabled={vm.submitting || vm.criticalError}
          fullWidth
          sx={{
            mt: "var(--spacing-lg)",
            py: 1.5,
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-light)",
            "&:hover": { backgroundColor: "var(--color-primary-light)" },
          }}
        >
          {vm.submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Qualification"
          )}
        </Button>
      </form>
    </Container>
  );
};

export default AddQualificationPage;
