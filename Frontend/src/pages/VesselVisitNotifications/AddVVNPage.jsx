import React from 'react';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useAddVesselVisitNotificationVM } from '../../viewmodels/useAddVesselVisitNotificationVM';

const AddVVNPage = () => {
  const { formData, vessels, loading, submitting, message, handleChange, handleSubmit } = useAddVesselVisitNotificationVM();

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /> Loading vessels...</Container>;

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        backgroundColor: 'var(--color-surface)', // Use CSS variable for background
        p: 4,
        borderRadius: 'var(--radius-md)', // Border radius from variables
        boxShadow: 3,
        fontFamily: 'var(--font-family-base)', // Font family from CSS variables
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'var(--color-primary-light)', // Primary color from CSS
          fontWeight: 600,
          mb: 3,
          fontSize: 'var(--font-size-heading)', // Font size from variables
        }}
      >
        Add a New Vessel Visit Notification
      </Typography>

      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <form onSubmit={handleSubmit}>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: 'var(--color-text-dark)', // Text color from CSS variables
            fontSize: 'var(--font-size-subheading)', // Font size for subheadings
          }}
        >
          Agent & Vessel Details:
        </Typography>

        <TextField
          label="Submitted By (Agent Representative ID)"
          name="submittedById"
          value={formData.submittedById}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          helperText="Enter the Agent Representative's GUID/ID manually (99d3d3a0-fdc2-47b2-8ee5-32aecc525efe)."
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)', // Border color from CSS variables
            },
            '& .MuiInputBase-input': {
              color: 'var(--color-text-dark)', // Text color for input field
            },
          }}
        />

        <FormControl fullWidth margin="normal" required disabled={submitting} sx={{ '& .MuiInputLabel-root': { color: 'var(--color-text-dark)' } }}>
          <InputLabel id="vessel-select-label">Vessel IMO/ID</InputLabel>
          <Select
            labelId="vessel-select-label"
            name="vesselId"
            value={formData.vesselId}
            label="Vessel IMO/ID"
            onChange={handleChange}
            sx={{
              '& .MuiInputBase-input': {
                color: 'var(--color-text-dark)', // Text color for input field
              },
              '& .MuiOutlinedInput-root': {
                borderColor: 'var(--color-border)', // Border color from CSS variables
              },
            }}
          >
            {vessels.map((v) => (
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
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)',
            },
          }}
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
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)',
            },
          }}
        />

        <Typography
          variant="h6"
          sx={{
            mt: 3,
            color: 'var(--color-text-dark)',
            fontSize: 'var(--font-size-subheading)',
          }}
        >
          Cargo Manifest & Crew:
        </Typography>

        <TextField
          label="Loading / Unloading"
          name="loadunload"
          value={formData.loadunload}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={1}
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)',
            },
          }}
        />

        <TextField
          label="Container IDs (Comma Separated)"
          name="manifestContainers"
          value={formData.manifestContainers}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
          helperText="Example: ABCU1234567, XYZU9876543"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)',
            },
          }}
        />

        <TextField
          label="Crew Name"
          name="crewName"
          value={formData.crewName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)',
            },
          }}
        />

        <TextField
          label="Crew Citizen ID"
          name="crewCitizenId"
          value={formData.crewCitizenId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          helperText="123456789"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)',
            },
          }}
        />

        <TextField
          label="Crew Nationality"
          name="crewNationality"
          value={formData.crewNationality}
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'var(--color-text-dark)',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: 'var(--color-border)',
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: 'var(--color-primary)', // Button background color
            color: 'var(--color-text-light)', // Button text color
            '&:hover': {
              backgroundColor: 'var(--color-primary-dark)', // Darken button on hover
            },
          }}
          fullWidth
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Add VVN'}
        </Button>
      </form>
    </Container>
  );
};

export default AddVVNPage;
