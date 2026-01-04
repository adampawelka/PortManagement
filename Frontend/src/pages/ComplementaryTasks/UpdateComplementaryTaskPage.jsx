import React from "react";
import {
  Container, Typography, Paper, TextField, Button, FormControl, InputLabel, 
  Select, MenuItem, FormControlLabel, Checkbox, Alert, Box, CircularProgress
} from "@mui/material";
import { useUpdateComplementaryTaskVM } from "../../viewmodels/ComplementaryTasks/useUpdateComplementaryTaskVM";

const UpdateComplementaryTaskPage = () => {
  const { 
    formData, categories, vves, loading, submitting, error, success, handleChange, handleSubmit 
  } = useUpdateComplementaryTaskVM();

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Task Details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'var(--color-primary-light)' }}>
          Edit Complementary Task
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          
          {/* BARCO (Normalmente deshabilitado en edición, pero editable si se requiere) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Target Vessel (Visit)</InputLabel>
            <Select
              name="vveId"
              value={formData.vveId}
              label="Target Vessel (Visit)"
              onChange={handleChange}
              disabled // Generalmente no cambias el barco de una tarea ya creada
            >
              {vves.map(v => (
                <MenuItem key={v.id} value={v.id}>
                  {v.vesselName || v.vvnId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="categoryId"
              value={formData.categoryId}
              label="Category"
              onChange={handleChange}
            >
              {categories.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Responsible"
            name="responsible"
            value={formData.responsible}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          {/* FILA DE TIEMPOS */}
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField
              label="Start Time"
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              helperText="Set this when task is finished"
            />
          </Box>

          {/* ESTADO */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
              sx={{ fontWeight: 'bold', color: formData.status === 'COMPLETED' ? 'green' : 'primary.main' }}
            >
              <MenuItem value="PLANNED">Planned</MenuItem>
              <MenuItem value="ONGOING">Ongoing</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* CHECKBOX IMPACTO */}
          <Box sx={{ mt: 2, p: 2, border: '1px solid var(--color-border)', borderRadius: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.suspendsOperation}
                  onChange={handleChange}
                  name="suspendsOperation"
                  color="error"
                />
              }
              label={<Typography fontWeight={formData.suspendsOperation ? "bold" : "normal"} color={formData.suspendsOperation ? "error" : "textPrimary"}>Suspends Cargo Operations?</Typography>}
            />
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ bgcolor: 'var(--color-primary)' }}>
              {submitting ? "Saving..." : "Update Task"}
            </Button>
            <Button variant="outlined" size="large" href="/complementary-tasks/list">
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UpdateComplementaryTaskPage;