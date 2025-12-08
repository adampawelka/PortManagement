import React from 'react';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useAddVesselVM } from '../viewmodels/useAddVesselVM';

const AddVesselPage = () => {
  const vm = useAddVesselVM();

  if (vm.loading) return <Container sx={{ mt: 4 }}>Loading initial data...</Container>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Add New Vessel</Typography>

      {vm.message && <Alert severity={vm.message.type} sx={{ mb: 2 }}>{vm.message.text}</Alert>}

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

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Vessel Type</InputLabel>
          <Select
            name="vesselTypeId"
            value={vm.formData.vesselTypeId}
            label="Vessel Type"
            onChange={vm.handleChange}
          >
            {vm.vesselTypes.map(type => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Operator / Owner</InputLabel>
          <Select
            name="operatorOwner"
            value={vm.formData.operatorOwner}
            label="Operator / Owner"
            onChange={vm.handleChange}
          >
            {vm.shippingAgents.map(agent => <MenuItem key={agent.id} value={agent.id}>{agent.legalName} ({agent.taxNumber})</MenuItem>)}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" disabled={vm.submitting} sx={{ mt: 3, py: 1.5 }} fullWidth>
          {vm.submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Vessel'}
        </Button>
      </form>
    </Container>
  );
};

export default AddVesselPage;
