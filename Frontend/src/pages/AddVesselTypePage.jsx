import React, { useState } from 'react';
import { useApi } from '../services/api';
import "../styles/App.css";
import { Container, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';

// DTO simplificado para Vessel Type
const initialFormState = {
  name: '',
  description: '',
  capacity: 0,
  maxRows: 0, // Restricción Operacional 1
  maxBays: 0, // Restricción Operacional 2
  maxTiers: 0, // Restricción Operacional 3
};

const AddVesselTypePage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 
  
  const { apiFetch } = useApi();


  const handleChange = (e) => {
    const { name, value } = e.target;
    // Manejo de números para los campos de capacidad/restricciones
    setFormData({ 
      ...formData, 
      [name]: (name === 'capacity' || name.startsWith('max')) ? parseInt(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validación básica
    if (!formData.name || !formData.capacity) {
        setMessage({ type: 'error', text: 'Name and Capacity are required.' });
        setLoading(false);
        return;
    }
    
    // Crear el DTO final con el formato que espera el Backend
    const vesselTypeDto = {
        Name: formData.name, // <-- Name (PascalCase)
        Description: formData.description,
        Capacity: formData.capacity,
        // FIX CRÍTICO: Usar PascalCase para el objeto anidado y sus propiedades
        Constraints: { // <-- Objeto anidado con 'O' y 'C' MAYÚSCULAS
            MaxRows: formData.maxRows,   // <-- MaxRows MAYÚSCULAS
            MaxBays: formData.maxBays,
            MaxTiers: formData.maxTiers,
        }
    };
    
    try {
        const response = await apiFetch('/api/VesselTypes', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(vesselTypeDto)
        });

        if (response.ok) {
            setMessage({ type: 'success', text: 'Vessel Type created successfully!' });
            setFormData(initialFormState);
        } else {
            const errorData = response.status === 400 ? await response.json() : { Message: response.statusText };
            setMessage({ type: 'error', text: `Submission failed: ${errorData.Message || response.statusText}` });
        }
    } catch (err) {
        setMessage({ type: 'error', text: 'Network error or token failure. Check backend status.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Add New Vessel Type (US 2.2.1)</Typography>
      
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth margin="normal" />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={2} />
        <TextField label="Capacity (TEUs)" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required fullWidth margin="normal" />
        
        <Typography variant="h6" sx={{ mt: 3 }}>Operational Constraints:</Typography>
        <TextField label="Max Rows" name="maxRows" type="number" value={formData.maxRows} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Max Bays" name="maxBays" type="number" value={formData.maxBays} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Max Tiers" name="maxTiers" type="number" value={formData.maxTiers} onChange={handleChange} fullWidth margin="normal" />
        
        <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 3, py: 1.5 }} fullWidth>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Vessel Type'}
        </Button>
      </form>
    </Container>
  );
};

export default AddVesselTypePage;