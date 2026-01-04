import React from 'react';
import {
  Container,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useAddVesselVisitNotificationVM } from '../../viewmodels/VesselVisitNotifications/useAddVesselVisitNotificationVM';
import { LoadingButton, LoadingOverlay, LoadingSpinner } from '../../components/LoadingComponents';

const AddVVNPage = () => {
  const {
    formData,
    vessels,
    representatives,
    loading,
    submitting,
    message,
    handleChange,
    handleSubmit,
  } = useAddVesselVisitNotificationVM();

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <LoadingSpinner size="large" message="Loading vessels and representatives..." />
      </Container>
    );
  }

  return (
    <>
      <LoadingOverlay open={submitting} message="Creating vessel visit notification..." />
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          backgroundColor: 'var(--color-surface)',
          p: 4,
          borderRadius: 'var(--radius-md)',
          boxShadow: 3,
          fontFamily: 'var(--font-family-base)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'var(--color-primary-light)',
            fontWeight: 600,
            mb: 3,
            fontSize: 'var(--font-size-heading)',
          }}
        >
          Add a New Vessel Visit Notification
        </Typography>

        {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mt: 2, color: 'var(--color-text-dark)', fontSize: 'var(--font-size-subheading)' }}>
            Agent & Vessel Details:
          </Typography>

          <FormControl fullWidth margin="normal" required disabled={submitting}>
            <InputLabel id="submitted-by-label">Submitted By</InputLabel>
            <Select
              labelId="submitted-by-label"
              name="submittedById"
              value={formData.submittedById}
              onChange={handleChange}
            >
              {representatives.length === 0 ? (
                <MenuItem value="">No representatives available</MenuItem>
              ) : (
                representatives.map(r => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name} - {r.organizationName}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required disabled={submitting}>
            <InputLabel id="vessel-select-label">Vessel IMO/ID</InputLabel>
            <Select
              labelId="vessel-select-label"
              name="vesselId"
              value={formData.vesselId}
              onChange={handleChange}
            >
              {vessels.map(v => (
                <MenuItem key={v.id} value={v.id}>
                  {v.imoNumber} - {v.vesselName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Estimated Time of Arrival (ETA)"
            name="eta"
            type="datetime-local"
            value={formData.eta}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Estimated Time of Departure (ETD)"
            name="etd"
            type="datetime-local"
            value={formData.etd}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Typography variant="h6" sx={{ mt: 3, color: 'var(--color-text-dark)', fontSize: 'var(--font-size-subheading)' }}>
            Cargo Manifest & Crew:
          </Typography>

          <TextField
            label="Loading / Unloading"
            name="loadunload"
            value={formData.loadunload}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Container IDs (Comma Separated)"
            name="manifestContainers"
            value={formData.manifestContainers}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Crew Name"
            name="crewName"
            value={formData.crewName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Crew Citizen ID"
            name="crewCitizenId"
            value={formData.crewCitizenId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Crew Nationality"
            name="crewNationality"
            value={formData.crewNationality}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <LoadingButton
            type="submit"
            variant="contained"
            loading={submitting}
            sx={{ mt: 3, py: 1.5, backgroundColor: 'var(--color-primary)', color: 'var(--color-text-light)' }}
            fullWidth
          >
            Add VVN
          </LoadingButton>
        </form>
      </Container>
    </>
  );
};

export default AddVVNPage;
