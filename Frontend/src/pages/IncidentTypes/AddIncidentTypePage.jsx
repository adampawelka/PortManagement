import React from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useIncidentTypeAddVM } from "../../viewmodels/IncidentTypes/useAddIncidentTypeVM";

const IncidentTypeAddPage = () => {
  const vm = useIncidentTypeAddVM();

  // proste sprawdzenie czy formularz wypełniony
  const isFormValid =
    vm.incidentType.code &&
    vm.incidentType.name &&
    vm.incidentType.severity;

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
        Add New Incident Type
      </Typography>

      {vm.error && (
        <Alert severity="error" sx={{ mb: "var(--spacing-md)" }}>
          {vm.error}
        </Alert>
      )}

      <form onSubmit={vm.handleSubmit}>
        <TextField
          label="Code"
          name="code"
          value={vm.incidentType.code}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Name"
          name="name"
          value={vm.incidentType.name}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Description"
          name="description"
          value={vm.incidentType.description}
          onChange={vm.handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="severity-label">Severity</InputLabel>
          <Select
            labelId="severity-label"
            name="severity"
            value={vm.incidentType.severity}
            onChange={vm.handleChange}
          >
            <MenuItem value="Minor">Minor</MenuItem>
            <MenuItem value="Major">Major</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-label">Parent Type</InputLabel>
          <Select
            labelId="parent-label"
            name="parentId"
            value={vm.incidentType.parentId || ""}
            onChange={vm.handleChange}
          >
            <MenuItem value="">None</MenuItem>
            {vm.parentOptions.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={vm.loading || !isFormValid}
          fullWidth
          sx={{
            mt: "var(--spacing-lg)",
            py: 1.5,
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-light)",
            "&:hover": { backgroundColor: "var(--color-primary-light)" },
          }}
        >
          {vm.loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Incident Type"
          )}
        </Button>

        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: "var(--spacing-md)" }}
          onClick={() => vm.navigateBack()}
        >
          Cancel
        </Button>
      </form>
    </Container>
  );
};

export default IncidentTypeAddPage;
