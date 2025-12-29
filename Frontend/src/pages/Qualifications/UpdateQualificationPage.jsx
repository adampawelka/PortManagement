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
  FormControl,
} from "@mui/material";
import { useApi } from "../../services/api";
import { useUpdateQualificationVM } from "../../viewmodels/Qualifications/useUpdateQualificationVM";

const UpdateQualificationPage = () => {
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
          sx={{
            mb: 2,
            color: "var(--color-text-light)",
            backgroundColor: "var(--color-error)",
          }}
        >
          {vm.message?.text}
        </Alert>
      )}

      {!vm.loading && !vm.criticalError && (
        <Paper
          sx={{
            p: 3,
            mt: 2,
            boxShadow: "var(--shadow-sm)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {vm.successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {vm.successMessage}
            </Alert>
          )}

          {vm.message && !vm.successMessage && (
            <Alert severity={vm.message.type} sx={{ mb: 2 }}>
              {vm.message.text}
            </Alert>
          )}

          <form onSubmit={vm.handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-qualification-label">Select Qualification</InputLabel>
              <Select
                labelId="select-qualification-label"
                value={vm.selectedId || ""}
                onChange={(e) => vm.handleSelectChange(e.target.value)}
                required
              >
                {vm.availableQualifications.map((q) => (
                  <MenuItem key={q.id} value={q.id}>
                    {q.code} - {q.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {vm.selectedId && (
              <>
                <TextField
                  label="New Code"
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
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={vm.submitting || !vm.selectedId}
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
