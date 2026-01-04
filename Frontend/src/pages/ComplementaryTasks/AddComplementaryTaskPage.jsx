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
  FormControlLabel,
  Checkbox,
  Box
} from "@mui/material";
import { useAddComplementaryTaskVM } from "../../viewmodels/ComplementaryTasks/useAddComplementaryTaskVM";

const AddComplementaryTaskPage = () => {
  const vm = useAddComplementaryTaskVM();

  if (vm.criticalError) {
    return (
      <Container sx={{ mt: "var(--spacing-xl)", fontFamily: "var(--font-family-base)" }}>
        <Alert severity="error">
          Cannot reach the server. Form is disabled. Try again later.
        </Alert>
      </Container>
    );
  }

  // Validación visual del botón
  const isFormValid =
    vm.formData.vveId !== "" &&
    vm.formData.categoryId !== "" &&
    vm.formData.responsible.trim() !== "" &&
    vm.formData.startTime !== "";

  return (
    <Container
      maxWidth="md"
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
        Record Complementary Task
      </Typography>

      {vm.message && (
        <Alert severity={vm.message.type} sx={{ mb: "var(--spacing-md)" }}>
          {vm.message.text}
        </Alert>
      )}

      <form onSubmit={vm.handleSubmit}>
        
        {/* SELECTOR: BARCO (VVE) */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Target Vessel (Visit)</InputLabel>
          <Select
            name="vveId"
            value={vm.formData.vveId}
            label="Target Vessel (Visit)"
            onChange={vm.handleChange}
          >
            {vm.vves.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.vesselName} (Ref: {v.vvnId || v.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SELECTOR: CATEGORÍA */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Task Category</InputLabel>
          <Select
            name="categoryId"
            value={vm.formData.categoryId}
            label="Task Category"
            onChange={vm.handleChange}
          >
            {vm.categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* TEXTO: RESPONSABLE */}
        <TextField
          label="Responsible Team / Service"
          name="responsible"
          value={vm.formData.responsible}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
          placeholder="e.g. Maintenance Team A"
        />

        {/* FECHA: INICIO */}
        <TextField
          label="Start Time"
          type="datetime-local"
          name="startTime"
          value={vm.formData.startTime}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        {/* CHECKBOX: SUSPENDE OPERACIÓN */}
        <Box sx={{ mt: 2, mb: 1, p: 2, border: '1px solid var(--color-border)', borderRadius: 1 }}>
            <FormControlLabel
            control={
                <Checkbox
                checked={vm.formData.suspendsOperation}
                onChange={vm.handleChange}
                name="suspendsOperation"
                color="error"
                />
            }
            label={
                <Typography fontWeight={vm.formData.suspendsOperation ? "bold" : "normal"} color={vm.formData.suspendsOperation ? "error" : "textPrimary"}>
                Suspends Cargo Operations?
                </Typography>
            }
            />
            <Typography variant="caption" display="block" color="textSecondary">
            Check if this task prevents cranes from operating on this vessel.
            </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={!isFormValid || vm.submitting}
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
            "Record Task"
          )}
        </Button>
      </form>
    </Container>
  );
};

export default AddComplementaryTaskPage;