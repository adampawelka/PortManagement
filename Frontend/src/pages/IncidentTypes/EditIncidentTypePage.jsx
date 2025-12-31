import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useEditIncidentTypeVM } from "../../viewmodels/IncidentTypes/useEditIncidentTypeVM";

const EditIncidentTypePage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState(paramId || "");
  const [loaded, setLoaded] = useState(!!paramId);

  const {
    incidentType,
    setIncidentType,
    parentOptions,
    error,
    saveIncidentType,
    fetchIncidentType,
  } = useEditIncidentTypeVM(paramId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidentType(prev => ({ ...prev, [name]: value }));
  };

  const handleLoad = async () => {
  try {
    await fetchIncidentType(idInput);
    setLoaded(true);
  } catch {
    setLoaded(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveIncidentType();
      navigate("/incidentTypes");
    } catch {
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        p: 4,
        borderRadius: "var(--radius-md)",
        boxShadow: 3,
        backgroundColor: "var(--color-surface)",
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
          fontSize: "var(--font-size-heading)",
        }}
      >
        Edit Incident Type
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            color: "var(--color-text-light)",
            backgroundColor: "var(--color-error)",
          }}
        >
          {error}
        </Alert>
      )}

      {!loaded && (
        <Box display="flex" gap={2} mb={3}>
          <TextField
            label="Incident Type ID"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleLoad}
            disabled={!idInput}
            sx={{
              py: 1.5,
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-light)",
              "&:hover": { backgroundColor: "var(--color-primary-dark)" },
            }}
          >
            Load
          </Button>
        </Box>
      )}

      {loaded && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <TextField
            fullWidth
            label="Code"
            name="code"
            value={incidentType.code}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={incidentType.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={incidentType.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
            multiline
            rows={3}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              name="severity"
              value={incidentType.severity}
              onChange={handleChange}
            >
              <MenuItem value="Minor">Minor</MenuItem>
              <MenuItem value="Major">Major</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Parent Type</InputLabel>
            <Select
              name="parentId"
              value={incidentType.parentId || ""}
              onChange={handleChange}
            >
              <MenuItem value="">None</MenuItem>
              {parentOptions.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-light)",
              "&:hover": { backgroundColor: "var(--color-primary-dark)" },
            }}
          >
            Save Changes
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/incidentTypes")}
          >
            Cancel
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default EditIncidentTypePage;
