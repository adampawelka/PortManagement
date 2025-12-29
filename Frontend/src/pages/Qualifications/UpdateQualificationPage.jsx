import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { useApi } from "../../services/api";
import { useUpdateQualificationVM } from "../../viewmodels/Qualifications/useUpdateQualificationVM";

const UpdateQualificationPage = ({ onSubmit }) => {
  const { apiFetch } = useApi();
  const vm = useUpdateQualificationVM(apiFetch);

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

      {vm.loading && (
        <CircularProgress
          sx={{
            display: "block",
            margin: "20px auto",
            color: "var(--color-primary)",
          }}
        />
      )}

      {vm.criticalError && (
        <Alert
          severity="error"
          sx={{ mb: 2, color: "var(--color-text-light)", backgroundColor: "var(--color-error)" }}
        >
          {vm.message?.text || "Cannot load qualifications."}
        </Alert>
      )}

      {!vm.loading && !vm.criticalError && (
        <Paper sx={{ p: 3, mt: 2, boxShadow: "var(--shadow-sm)", borderRadius: "var(--radius-sm)" }}>
          {vm.message && <Alert severity={vm.message.type} sx={{ mb: 2 }}>{vm.message.text}</Alert>}

          <form onSubmit={(e) => vm.handleSubmit(e, onSubmit)}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="code-label">Code</InputLabel>
              <Select
                labelId="code-label"
                name="code"
                value={vm.formData.code}
                onChange={vm.handleChange}
                required
              >
                {vm.availableCodes.map((code) => (
                  <MenuItem key={code} value={code}>{code}</MenuItem>
                ))}
              </Select>
            </FormControl>

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
