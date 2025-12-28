import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { useApi } from "../../services/api";
import { useUpdateQualificationVM } from "../../viewmodels/Qualifications/useUpdateQualificationVM";
import { useParams } from "react-router-dom";

const UpdateQualificationPage = () => {
  const { apiFetch } = useApi();
  const { id } = useParams();
  const vm = useUpdateQualificationVM(apiFetch, id);

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        p: 4,
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        fontFamily: "var(--font-family-base)",
        color: "var(--color-text-dark)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "var(--color-primary-light)",
          fontWeight: 600,
          mb: 3,
          fontSize: "var(--font-size-heading)",
          textAlign: "center",
        }}
      >
        Update Qualification
      </Typography>

      {/* Loading */}
      {vm.loading && (
        <CircularProgress
          sx={{
            display: "block",
            margin: "20px auto",
            color: "var(--color-primary)",
          }}
        />
      )}

      {/* Critical Error */}
      {vm.criticalError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            color: "var(--color-text-light)",
            backgroundColor: "var(--color-error)",
          }}
        >
          {vm.message?.text || "Cannot load qualification."}
        </Alert>
      )}

      {/* Not Found */}
      {!vm.loading && vm.notFound && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            backgroundColor: "var(--color-info)",
            color: "var(--color-text-dark)",
          }}
        >
          No qualification found.
        </Alert>
      )}

      {/* Form */}
      {!vm.loading && !vm.criticalError && !vm.notFound && (
        <Paper
          sx={{
            p: 3,
            mt: 2,
            boxShadow: "var(--shadow-sm)",
            borderRadius: "var(--radius-sm)",
          }}
        >
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
              fullWidth
              required
              margin="normal"
            />

            <TextField
              label="Name"
              name="name"
              value={vm.formData.name}
              onChange={vm.handleChange}
              fullWidth
              required
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={vm.submitting}
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-light)",
                "&:hover": { backgroundColor: "var(--color-primary-light)" },
              }}
            >
              {vm.submitting ? <CircularProgress size={24} color="inherit" /> : "Update Qualification"}
            </Button>
          </form>
        </Paper>
      )}
    </Container>
  );
};

export default UpdateQualificationPage;
