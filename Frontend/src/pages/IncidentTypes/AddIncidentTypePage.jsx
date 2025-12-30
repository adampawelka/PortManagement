import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, TextField, Button, CircularProgress, Alert, MenuItem
} from "@mui/material";
import { useIncidentTypeAddVM } from "../../viewmodels/IncidentTypes/useAddIncidentTypeVM";

const IncidentTypeAddPage = () => {
  const navigate = useNavigate();
  const { incidentType, setIncidentType, parentOptions, loading, error, addIncidentType } = useIncidentTypeAddVM();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidentType(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addIncidentType();
      navigate("/incidentTypes");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 4, borderRadius: 'var(--radius-md)', boxShadow: 3, backgroundColor: 'var(--color-surface)' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'var(--color-primary-light)', mb: 3 }}>
        Add New Incident Type
      </Typography>

      {loading && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Code" name="code" value={incidentType.code} onChange={handleChange} sx={{ mb: 2 }} required />
        <TextField fullWidth label="Name" name="name" value={incidentType.name} onChange={handleChange} sx={{ mb: 2 }} required />
        <TextField fullWidth label="Description" name="description" value={incidentType.description} onChange={handleChange} sx={{ mb: 2 }} multiline rows={3} />
        <TextField fullWidth select label="Severity" name="severity" value={incidentType.severity} onChange={handleChange} sx={{ mb: 2 }} required>
          <MenuItem value="Minor">Minor</MenuItem>
          <MenuItem value="Major">Major</MenuItem>
          <MenuItem value="Critical">Critical</MenuItem>
        </TextField>
        <TextField fullWidth select label="Parent Type" name="parentId" value={incidentType.parentId || ""} onChange={handleChange} sx={{ mb: 3 }}>
          <MenuItem value="">None</MenuItem>
          {parentOptions.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </TextField>
        <Button type="submit" variant="contained">Add Incident Type</Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate("/incidentTypes")}>Cancel</Button>
      </form>
    </Container>
  );
};

export default IncidentTypeAddPage;
