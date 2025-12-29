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
  FormHelperText,
} from "@mui/material";

import { useAddStaffMemberVM } from "../../viewmodels/StaffMembers/useAddStaffMemberVM";

const AddStaffMemberPage = () => {
  const vm = useAddStaffMemberVM();

  // Krytyczny błąd API
  if (vm.criticalError) {
    return (
      <Container sx={{ mt: "var(--spacing-xl)" }}>
        <Alert severity="error">
          Cannot reach the server. Form is disabled. Try again later.
        </Alert>
      </Container>
    );
  }

  // Sprawdzenie czy wszystkie wymagane pola są wypełnione
  const isFormValid =
    vm.formData.mecanographicNumber &&
    vm.formData.shortName &&
    vm.formData.email &&
    vm.formData.phone &&
    vm.formData.operationalWindow &&
    vm.formData.qualificationIds.length > 0;

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
        Add Staff Member
      </Typography>

      {vm.message && (
        <Alert severity={vm.message.type} sx={{ mb: "var(--spacing-md)" }}>
          {vm.message.text}
        </Alert>
      )}

      <form onSubmit={vm.handleSubmit}>
        <TextField
          label="Mecanographic Number"
          name="mecanographicNumber"
          value={vm.formData.mecanographicNumber}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Short Name"
          name="shortName"
          value={vm.formData.shortName}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={vm.formData.email}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Phone"
          name="phone"
          value={vm.formData.phone}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Operational Window"
          name="operationalWindow"
          value={vm.formData.operationalWindow}
          onChange={vm.handleChange}
          fullWidth
          required
          margin="normal"
          placeholder="e.g. 08:00–16:00"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="qualification-label">Qualifications</InputLabel>
          <Select
            labelId="qualification-label"
            multiple
            value={vm.formData.qualificationIds}
            onChange={vm.handleQualificationsChange}
            renderValue={(selected) =>
              vm.availableQualifications
                .filter((q) => selected.includes(q.id))
                .map((q) => q.code)
                .join(", ")
            }
          >
            {vm.availableQualifications.map((q) => (
              <MenuItem key={q.id} value={q.id}>
                {q.code} - {q.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select at least one qualification</FormHelperText>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={vm.submitting || vm.criticalError || !isFormValid}
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
            "Create Staff Member"
          )}
        </Button>
      </form>
    </Container>
  );
};

export default AddStaffMemberPage;
