import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
} from "@mui/material";
import { useAddDockVM } from "../../viewmodels/Docks/useAddDockVM";

const AddDockPage = () => {
  const vm = useAddDockVM();

  // While initial data is loading
  if (vm.loading && vm.vesselTypes.length === 0) {
    return (
      <Container
        sx={{
          mt: "var(--spacing-xl)",
          fontFamily: "var(--font-family-base)",
          color: "var(--color-text-dark)",
        }}
      >
        Loading initial data...
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
        Add New Dock
      </Typography>

      {vm.message && (
        <Alert severity={vm.message.type} sx={{ mb: "var(--spacing-md)" }}>
          {vm.message.text}
        </Alert>
      )}

      <form onSubmit={vm.handleSubmit}>
        <TextField
          label="Dock Name"
          name="dockName"
          value={vm.formData.dockName}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          name="dockLocation"
          value={vm.formData.dockLocation}
          onChange={vm.handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Depth (m)"
          name="depth"
          type="number"
          inputProps={{ step: "0.01" }}
          value={vm.formData.depth}
          onChange={vm.handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Length (m)"
          name="length"
          type="number"
          inputProps={{ step: "0.01" }}
          value={vm.formData.length}
          onChange={vm.handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Max Draft (m)"
          name="maxDraft"
          type="number"
          inputProps={{ step: "0.01" }}
          value={vm.formData.maxDraft}
          onChange={vm.handleChange}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required disabled={vm.loading}>
          <InputLabel id="vessel-types-select-label">
            Allowed Vessel Types
          </InputLabel>
          <Select
            labelId="vessel-types-select-label"
            name="selectedVesselTypeIds"
            multiple
            value={vm.formData.selectedVesselTypeIds}
            onChange={vm.handleChange}
            input={<OutlinedInput label="Allowed Vessel Types" />}
            renderValue={(selected) => (
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-xs)" }}
              >
                {selected.map((value) => {
                  const type = vm.vesselTypes.find((v) => v.id === value);
                  return (
                    <Chip
                      key={value}
                      label={type ? type.name : "Unknown"}
                      sx={{
                        backgroundColor: "var(--color-primary-light)",
                        color: "var(--color-text-light)",
                      }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {vm.vesselTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            "Create Dock"
          )}
        </Button>
      </form>
    </Container>
  );
};

export default AddDockPage;
