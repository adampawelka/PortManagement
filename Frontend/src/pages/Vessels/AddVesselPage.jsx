import React from 'react';
import { 
  Container, Typography, Alert, TextField, Button, 
  FormControl, InputLabel, Select, MenuItem, CircularProgress 
} from '@mui/material';
import { useAddVesselVM } from '../../viewmodels/Vessels/useAddVesselVM';

const AddVesselPage = () => {
  const vm = useAddVesselVM();

  // While initial data is loading
  if (vm.loading) 
    return <Container sx={{ mt: 4, color: 'var(--color-text-dark)', fontFamily: 'var(--font-family-base)' }}>Loading initial data...</Container>;

  // If critical API error occurred, block form completely
  if (vm.criticalError) {
    return (
      <Container sx={{ mt: 4, fontFamily: 'var(--font-family-base)' }}>
        <Alert severity="error">Cannot reach the server. Form is disabled. Try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="sm" 
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
        sx={{ color: 'var(--color-primary-light)', fontWeight: 600, mb: 3, fontSize: 'var(--font-size-large)' }}
      >
        Add New Vessel
      </Typography>

      {vm.message && (
        <Alert 
          severity={vm.message.type} 
          sx={{ mb: 2 }}
        >
          {vm.message.text}
        </Alert>
      )}

      <form onSubmit={vm.handleSubmit}>
        <TextField
          label="IMO Number"
          name="imoNumber"
          value={vm.formData.imoNumber}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
          helperText="Exactly 7 digits"
        />
        <TextField
          label="Vessel Name"
          name="vesselName"
          value={vm.formData.vesselName}
          onChange={vm.handleChange}
          required
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required disabled={vm.partialError}>
          <InputLabel>Vessel Type</InputLabel>
          <Select
            name="vesselTypeId"
            value={vm.formData.vesselTypeId}
            label="Vessel Type"
            onChange={vm.handleChange}
          >
            {vm.vesselTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required disabled={vm.partialError}>
          <InputLabel>Operator / Owner</InputLabel>
          <Select
            name="operatorOwner"
            value={vm.formData.operatorOwner}
            label="Operator / Owner"
            onChange={vm.handleChange}
          >
            {vm.shippingAgents.map(agent => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.legalName} ({agent.taxNumber})
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
            mt: 3, 
            py: 1.5, 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-light)',
            '&:hover': { backgroundColor: 'var(--color-primary-light)' }
          }}
        >
          {vm.submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Vessel'}
        </Button>
      </form>
    </Container>
  );
};

export default AddVesselPage;
