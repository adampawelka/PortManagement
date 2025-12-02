import React, { useState, useEffect } from 'react';
import { useApi } from '../services/api';
import { Container, TextField, Button, Typography, CircularProgress, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const initialFormState = {
  imoNumber: '',
  vesselName: '',
  vesselTypeId: '', 
  operatorOwner: '', 
};

const AddVesselPage = () => {
  const { apiFetch } = useApi();
  const [formData, setFormData] = useState(initialFormState);
  const [vesselTypes, setVesselTypes] = useState([]); 
  const [shippingAgents, setShippingAgents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); 

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [typesRes, agentsRes] = await Promise.all([
            apiFetch('/api/VesselTypes'),
            apiFetch('/api/ShippingAgents'),
        ]);

        if (!typesRes.ok || !agentsRes.ok) {
            throw new Error('One or more data streams failed to load.');
        }

        const [typesData, agentsData] = await Promise.all([
            typesRes.json(),
            agentsRes.json(),
        ]);

        setVesselTypes(typesData);
        setShippingAgents(agentsData); 
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
        setMessage({ type: 'error', text: 'Failed to load initial data (Vessel Types or Agents).' });
      }
    };
    loadInitialData();
  }, [apiFetch]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    
    if (!formData.imoNumber || !formData.vesselTypeId || !formData.operatorOwner) {
        setMessage({ type: 'error', text: 'IMO, Vessel Type, and Operator/Owner are required.' });
        setSubmitting(false);
        return;
    }
    
    // DTO con PascalCase
    const vesselDto = {
        imo: formData.imoNumber,
        vesselName: formData.vesselName,
        vesselTypeId: formData.vesselTypeId, 
        ownerId: formData.operatorOwner, 
    };
    
    try {
        const response = await apiFetch('/api/Vessels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vesselDto)
        });

        if (response.ok) {
            setMessage({ type: 'success', text: 'Vessel added successfully!' });
            setFormData(initialFormState);
        } else {
            const errorData = response.status === 400 ? await response.json() : { Message: response.statusText };
            setMessage({ type: 'error', text: `Submission failed: ${errorData.Message || response.statusText}` });
        }
    } catch (err) {
        setMessage({ type: 'error', text: 'Network error or token failure.' });
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <Container sx={{ mt: 4 }}>Loading initial data...</Container>;
  
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Add New Vessel</Typography>
      
      {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField label="IMO Number" name="imoNumber" value={formData.imoNumber} onChange={handleChange} required fullWidth margin="normal" />
        <TextField label="Vessel Name" name="vesselName" value={formData.vesselName} onChange={handleChange} required fullWidth margin="normal" />
        
        {/* --- DROPDOWN PARA SELECCIÓN DE TIPO --- */}
        <FormControl fullWidth margin="normal" required>
            <InputLabel>Vessel Type</InputLabel>
            <Select
                name="vesselTypeId"
                value={formData.vesselTypeId}
                label="Vessel Type"
                onChange={handleChange}
            >
                {vesselTypes.map((type) => (
                    // Asumo que el DTO de VesselType tiene un campo 'id' y un campo 'name'
                    <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
        
        {/* --- DROPDOWN PARA SELECCIÓN DE OPERATOR/OWNER --- */}
        <FormControl fullWidth margin="normal" required>
            <InputLabel>Operator / Owner (Shipping Agent Org.)</InputLabel>
            <Select
                name="operatorOwner"
                value={formData.operatorOwner}
                label="Operator / Owner (Shipping Agent Org.)"
                onChange={handleChange}
            >
                {shippingAgents.map((agent) => (
                    // Asumo que el DTO de ShippingAgent tiene un campo 'id' y un campo 'legalName'
                    <MenuItem key={agent.id} value={agent.id}>{agent.legalName} ({agent.taxNumber})</MenuItem>
                ))}
            </Select>
        </FormControl>
        
        <Button type="submit" variant="contained" disabled={submitting} sx={{ mt: 3, py: 1.5 }} fullWidth>
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Vessel'}
        </Button>
      </form>
    </Container>
  );
};

export default AddVesselPage;