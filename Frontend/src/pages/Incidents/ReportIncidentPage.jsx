import React from "react";
import { useNavigate } from "react-router-dom";
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
  Box,
  Grid,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { useReportIncidentVM } from "../../viewmodels/Incidents/useReportIncidentVM";

const ReportIncidentPage = () => {
  const navigate = useNavigate();
  const {
    incident,
    updateField,
    incidentTypes,
    loading,
    error,
    success,
    createIncident,
  } = useReportIncidentVM();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIncident();
      setTimeout(() => {
        navigate("/incidents/list");
      }, 1500);
    } catch (err) {
      // Error is handled by ViewModel
    }
  };

  const isFormValid =
    incident.incidentTypeId &&
    incident.startTime &&
    incident.severity &&
    incident.description;

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        backgroundColor: "var(--color-surface)",
        p: 4,
        borderRadius: "var(--radius-md)",
        boxShadow: 3,
        fontFamily: "var(--font-family-base)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "var(--color-primary-light)",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Report Incident
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Incident Type</InputLabel>
              <Select
                value={incident.incidentTypeId}
                label="Incident Type"
                onChange={(e) => updateField("incidentTypeId", e.target.value)}
              >
                {incidentTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name} ({type.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Time"
              type="datetime-local"
              value={incident.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="End Time (Optional - leave empty for active incident)"
              type="datetime-local"
              value={incident.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Severity</InputLabel>
              <Select
                value={incident.severity}
                label="Severity"
                onChange={(e) => updateField("severity", e.target.value)}
              >
                <MenuItem value="Minor">Minor</MenuItem>
                <MenuItem value="Major">Major</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              value={incident.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => navigate("/incidents/list")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={!isFormValid || loading}
              >
                {loading ? <CircularProgress size={24} /> : "Report Incident"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ReportIncidentPage;

