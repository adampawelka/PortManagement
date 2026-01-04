import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Paper,
} from "@mui/material";
import { Save, Cancel, CheckCircle } from "@mui/icons-material";
import { useUpdateIncidentVM } from "../../viewmodels/Incidents/useUpdateIncidentVM";

const UpdateIncidentPage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState(paramId || "");
  const [loaded, setLoaded] = useState(!!paramId);

  const {
    incident,
    updateField,
    incidentTypes,
    loading,
    error,
    success,
    updateIncident,
    fetchIncident,
    markAsResolved,
  } = useUpdateIncidentVM(paramId);

  const handleLoad = async () => {
    try {
      await fetchIncident(idInput);
      setLoaded(true);
    } catch {
      setLoaded(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateIncident();
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
        Update Incident
      </Typography>

      {/* Load by ID section */}
      {!loaded && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Load Incident
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Incident ID"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleLoad}
              disabled={!idInput || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Load"}
            </Button>
          </Box>
        </Paper>
      )}

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

      {loaded && (
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
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  label="End Time"
                  type="datetime-local"
                  value={incident.endTime}
                  onChange={(e) => updateField("endTime", e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                {!incident.endTime && (
                  <Button
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    onClick={markAsResolved}
                    sx={{ minWidth: 150 }}
                  >
                    Mark Resolved
                  </Button>
                )}
              </Box>
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
                  {loading ? <CircularProgress size={24} /> : "Update Incident"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
};

export default UpdateIncidentPage;



